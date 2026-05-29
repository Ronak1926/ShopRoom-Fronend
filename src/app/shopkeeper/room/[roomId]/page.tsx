"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../dashboard/_components/Sidebar";
import TopBar from "../../dashboard/_components/TopBar";
import ShareModal from "../../dashboard/_components/ShareModal";
import MyRoom from "./_components/MyRoom";
import { apiClient } from "../../../../utils/apiClient";

interface ShopData {
  shopName: string;
  logoUrl: string | null;
  room?: {
    roomId: string;
    inviteLink?: string;
    membersCount: number;
  };
}

export default function RoomPage() {
  const router = useRouter();
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [inviteLink, setInviteLink] = useState<string | undefined>(undefined);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("shopkeeper_token");
    if (!token) {
      router.replace("/shopkeeper/login");
      return;
    }

    apiClient
      .get("/api/shop/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data as ShopData;
        setShopData(data);
        if (data.room?.inviteLink) setInviteLink(data.room.inviteLink);
      })
      .catch(() => {
        const code = localStorage.getItem("shopkeeper_invite_code");
        if (code) setInviteLink(`${window.location.origin}/join/${code}`);
      });
  }, [router]);

  return (
    <div className="flex h-screen bg-(--color-bg-page) text-(--color-text-primary) overflow-hidden">
      <Sidebar
        activeNav="myroom"
        onNavChange={(id) => {
          if (id !== "myroom") router.push("/shopkeeper/dashboard");
        }}
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar inviteLink={inviteLink} onShareClick={() => setShowShare(true)} />

        <MyRoom
          shopName={shopData?.shopName ?? ""}
          logoUrl={shopData?.logoUrl ?? null}
          membersCount={shopData?.room?.membersCount ?? 0}
          inviteLink={inviteLink}
          onShareClick={() => setShowShare(true)}
        />
      </div>

      {showShare && inviteLink && (
        <ShareModal
          inviteLink={inviteLink}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
