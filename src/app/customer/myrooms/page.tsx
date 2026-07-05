"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import Sidebar from "@/components/customer/Sidebar";
import Avatar from "@/components/ui/Avatar";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie, deleteCookie } from "@/utils/cookieUtils";

interface JoinedRoom {
  roomId: string;
  shopName: string;
  category: string;
  logoUrl: string | null;
  membersCount: number;
  joinedAt: string;
}

export default function MyRoomsPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("myrooms");
  const [rooms, setRooms] = useState<JoinedRoom[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.replace("/customer/login");
      return;
    }
    setAuthToken(token);
    apiClient
      .get<{ rooms: JoinedRoom[] }>("/api/customers/me/rooms")
      .then((res) => setRooms(res.data.rooms))
      .catch((err: unknown) => {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 401
        ) {
          deleteCookie("token");
          router.replace("/customer/login");
        }
      })
      .finally(() => setInitialLoading(false));
  }, [router]);

  function handleNavChange(id: string) {
    if (id === "discover") router.push("/customer/home");
    else setActiveNav(id);
  }

  if (initialLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-(--color-bg-page)">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="h-8 w-40 bg-(--color-gray-100) rounded animate-pulse mb-6" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-(--color-text-primary) mb-1">
            My Rooms
          </h1>
          <p className="text-sm text-(--color-text-secondary) mb-6">
            Shops you&apos;ve joined and can chat with any time.
          </p>

          {rooms.length === 0 ? (
            <div className="flex flex-col items-center text-center py-16 bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-(--color-brand-primary-light) flex items-center justify-center mb-4">
                <ExploreOutlinedIcon
                  sx={{ fontSize: 26, color: "var(--color-brand-primary)" }}
                />
              </div>
              <div className="text-[15px] font-semibold text-(--color-text-primary)">
                You haven&apos;t joined any rooms yet.
              </div>
              <div className="text-sm text-(--color-text-secondary) mt-1 mb-5">
                Browse nearby shops and join their room to start chatting.
              </div>
              <button
                onClick={() => router.push("/customer/home")}
                className="h-10 px-5 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-colors"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {rooms.map((room) => (
                <button
                  key={room.roomId}
                  onClick={() => router.push(`/customer/room/${room.roomId}`)}
                  className="flex items-center gap-4 bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl px-5 py-4 text-left cursor-pointer hover:shadow-(--shadow-md) hover:border-(--color-brand-primary) transition-all"
                >
                  <Avatar name={room.shopName} src={room.logoUrl} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-(--color-text-primary) truncate">
                      {room.shopName}
                    </div>
                    <div className="text-[11px] uppercase tracking-widest text-(--color-text-hint) font-semibold mt-0.5">
                      {room.category}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <PeopleOutlinedIcon
                        sx={{ fontSize: 13, color: "var(--color-text-secondary)" }}
                      />
                      <span className="text-xs text-(--color-text-secondary)">
                        {room.membersCount} members
                      </span>
                    </div>
                  </div>
                  <ChevronRightOutlinedIcon
                    sx={{ fontSize: 20, color: "var(--color-text-hint)" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
