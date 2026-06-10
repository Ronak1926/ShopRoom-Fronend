"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import type { MapPin } from "@/components/map/MiniMap";

// ── Viewport-keyed cache ──────────────────────────────────────────────────────
const CACHE_TTL_MS = 30_000;
type CacheEntry = { pins: MapPin[]; etag: string; fetchedAt: number };
const pinCache = new Map<string, CacheEntry>();

// Round to 2 decimal places (~1 km precision).
// Using a coarser snap-to-grid caused degenerate keys at high zoom (SW === NE),
// which made a single empty-area fetch poison the cache for all nearby viewports.
function bboxKey(swLat: number, swLng: number, neLat: number, neLng: number) {
  const r = (v: number) => v.toFixed(2);
  return `${r(swLat)},${r(swLng)},${r(neLat)},${r(neLng)}`;
}

// ── Hover card ────────────────────────────────────────────────────────────────
const CARD_W = 256;
// Icon: 40px circle + 8px dot with -4px overlap = 44px visual, anchor at y=48
const ICON_ANCHOR_Y = 48;
const CARD_GAP = 8; // gap between card bottom and icon top

function HoverCard({
  state,
  containerRef,
}: {
  state: { pin: MapPin; x: number; y: number } | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!state) return null;
  const { pin, x, y } = state;

  const cW = containerRef.current?.offsetWidth ?? 1200;
  const cH = containerRef.current?.offsetHeight ?? 800;

  // Center card horizontally on the marker, clamped to viewport edges
  let left = x - CARD_W / 2;
  left = Math.max(8, Math.min(left, cW - CARD_W - 8));

  // The card's bottom edge should sit CARD_GAP above the icon circle top (y - ICON_ANCHOR_Y)
  const cardBottomY = y - ICON_ANCHOR_Y - CARD_GAP;
  // If not enough room above (< ~220px estimated height), flip to below the icon
  const showAbove = cardBottomY > 220;

  // Use CSS `bottom` when showing above so the card anchors its bottom edge
  // precisely regardless of actual rendered card height (no hardcoded height needed)
  const posStyle: React.CSSProperties = showAbove
    ? { bottom: cH - cardBottomY, left, width: CARD_W, zIndex: 2000, transition: "left 0.12s, bottom 0.12s" }
    : { top: y + 8, left, width: CARD_W, zIndex: 2000, transition: "left 0.12s, top 0.12s" };

  const initials = pin.shopName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="absolute rounded-2xl overflow-hidden shadow-2xl border border-(--color-border-default) bg-(--color-bg-surface) pointer-events-none"
      style={posStyle}
    >
      {/* Cover image */}
      <div className="relative h-32">
        {pin.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pin.coverUrl}
            alt={pin.shopName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#5b47d4] to-[#8067e8]" />
        )}
        {/* Logo overlay */}
        <div className="absolute bottom-0 left-3 translate-y-1/2 w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden bg-(--color-brand-primary) flex items-center justify-center">
          {pin.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pin.logoUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-white">{initials}</span>
          )}
        </div>
        {/* Distance badge */}
        {pin.distanceKm !== null && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-(--color-text-primary) px-1.5 py-0.5 rounded-full">
            <NearMeOutlinedIcon
              sx={{ fontSize: 10, color: "var(--color-brand-primary)" }}
            />
            {pin.distanceKm} km
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-6 pb-4">
        <div className="text-[15px] font-bold text-(--color-text-primary)">
          {pin.shopName}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-(--color-text-hint) font-medium mt-1">
          {pin.category}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <PeopleOutlinedIcon
              sx={{ fontSize: 13, color: "var(--color-text-secondary)" }}
            />
            <span className="text-[12px] text-(--color-text-secondary)">
              {pin.membersCount} members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <LocationOnOutlinedIcon
              sx={{ fontSize: 13, color: "var(--color-text-secondary)" }}
            />
            <span className="text-[12px] text-(--color-text-secondary)">
              {pin.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FullMapPage() {
  const router = useRouter();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideCardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Sequence counter: each new fetch increments this; stale responses are ignored
  const fetchSeqRef = useRef(0);
  const [pinCount, setPinCount] = useState(0);
  const [hoverState, setHoverState] = useState<{
    pin: MapPin;
    x: number;
    y: number;
  } | null>(null);

  // ── Fetch pins ──────────────────────────────────────────────────────────
  const fetchPins = useCallback(
    async (map: import("leaflet").Map) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      setAuthToken(token);

      // Claim a sequence slot — any response with a lower seq is stale
      const seq = ++fetchSeqRef.current;

      const bounds = map.getBounds();
      const swLat = bounds.getSouthWest().lat;
      const swLng = bounds.getSouthWest().lng;
      const neLat = bounds.getNorthEast().lat;
      const neLng = bounds.getNorthEast().lng;
      const key = bboxKey(swLat, swLng, neLat, neLng);

      const cached = pinCache.get(key);
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        // Only apply if this is still the latest request
        if (seq !== fetchSeqRef.current) return;
        renderPins(map, cached.pins);
        return;
      }

      try {
        const res = await apiClient.get<{ total: number; pins: MapPin[] }>(
          "/api/rooms/map-pins",
          {
            params: { swLat, swLng, neLat, neLng },
            headers: cached?.etag ? { "If-None-Match": cached.etag } : {},
            validateStatus: (s) => s < 500,
          },
        );

        // Discard if a newer fetch has already been started
        if (seq !== fetchSeqRef.current) return;

        if (res.status === 304 && cached) {
          pinCache.set(key, { ...cached, fetchedAt: Date.now() });
          renderPins(map, cached.pins);
          return;
        }

        const etag = (res.headers["etag"] as string) ?? "";
        pinCache.set(key, { pins: res.data.pins, etag, fetchedAt: Date.now() });
        renderPins(map, res.data.pins);
      } catch {
        // ignore network errors
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Render markers ──────────────────────────────────────────────────────
  const renderPins = useCallback(
    (map: import("leaflet").Map, pins: MapPin[]) => {
      const L = (window as any).L as typeof import("leaflet");
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setHoverState(null);

      pins.forEach((pin) => {
        const initials = pin.shopName
          .split(/\s+/)
          .slice(0, 2)
          .map((w: string) => w[0]?.toUpperCase() ?? "")
          .join("");

        const logoHtml = pin.logoUrl
          ? `<img src="${pin.logoUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="" />`
          : `<span style="font-size:10px;font-weight:700;color:#fff;">${initials}</span>`;

        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              width:40px;height:40px;border-radius:50%;
              background:#5b47d4;border:2.5px solid #fff;
              box-shadow:0 2px 10px rgba(91,71,212,0.35);
              display:flex;align-items:center;justify-content:center;
              overflow:hidden;cursor:pointer;
            ">${logoHtml}</div>
            <div style="width:8px;height:8px;background:#5b47d4;border-radius:50%;margin:-4px auto 0;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

        // Hover: show card near marker
        marker.on("mouseover", () => {
          if (hideCardRef.current) {
            clearTimeout(hideCardRef.current);
            hideCardRef.current = null;
          }
          const pt = map.latLngToContainerPoint(marker.getLatLng());
          setHoverState({ pin, x: pt.x, y: pt.y });
        });

        marker.on("mouseout", () => {
          // Small delay so quickly moving to adjacent marker doesn't flicker
          hideCardRef.current = setTimeout(() => setHoverState(null), 200);
        });

        // Click: toggle card (keeps card open even when mouse leaves)
        marker.on("click", (e) => {
          (e as any).originalEvent?.stopPropagation();
          if (hideCardRef.current) {
            clearTimeout(hideCardRef.current);
            hideCardRef.current = null;
          }
          const pt = map.latLngToContainerPoint(marker.getLatLng());
          setHoverState((prev) =>
            prev?.pin.shopId === pin.shopId ? null : { pin, x: pt.x, y: pt.y },
          );
        });

        markersRef.current.push(marker);
      });

      // Update count to reflect pins in current viewport
      setPinCount(pins.length);
    },
    [],
  );

  // ── Init map ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return;
    if (!mapDivRef.current) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) setAuthToken(token);

    import("leaflet").then(async (L) => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!document.getElementById("shoproom-map-style")) {
        const style = document.createElement("style");
        style.id = "shoproom-map-style";
        style.textContent = `
          .leaflet-control-attribution { font-size:9px !important; }
          .leaflet-control-zoom { border-radius: 12px !important; overflow: hidden; }
        `;
        document.head.appendChild(style);
      }
      if (!document.getElementById("shoproom-pulse-style")) {
        const s = document.createElement("style");
        s.id = "shoproom-pulse-style";
        s.textContent = `@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(2.5);opacity:0} }`;
        document.head.appendChild(s);
      }

      (window as any).L = L;

      // Fetch customer location
      let defaultCenter: [number, number] = [23.0225, 72.5714];
      try {
        const meRes = await apiClient.get<{
          customer: {
            allowLocationAccess: boolean;
            latitude: number | null;
            longitude: number | null;
          };
        }>("/api/customers/me");
        const c = meRes.data.customer;
        if (c.allowLocationAccess && c.latitude && c.longitude) {
          defaultCenter = [c.latitude, c.longitude];
        }
      } catch {
        // fallback to Ahmedabad
      }

      const map = L.map(mapDivRef.current!, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // "You are here" pulsing dot
      if (defaultCenter[0] !== 23.0225) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:18px;height:18px;">
              <div style="position:absolute;inset:0;border-radius:50%;background:rgba(91,71,212,0.25);animation:pulse 1.8s infinite;"></div>
              <div style="position:absolute;inset:3px;border-radius:50%;background:#5b47d4;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        L.marker(defaultCenter, { icon: pulseIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindTooltip("You are here", { direction: "top" });
      }

      mapRef.current = map;

      // Ensure Leaflet has computed its size before the first fetch,
      // then also invalidate size in case the container was not fully laid out
      map.invalidateSize();
      map.whenReady(() => fetchPins(map));

      // Re-fetch when viewport changes (debounced)
      map.on("moveend", () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchPins(map), 500);
      });
      map.on("zoomend", () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchPins(map), 500);
      });

      // Clicking the map background dismisses the card
      map.on("click", () => setHoverState(null));
    });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (hideCardRef.current) clearTimeout(hideCardRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map */}
      <div ref={mapDivRef} className="w-full h-full" />

      {/* Top bar */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ zIndex: 1500 }}
      >
        {/* Explore pill */}
        <div className="flex items-center gap-2 h-10 px-4 bg-white rounded-full shadow-lg text-sm font-semibold text-(--color-text-primary)">
          <LocationOnOutlinedIcon
            sx={{ fontSize: 16, color: "var(--color-brand-primary)" }}
          />
          Explore on Map
        </div>
        {/* Shop count — updates as viewport changes */}
        <div className="h-10 px-4 bg-white rounded-full shadow-lg flex items-center gap-1.5 text-sm font-semibold text-(--color-text-primary)">
          <span className="w-2 h-2 rounded-full bg-(--color-brand-primary) animate-pulse" />
          {pinCount} shop{pinCount !== 1 ? "s" : ""} in this area
        </div>
        {/* Close */}
        <button
          onClick={() => router.back()}
          className="h-10 px-4 bg-(--color-text-primary) text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity"
        >
          <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          Close map
        </button>
      </div>

      {/* Hover card — positioned near hovered marker */}
      <HoverCard state={hoverState} containerRef={mapDivRef} />
    </div>
  );
}
