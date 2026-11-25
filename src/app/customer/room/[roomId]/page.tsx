"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/customer/Sidebar";
import CustomerRoom from "./_components/CustomerRoom";
import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import type { RoomDetails } from "@/components/chat/types";

export default function CustomerRoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.replace("/customer/login");
      return;
    }

    apiClient
      .get<RoomDetails>(`/api/rooms/${params.roomId}`)
      .then((res) => setRoom(res.data))
      .catch(() => router.replace("/customer/myrooms"))
      .finally(() => setLoading(false));
  }, [params.roomId, router]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) text-(--color-text-primary) lg:flex-row">
      <Sidebar />
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
