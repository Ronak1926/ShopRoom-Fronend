"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ShareModal from "@/components/ui/ShareModal";
import { useRoomShare } from "@/hooks/useRoomShare";
import { getCookie } from "@/utils/cookieUtils";
import PlanBanner from "./PlanBanner";
import Sidebar from "./Sidebar";
import TopBar, { type TopBarProps } from "./TopBar";

interface ShopkeeperShellProps {
  children: ReactNode;
  /** Pages that already hold the invite link (the dashboard) can pass their own share handling. */
  topBar?: TopBarProps;
}

/** Page frame for every signed-in shopkeeper screen: navigation, header, plan banner and a scrolling body. */
export default function ShopkeeperShell({ children, topBar }: ShopkeeperShellProps) {
  const router = useRouter();
  const share = useRoomShare();

  useEffect(() => {
    if (!getCookie("shopkeeper_token")) router.replace("/customer/login?tab=shopkeeper");
  }, [router]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) text-(--color-text-primary) lg:flex-row">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar inviteLink={topBar?.inviteLink ?? share.inviteLink ?? undefined} onShareClick={topBar?.onShareClick ?? share.openShare} />
        <PlanBanner />
        <main className="flex-1 overflow-y-auto p-4 sm:p-7">{children}</main>
      </div>
      {share.open && share.inviteLink && <ShareModal inviteLink={share.inviteLink} onClose={share.closeShare} />}
    </div>
  );
}
