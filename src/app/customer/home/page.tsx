"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie, deleteCookie } from "@/utils/cookieUtils";
import Sidebar from "@/components/customer/Sidebar";
import Avatar from "@/components/ui/Avatar";
import StatusDot from "@/components/ui/StatusDot";
import ClearIcon from "@mui/icons-material/Clear";

// Lazy-load MiniMap so Leaflet (browser-only) doesn't break SSR
const MiniMap = dynamic(() => import("@/components/map/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-52 bg-(--color-gray-100) animate-pulse" />
  ),
});

type RoomCard = {
  roomId: string;
  shopName: string;
  category: string;
  logoUrl: string | null;
  coverUrl: string | null;
  membersCount: number;
  inviteCode: string;
  city: string;
  distanceKm: number | null;
  likes: number;
  activeNow: boolean;
  isJoined: boolean;
};

type TrendingItem = {
  roomId: string;
  shopName: string;
  category: string;
  logoUrl: string | null;
  membersCount: number;
};

type DiscoverResponse = {
  total: number;
  rooms: RoomCard[];
  trending: TrendingItem[];
  categories: string[];
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function CustomerHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("discover");
  const [activeChip, setActiveChip] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [rooms, setRooms] = useState<RoomCard[]>([]);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"nearest" | "popular">("nearest");
  const [customerLat, setCustomerLat] = useState<number | null>(null);
  const [customerLng, setCustomerLng] = useState<number | null>(null);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  // Guard: redirect to login if no token
  useEffect(() => {
    if (!getCookie("token")) {
      router.replace("/customer/login");
    }
  }, [router]);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const fetchDiscover = useCallback(
    async (chip: string, currentSort: "nearest" | "popular") => {
      const token = getCookie("token");
      if (!token) {
        router.replace("/customer/login");
        return;
      }
      setAuthToken(token);
      setLoading(true);
      try {
        const isTrending = chip === "Trending";
        const params: Record<string, string> = {
          sort: isTrending ? "popular" : currentSort,
        };
        if (!isTrending && chip !== "All") params.category = chip;

        const res = await apiClient.get<DiscoverResponse>(
          "/api/rooms/discover",
          { params },
        );
        setRooms(res.data.rooms);
        setTrending(res.data.trending);
        setTotal(res.data.total);
        setCategories((prev) => (prev.length ? prev : res.data.categories));
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 401
        ) {
          deleteCookie("token");
          router.replace("/customer/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const handleJoinRoom = useCallback(
    async (room: RoomCard) => {
      if (room.isJoined) {
        router.push(`/customer/room/${room.roomId}`);
        return;
      }
      const token = getCookie("token");
      if (!token) {
        router.replace("/customer/login");
        return;
      }
      setAuthToken(token);
      setJoiningRoomId(room.roomId);
      try {
        await apiClient.post(`/api/shop/join/${room.inviteCode}`);
        router.push("/customer/myrooms");
      } catch {
        setJoiningRoomId(null);
      }
    },
    [router],
  );

  // Fetch customer location for MiniMap
  useEffect(() => {
    const token = getCookie("token");
    if (!token) return;
    setAuthToken(token);
    apiClient
      .get<{
        customer: {
          allowLocationAccess: boolean;
          latitude: number | null;
          longitude: number | null;
        };
      }>("/api/customers/me")
      .then((res) => {
        const c = res.data.customer;
        if (c.allowLocationAccess && c.latitude && c.longitude) {
          setCustomerLat(c.latitude);
          setCustomerLng(c.longitude);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchDiscover(activeChip, sort);
  }, [activeChip, sort, fetchDiscover]);

  const filteredRooms = useMemo(() => {
    if (!debouncedQuery.trim()) return rooms;
    const q = debouncedQuery.toLowerCase();
    return rooms.filter(
      (r) =>
        r.shopName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q),
    );
  }, [rooms, debouncedQuery]);

  const filterChips = ["All", ...categories, "Trending"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleNavChange(id: string) {
    if (id === "myrooms") router.push("/customer/myrooms");
    else setActiveNav(id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-3 shrink-0">
          {/* Search pill */}
          <div className="flex items-center h-10 rounded-xl bg-(--color-bg-page) border border-(--color-border-default) px-3 gap-2 flex-1 max-w-xl transition-colors focus-within:border-(--color-brand-primary)">
            <SearchOutlinedIcon
              sx={{
                fontSize: 18,
                color: "var(--color-text-hint)",
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              placeholder="Search rooms, shops or categories..."
              className="flex-1 bg-transparent outline-none text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-(--color-text-hint) cursor-pointer border-0 bg-transparent px-1"
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </button>
            )}
            <div className="w-px h-5 bg-(--color-border-default) shrink-0" />
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 14,
                color: "var(--color-brand-primary)",
                flexShrink: 0,
              }}
            />
            <span className="text-xs font-medium text-(--color-brand-primary) whitespace-nowrap shrink-0">
              Near You
            </span>
          </div>

          {/* Filter btn + dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`h-10 px-3 rounded-xl bg-(--color-bg-page) border flex items-center gap-1.5 text-[13px] font-medium cursor-pointer transition-colors ${
                activeChip !== "All"
                  ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
                  : "border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
              }`}
            >
              <TuneOutlinedIcon sx={{ fontSize: 16 }} />
              {activeChip !== "All" ? activeChip : "Filter"}
              <KeyboardArrowDownOutlinedIcon
                sx={{
                  fontSize: 16,
                  transition: "transform 0.2s",
                  transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown panel */}
            {filterOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl shadow-(--shadow-lg) p-3 min-w-52">
                <p className="text-[11px] font-semibold text-(--color-text-hint) uppercase tracking-wider mb-2 px-1">
                  Category
                </p>
                <div className="flex flex-col gap-1">
                  {filterChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setActiveChip(chip);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                        activeChip === chip
                          ? "bg-(--color-brand-primary) text-white"
                          : "text-(--color-text-primary) hover:bg-(--color-bg-page)"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center cursor-pointer border-0 bg-transparent rounded-full hover:bg-(--color-bg-page) transition-colors">
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: 22, color: "var(--color-text-secondary)" }}
              />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-(--color-danger-dot) ring-2 ring-(--color-bg-surface)" />
            </button>

            {/* Profile avatar */}
            <Avatar name="Account" size="md" />
          </div>
        </div>

        {/* Room Grid Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Row header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-(--color-text-secondary)">
              {loading ? (
                "Loading rooms..."
              ) : (
                <>
                  Showing{" "}
                  <span className="font-bold text-(--color-text-primary)">
                    {debouncedQuery ? filteredRooms.length : total}{" "}
                    {(debouncedQuery ? filteredRooms.length : total) === 1
                      ? "room"
                      : "rooms"}
                  </span>{" "}
                  {debouncedQuery ? `matching "${debouncedQuery}"` : "near you"}
                </>
              )}
            </span>
            <button
              onClick={() =>
                setSort((s) => (s === "nearest" ? "popular" : "nearest"))
              }
              className="flex items-center gap-1 text-[13px] text-(--color-brand-primary) font-medium cursor-pointer border border-(--color-border-default) rounded-full px-3 h-8 bg-transparent hover:bg-(--color-brand-primary-light) transition-colors"
            >
              Sort by: {sort === "nearest" ? "Nearest" : "Popular"}
              <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) overflow-hidden animate-pulse"
                >
                  <div className="h-44 bg-(--color-gray-100)" />
                  <div className="px-4 pt-6 pb-4 space-y-2">
                    <div className="h-4 bg-(--color-gray-100) rounded w-3/4" />
                    <div className="h-3 bg-(--color-gray-100) rounded w-1/2" />
                    <div className="h-3 bg-(--color-gray-100) rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cards grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.roomId}
                  className="bg-(--color-bg-surface) rounded-2xl border border-(--color-border-default) overflow-hidden cursor-pointer hover:shadow-(--shadow-lg) hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  {/* Image zone */}
                  <div className="relative h-44">
                    {room.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={room.coverUrl}
                        alt={room.shopName}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-(--color-brand-primary-light) to-(--color-brand-primary-muted)" />
                    )}

                    {/* Shop logo overlay */}
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                      <Avatar
                        name={room.shopName}
                        src={room.logoUrl}
                        size="lg"
                        className="border-[3px] border-(--color-bg-surface) shadow-(--shadow-md)"
                      />
                    </div>

                    {/* Distance badge */}
                    {room.distanceKm !== null && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-(--color-text-primary) px-2 py-1 rounded-full shadow-(--shadow-xs)">
                        <NearMeOutlinedIcon
                          sx={{
                            fontSize: 12,
                            color: "var(--color-brand-primary)",
                          }}
                        />
                        {room.distanceKm} km away
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-4 pt-7 pb-4">
                    <div className="text-[15px] font-bold text-(--color-text-primary) mt-1 truncate">
                      {room.shopName}
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-semibold mt-0.5">
                      {room.category}
                    </div>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={room.activeNow ? "online" : "offline"} size={7} />
                        <span className="text-xs text-(--color-text-secondary)">
                          {room.activeNow ? "Active now" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PeopleOutlinedIcon
                          sx={{
                            fontSize: 13,
                            color: "var(--color-text-secondary)",
                          }}
                        />
                        <span className="text-xs text-(--color-text-secondary)">
                          {formatCount(room.membersCount)} members
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-(--color-border-default)">
                      <div className="flex items-center gap-1">
                        <FavoriteBorderIcon
                          sx={{ fontSize: 15, color: "var(--color-danger)" }}
                        />
                        <span className="text-[13px] text-(--color-text-secondary)">
                          {formatCount(room.likes)}
                        </span>
                      </div>
                      {room.isJoined ? (
                        <button
                          onClick={() => handleJoinRoom(room)}
                          className="h-9 px-4 flex items-center gap-1.5 bg-(--color-success-light) text-(--color-success-text) text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors hover:bg-(--color-badge-success-bg)"
                        >
                          <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
                          Already in Room
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinRoom(room)}
                          disabled={joiningRoomId === room.roomId}
                          className="h-9 px-5 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl border-0 cursor-pointer transition-colors"
                        >
                          {joiningRoomId === room.roomId ? "Joining..." : "Join Room"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* No results */}
              {filteredRooms.length === 0 && debouncedQuery && (
                <div className="col-span-full py-16 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-(--color-bg-page) flex items-center justify-center mb-4">
                    <SearchOffOutlinedIcon
                      sx={{ fontSize: 26, color: "var(--color-text-hint)" }}
                    />
                  </div>
                  <div className="text-[15px] font-semibold text-(--color-text-primary)">
                    No rooms found
                  </div>
                  <div className="text-sm text-(--color-text-secondary) mt-1">
                    Try a different search term or category
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <aside className="w-72 min-w-72 bg-(--color-bg-surface) border-l border-(--color-border-default) flex flex-col overflow-hidden">
        {/* Map section — contained card with padding */}
        <div className="px-4 pt-4 pb-0 shrink-0">
          <div className="rounded-2xl overflow-hidden border border-(--color-border-default) shadow-(--shadow-xs)">
            <MiniMap customerLat={customerLat} customerLng={customerLng} />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 mt-4 border-t border-(--color-border-default) shrink-0" />

        {/* Section header: Most Popular */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
          <span className="text-[13px] font-bold text-(--color-text-primary) tracking-tight">
            Most Popular This Week
          </span>
          <StarOutlinedIcon sx={{ fontSize: 16, color: "var(--color-brand-alert-hover)" }} />
        </div>

        {/* Trending list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
            {trending.map((item, index) => (
              <li
                key={item.roomId}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl cursor-pointer hover:bg-(--color-bg-page) transition-colors group"
              >
                <span className="w-5 text-[12px] font-bold text-(--color-text-hint) shrink-0 text-center">
                  {index + 1}
                </span>
                <Avatar
                  name={item.shopName}
                  src={item.logoUrl}
                  size="md"
                  shape="square"
                  className="shadow-(--shadow-xs)"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-(--color-text-primary) truncate leading-tight">
                    {item.shopName}
                  </div>
                  <div className="text-[11px] text-(--color-text-hint) mt-0.5">
                    {formatCount(item.membersCount)} members
                  </div>
                </div>
                <ChevronRightOutlinedIcon
                  sx={{
                    fontSize: 14,
                    color: "var(--color-text-hint)",
                    flexShrink: 0,
                  }}
                />
              </li>
            ))}
          </ul>

          <div className="mt-3 px-1">
            <button className="w-full h-9 border border-(--color-border-default) rounded-xl text-[13px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer bg-transparent">
              View All Trending
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
