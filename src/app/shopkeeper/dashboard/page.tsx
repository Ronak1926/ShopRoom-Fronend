"use client";

import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";
import KPICards from "./_components/KPICards";
import RecentActivity from "./_components/RecentActivity";
import QuickActionsPanel from "./_components/QuickActionsPanel";
import MembersTable from "./_components/MembersTable";

export default function ShopkeeperDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />

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
    </div>
  );
}

