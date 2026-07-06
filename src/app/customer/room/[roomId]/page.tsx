"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/customer/Sidebar";
import CustomerRoom from "./_components/CustomerRoom";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import type { RoomDetails } from "@/components/chat/types";

export default function CustomerRoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("myrooms");

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.replace("/customer/login");
      return;
    }
    setAuthToken(token);

    apiClient
      .get<RoomDetails>(`/api/rooms/${params.roomId}`)
      .then((res) => setRoom(res.data))
      .catch(() => router.replace("/customer/myrooms"))
      .finally(() => setLoading(false));
  }, [params.roomId, router]);

  function handleNavChange(id: string) {
    if (id === "discover") router.push("/customer/home");
    else if (id === "myrooms") router.push("/customer/myrooms");
    else setActiveNav(id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-hint)">
          Loading room...
        </div>
      ) : room ? (
        <CustomerRoom room={room} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-hint)">
          Room not found.
        </div>
      )}
    </div>
  );
}
