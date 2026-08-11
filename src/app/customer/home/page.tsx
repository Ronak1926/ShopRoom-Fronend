"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie, deleteCookie } from "@/utils/cookieUtils";
import Sidebar from "@/components/customer/Sidebar";
import DiscoverTopBar from "./_components/DiscoverTopBar";
import DiscoverHeader from "./_components/DiscoverHeader";
import RoomsGrid from "./_components/RoomsGrid";
import DiscoverSidebar from "./_components/DiscoverSidebar";
import type {
  DiscoverResponse,
  RoomCard,
  SortOption,
  TrendingItem,
  ViewMode,
} from "./types";

export default function CustomerHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("discover");
  const [activeChip, setActiveChip] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [rooms, setRooms] = useState<RoomCard[]>([]);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<SortOption>("nearest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [customerLat, setCustomerLat] = useState<number | null>(null);
  const [customerLng, setCustomerLng] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("Account");
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
    async (
      chip: string,
      currentSort: SortOption,
      pageNum: number,
      append: boolean,
    ) => {
      const token = getCookie("token");
      if (!token) {
        router.replace("/customer/login");
        return;
      }
      setAuthToken(token);
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const isTrending = chip === "Trending";
        const params: Record<string, string | number> = {
          sort: isTrending ? "popular" : currentSort,
          page: pageNum,
        };
        if (!isTrending && chip !== "All") params.category = chip;

        const res = await apiClient.get<DiscoverResponse>(
          "/api/rooms/discover",
          { params },
        );
        setRooms((prev) => (append ? [...prev, ...res.data.rooms] : res.data.rooms));
        setTrending(res.data.trending);
        setCategories((prev) => (prev.length ? prev : res.data.categories));
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
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
        if (append) setLoadingMore(false);
        else setLoading(false);
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
          fullName: string;
          allowLocationAccess: boolean;
          latitude: number | null;
          longitude: number | null;
        };
      }>("/api/customers/me")
      .then((res) => {
        const c = res.data.customer;
        setCustomerName(c.fullName);
        if (c.allowLocationAccess && c.latitude && c.longitude) {
          setCustomerLat(c.latitude);
          setCustomerLng(c.longitude);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchDiscover(activeChip, sort, 0, false);
  }, [activeChip, sort, fetchDiscover]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || debouncedQuery.trim() || page + 1 >= totalPages) {
      return;
    }
    fetchDiscover(activeChip, sort, page + 1, true);
  }, [loading, loadingMore, debouncedQuery, page, totalPages, activeChip, sort, fetchDiscover]);

  // Infinite scroll: fetch the next page once the user has scrolled through
  // 70% of the currently loaded rooms.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el || el.scrollHeight <= el.clientHeight) return;
      const scrolledRatio = (el.scrollTop + el.clientHeight) / el.scrollHeight;
      if (scrolledRatio >= 0.7) loadMore();
    }

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

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

  function handleNavChange(id: string) {
    if (id === "myrooms") router.push("/customer/myrooms");
    else setActiveNav(id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DiscoverTopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeChip={activeChip}
          onChipChange={setActiveChip}
          filterChips={filterChips}
          customerName={customerName}
          onProfileClick={() => router.push("/customer/profile")}
        />

        {/* Room Grid Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          <DiscoverHeader
            categories={categories}
            activeChip={activeChip}
            onChipChange={setActiveChip}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="mt-4">
            <RoomsGrid
              rooms={filteredRooms}
              loading={loading}
              loadingMore={loadingMore}
              viewMode={viewMode}
              joiningRoomId={joiningRoomId}
              searchQuery={debouncedQuery}
              onJoin={handleJoinRoom}
            />
          </div>
        </div>
      </div>

      <DiscoverSidebar
        customerLat={customerLat}
        customerLng={customerLng}
        trending={trending}
      />
    </div>
  );
}
