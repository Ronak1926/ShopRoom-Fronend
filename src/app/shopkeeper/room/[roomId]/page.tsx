"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../dashboard/_components/Sidebar";
import MyRoom from "./_components/MyRoom";
import { apiClient, setAuthToken } from "../../../../utils/apiClient";
import { getCookie } from "../../../../utils/cookieUtils";
import type { RoomDetails } from "@/components/chat/types";

export default function RoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("shopkeeper_token");
    if (!token) {
      router.replace("/customer/login?tab=shopkeeper");
      return;
    }
    setAuthToken(token);

    apiClient
      .get<RoomDetails>(`/api/rooms/${params.roomId}`)
      .then((res) => setRoom(res.data))
      .catch(() => router.replace("/shopkeeper/dashboard"))
      .finally(() => setLoading(false));
  }, [params.roomId, router]);

  return (
    <div className="flex h-screen bg-(--color-bg-page) text-(--color-text-primary) overflow-hidden">
      <Sidebar
        activeNav="myroom"
        onNavChange={(id) => {
          if (id !== "myroom") router.push("/shopkeeper/dashboard");
        }}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-hint)">
          Loading room...
        </div>
      ) : room ? (
        <MyRoom room={room} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-hint)">
          Room not found.
        </div>
      )}
    </div>
  );
}
