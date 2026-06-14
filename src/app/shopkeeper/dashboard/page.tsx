"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";
import KPICards from "./_components/KPICards";
import RecentActivity, { type RecentJoin } from "./_components/RecentActivity";
import QuickActionsPanel from "./_components/QuickActionsPanel";
import MembersTable from "./_components/MembersTable";
import ShareModal from "./_components/ShareModal";
import { apiClient } from "../../../utils/apiClient";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardData {
  shop: {
    shopName: string;
    category: string;
    logoUrl: string | null;
    createdAt: string;
  };
  room: {
    roomId: string;
    inviteCode: string;
    inviteLink: string;
    membersCount: number;
    createdAt: string;
  } | null;
  recentJoins: RecentJoin[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("shopkeeper_token");
    if (!token) {
      router.replace("/login?tab=shopkeeper");
      return;
    }

    apiClient
      .get<DashboardData>("/api/shop/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("shopkeeper_token");
          router.replace("/login?tab=shopkeeper");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleNavChange(id: string) {
    if (id === "myroom") {
      router.push(`/shopkeeper/room/${data?.room?.roomId ?? "_"}`);
    } else {
      setActiveNav(id);
    }
  }

  const shopName = data?.shop.shopName ?? "Your Store";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex h-screen bg-(--color-bg-page) text-(--color-text-primary) overflow-hidden">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar
          inviteLink={data?.room?.inviteLink}
          onShareClick={() => setShowShare(true)}
        />

        <main className="flex-1 p-7 overflow-y-auto">
          {/* Heading */}
          <h1 className="text-[28px] font-bold text-(--color-text-primary) mb-2">
            {greeting}, {loading ? "..." : shopName}
          </h1>
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-(--color-online)" />
            <span className="text-[13px] text-(--color-text-secondary)">
              Your store room is active and syncing in real-time.
            </span>
          </div>

          {/* KPI row */}
          <KPICards
            membersCount={data?.room?.membersCount ?? 0}
            loading={loading}
          />

          {/* Activity + Quick Actions */}
          <div className="flex gap-5 mt-6">
            <RecentActivity
              recentJoins={data?.recentJoins ?? []}
              loading={loading}
            />
            <QuickActionsPanel />
          </div>

          {/* Members table */}
          <MembersTable dashboardLoading={loading} />
        </main>
      </div>

      {showShare && data?.room?.inviteLink && (
        <ShareModal
          inviteLink={data.room.inviteLink}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
