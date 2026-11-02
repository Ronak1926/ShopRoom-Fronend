"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MobileNavBar from "@/components/nav/MobileNavBar";
import NavItem, { navItemClass } from "@/components/nav/NavItem";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import NotificationBell from "./NotificationBell";

const NAV_ITEMS = [
  { id: "discover", label: "Discover", href: "/customer/home", Icon: ExploreOutlinedIcon },
  { id: "map", label: "Map", href: "/customer/map", Icon: MapOutlinedIcon },
  { id: "myrooms", label: "My Rooms", href: "/customer/myrooms", Icon: FavoriteBorderOutlinedIcon },
  { id: "profile", label: "Profile", href: "/customer/profile", Icon: PersonOutlinedIcon },
  { id: "settings", label: "Settings", href: "/customer/settings", Icon: SettingsOutlinedIcon },
] as const;

function NavList({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname() ?? "";
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-1">
      {NAV_ITEMS.map(({ id, label, href, Icon }) => {
        // A room opened from "My Rooms" or Discover keeps "My Rooms" highlighted.
        const active = pathname === href || pathname.startsWith(`${href}/`) || (id === "myrooms" && pathname.startsWith("/customer/room/"));
        return <NavItem key={id} href={href} label={label} Icon={Icon} active={active} collapsed={collapsed} />;
      })}
      <Link href="/customer/logout" title={collapsed ? "Sign out" : undefined} className={`${navItemClass(false, collapsed)} mt-auto mb-3`}>
        <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
        {!collapsed && <span>Sign out</span>}
      </Link>
    </nav>
  );
}

/**
 * The customer's navigation: a collapsible rail from the `lg` breakpoint up, and a
 * top bar with a menu drawer (and the notification bell) below it. Every page renders
 * it as the first child of a `flex h-dvh flex-col lg:flex-row` container.
 */
export default function Sidebar() {
  const { collapsed, toggle } = useSidebarCollapse("customer");

  return (
    <>
      <MobileNavBar actions={<NotificationBell />}>
        <NavList collapsed={false} />
      </MobileNavBar>

      <aside
        className={`hidden shrink-0 flex-col overflow-hidden border-r border-(--color-border-default) bg-(--color-bg-surface) transition-[width,min-width] duration-200 ease-in-out lg:flex ${
          collapsed ? "w-16 min-w-16" : "w-56 min-w-56"
        }`}
      >
        <div className={`flex items-center gap-3 pt-6 pb-5 ${collapsed ? "justify-center px-0" : "px-5"}`}>
          <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={20} height={18} />
          {!collapsed && <span className="text-[17px] leading-none font-bold text-(--color-text-primary)">ShopRoom</span>}
        </div>

        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-3 mb-2 flex h-8 items-center justify-center rounded-lg border border-(--color-border-default) bg-transparent text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-page) hover:text-(--color-text-primary)"
        >
          {collapsed ? <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} /> : <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />}
        </button>

        <NavList collapsed={collapsed} />
      </aside>
    </>
  );
}
