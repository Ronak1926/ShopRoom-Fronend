"use client";

import Image from "next/image";
import Link from "next/link";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MobileNavBar from "@/components/nav/MobileNavBar";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import ShopkeeperNavList from "./ShopkeeperNavList";

const NEW_NOTIFICATION_HREF = "/shopkeeper/notifications/studio";

function BottomLinks({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <Link
        href={NEW_NOTIFICATION_HREF}
        title={collapsed ? "New Notification" : undefined}
        className={`flex h-11 w-full items-center justify-center rounded-xl bg-(--color-brand-primary) text-[14px] font-semibold text-white shadow-md transition hover:bg-(--color-brand-primary-hover) active:scale-[0.98] ${
          collapsed ? "px-0" : "gap-2 px-4"
        }`}
      >
        <AddOutlinedIcon sx={{ fontSize: 16 }} />
        {!collapsed && "New Notification"}
      </Link>
      <Link
        href="/help"
        title={collapsed ? "Help Center" : undefined}
        className={`flex h-9 w-full items-center rounded-xl text-[13px] text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) ${
          collapsed ? "justify-center px-0" : "gap-2 px-3"
        }`}
      >
        <HelpOutlineOutlinedIcon sx={{ fontSize: 16 }} />
        {!collapsed && "Help Center"}
      </Link>
    </>
  );
}

/**
 * The shopkeeper's navigation: a collapsible rail from the `lg` breakpoint up,
 * and a top bar with a menu drawer below it. Every page renders it as the first
 * child of a `flex h-dvh flex-col lg:flex-row` container.
 */
export default function Sidebar() {
  const { collapsed, toggle } = useSidebarCollapse("shopkeeper");

  return (
    <>
      <MobileNavBar>
        <ShopkeeperNavList />
        <div className="flex flex-col gap-1 px-4 pt-2">
          <BottomLinks collapsed={false} />
        </div>
      </MobileNavBar>

      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-(--color-border-default) bg-(--color-bg-surface) transition-[width,min-width] duration-200 ease-in-out lg:flex ${
          collapsed ? "w-16 min-w-16" : "w-56 min-w-56"
        }`}
      >
        <div className={`flex items-center gap-3 pt-6 pb-5 ${collapsed ? "justify-center px-0" : "px-5"}`}>
          <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={20} height={18} />
          {!collapsed && (
            <div>
              <div className="text-[17px] leading-none font-bold text-(--color-text-primary)">ShopRoom</div>
              <div className="mt-1 text-[10px] tracking-[0.12em] text-(--color-text-secondary) uppercase">Management</div>
            </div>
          )}
        </div>

        <ShopkeeperNavList collapsed={collapsed} />

        <div className={`flex flex-col gap-1 pt-2 pb-5 ${collapsed ? "px-2.5" : "px-4"}`}>
          <BottomLinks collapsed={collapsed} />
          <button
            type="button"
            onClick={toggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-1 flex h-8 w-full items-center justify-center rounded-lg border border-(--color-border-default) bg-transparent text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-page) hover:text-(--color-text-primary)"
          >
            {collapsed ? <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} /> : <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />}
          </button>
        </div>
      </aside>
    </>
  );
}
