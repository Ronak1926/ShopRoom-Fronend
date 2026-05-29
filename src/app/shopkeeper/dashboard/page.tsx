"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";
import KPICards from "./_components/KPICards";
import RecentActivity from "./_components/RecentActivity";
import QuickActionsPanel from "./_components/QuickActionsPanel";
import MembersTable from "./_components/MembersTable";
import ShareModal from "./_components/ShareModal";
import { apiClient } from "../../../utils/apiClient";

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("dashboard");
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
        const data = res.data as { room?: { inviteLink?: string } };
        if (data.room?.inviteLink) setInviteLink(data.room.inviteLink);
      })
      .catch(() => {
        // Fallback: build the link from the invite code stored during signup
        const code = localStorage.getItem("shopkeeper_invite_code");
        if (code) setInviteLink(`${window.location.origin}/join/${code}`);
      });
  }, [router]);

  return (
    <div className="flex min-h-screen bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          inviteLink={inviteLink}
          onShareClick={() => setShowShare(true)}
        />

        <main className="flex-1 p-7">
          <h1 className="text-[28px] font-bold text-(--color-text-primary) mb-2">
            Good morning, Riya Fashion Store
          </h1>
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-(--color-online)" />
            <span className="text-[13px] text-(--color-text-secondary)">
              Your store room is active and syncing in real-time.
            </span>
          </div>

          <KPICards />

          <div className="flex gap-5 mt-6">
            <RecentActivity />
            <QuickActionsPanel />
          </div>

          <MembersTable />
        </main>
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
