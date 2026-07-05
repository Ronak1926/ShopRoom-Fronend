"use client";

/**
 * MiniMap — compact Leaflet map shown in the sidebar.
 *
 * • On mount: centres on customer's location (if available) with 10 km radius view,
 *   fetches all pins in that initial bbox, then shows them.
 * • On viewport move: re-fetches pins for the new bbox (debounced 600 ms).
 * • Caching: keyed by bbox tile (rounded to 0.5 degree grid). If cached < 30 s old,
 *   skip the network request. Any new shop added will bust the cache via ETag.
 * • Clicking the expand icon navigates to /customer/map (full-screen map).
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import StatusDot from "@/components/ui/StatusDot";

export type MapPin = {
  shopId: string;
  roomId: string;
  shopName: string;
  category: string;
  logoUrl: string | null;
  coverUrl: string | null;
  inviteCode: string;
  membersCount: number;
  lat: number;
  lng: number;
  city: string;
  distanceKm: number | null;
};

type Props = {
  customerLat: number | null;
  customerLng: number | null;
  onPinCountChange?: (count: number) => void;
};

// ── Viewport-keyed cache ─────────────────────────────────────────────────────
// Key: "swLat,swLng,neLat,neLng" rounded to 0.2° grid (≈ 22km cells)
// Value: { pins, fetchedAt }

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

export default function MiniMap({
  customerLat,
  customerLng,
  onPinCountChange,
}: Props) {
  const router = useRouter();
  // Stable ref so the Leaflet click callback always has the latest push fn
  const routerRef = useRef(router.push.bind(router));
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchSeqRef = useRef(0);
  const [pinCount, setPinCount] = useState(0);

  // ── Fetch pins for current bbox ──────────────────────────────────────────
  const fetchPins = useCallback(async (map: import("leaflet").Map) => {
    const token = getCookie("token");
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

    // Check cache
    const cached = pinCache.get(key);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
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

      if (seq !== fetchSeqRef.current) return;

      if (res.status === 304 && cached) {
        // Not modified — refresh timestamp only
        pinCache.set(key, { ...cached, fetchedAt: Date.now() });
        renderPins(map, cached.pins);
        return;
      }

      const etag = (res.headers["etag"] as string) ?? "";
      pinCache.set(key, { pins: res.data.pins, etag, fetchedAt: Date.now() });
      renderPins(map, res.data.pins);
    } catch {
      // ignore
    }
  }, []);

  // ── Render Leaflet markers ───────────────────────────────────────────────
  const renderPins = useCallback(
    (map: import("leaflet").Map, pins: MapPin[]) => {
      const L = (window as any).L as typeof import("leaflet");

      // Clear previous markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

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
              width:36px;height:36px;border-radius:50%;
              background:var(--color-brand-primary);border:2.5px solid #fff;
              box-shadow:0 2px 8px rgba(15,23,42,0.28);
              display:flex;align-items:center;justify-content:center;
              overflow:hidden;cursor:pointer;
            ">${logoHtml}</div>
            <div style="
              width:8px;height:8px;background:var(--color-brand-primary);border-radius:50%;
              margin:-4px auto 0;box-shadow:0 1px 3px rgba(15,23,42,0.3);
            "></div>
          `,
          iconSize: [36, 44],
          iconAnchor: [18, 44],
          popupAnchor: [0, -46],
        });

        const coverBg = pin.coverUrl
          ? `<div style="height:80px;background:url(${pin.coverUrl}) center/cover;border-radius:6px 6px 0 0;"></div>`
          : `<div style="height:40px;background:linear-gradient(135deg,var(--color-brand-primary),var(--color-avatar-2));border-radius:6px 6px 0 0;"></div>`;

        const popupContent = `
          <div style="width:180px;font-family:sans-serif;border-radius:6px;overflow:hidden;box-shadow:none;">
            ${coverBg}
            <div style="padding:8px 10px;">
              <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);">${pin.shopName}</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-hint);margin-top:2px;">${pin.category}</div>
              <div style="font-size:11px;color:var(--color-text-secondary);margin-top:5px;">👥 ${pin.membersCount} members</div>
              ${pin.distanceKm !== null ? `<div style="font-size:11px;color:var(--color-brand-primary);margin-top:2px;">📍 ${pin.distanceKm} km away</div>` : ""}
            </div>
          </div>
        `;

        const marker = L.marker([pin.lat, pin.lng], { icon })
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 200, className: "shoproom-popup" });

        markersRef.current.push(marker);
      });

      setPinCount(pins.length);
      onPinCountChange?.(pins.length);
    },
    [onPinCountChange],
  );

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return; // already initialised
    if (!mapDivRef.current) return;

    import("leaflet").then((L) => {
      // Inject Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      // Inject popup style override
      if (!document.getElementById("shoproom-map-style")) {
        const style = document.createElement("style");
        style.id = "shoproom-map-style";
        style.textContent = `
          .shoproom-popup .leaflet-popup-content-wrapper { padding:0; border-radius:8px; overflow:hidden; }
          .shoproom-popup .leaflet-popup-content { margin:0; }
          .shoproom-popup .leaflet-popup-tip { display:none; }
          .leaflet-control-attribution { font-size:9px !important; }
        `;
        document.head.appendChild(style);
      }

      // Fix default icon paths
      (L.Icon.Default as any).mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Expose L globally for renderPins callback
      (window as any).L = L;

      const defaultCenter: [number, number] =
        customerLat !== null && customerLng !== null
          ? [customerLat, customerLng]
          : [23.0225, 72.5714]; // Ahmedabad fallback

      const map = L.map(mapDivRef.current!, {
        center: defaultCenter,
        zoom: 12, // ~10 km radius view
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      // Customer location dot
      if (customerLat !== null && customerLng !== null) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:16px;height:16px;">
              <div style="position:absolute;inset:0;border-radius:50%;background:color-mix(in srgb, var(--color-brand-primary) 25%, transparent);animation:pulse 1.8s infinite;"></div>
              <div style="position:absolute;inset:3px;border-radius:50%;background:var(--color-brand-primary);border:2px solid white;box-shadow:0 1px 4px rgba(15,23,42,0.3);"></div>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([customerLat, customerLng], { icon: pulseIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindTooltip("You are here", { permanent: false, direction: "top" });

        // Inject pulse animation
        if (!document.getElementById("shoproom-pulse-style")) {
          const s = document.createElement("style");
          s.id = "shoproom-pulse-style";
          s.textContent = `@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(2.2);opacity:0} }`;
          document.head.appendChild(s);
        }
      }

      mapRef.current = map;

      // Navigate to full map on any click
      map.on("click", () => {
        routerRef.current("/customer/map");
      });

      // Initial fetch — wait for Leaflet to be ready and compute correct bounds
      map.invalidateSize();
      map.whenReady(() => fetchPins(map));

      // Re-fetch on viewport move (debounced)
      map.on("moveend", () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchPins(map), 500);
      });
      map.on("zoomend", () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchPins(map), 500);
      });
    });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-52 shrink-0 relative overflow-hidden">
      {/* Leaflet mount point */}
      <div ref={mapDivRef} className="w-full h-full" />

      {/* Pin count badge */}
      <div
        className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-(--color-text-primary) pl-2 pr-2.5 py-1 rounded-full shadow-(--shadow-xs) pointer-events-none"
        style={{ zIndex: 1000 }}
      >
        <StatusDot status="online" size={6} />
        {pinCount} shop{pinCount !== 1 ? "s" : ""} in view
      </div>

      {/* Expand to full-screen */}
      <button
        onClick={() => router.push("/customer/map")}
        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-(--shadow-xs) cursor-pointer border-0 hover:bg-(--color-brand-primary-light) transition-colors"
        style={{ zIndex: 1000 }}
        title="Open full map"
      >
        <OpenInFullOutlinedIcon
          sx={{ fontSize: 14, color: "var(--color-text-secondary)" }}
        />
      </button>

      {/* Location label */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2 border-t border-(--color-border-default) pointer-events-none"
        style={{ backgroundColor: "rgba(255,255,255,0.94)", zIndex: 1000 }}
      >
        <div className="text-[10px] uppercase tracking-widest text-(--color-text-hint) font-semibold">
          Active Search Area
        </div>
        <div className="text-[13px] font-semibold text-(--color-text-primary)">
          Near You
        </div>
      </div>
    </div>
  );
}
