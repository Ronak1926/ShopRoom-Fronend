"use client";

import { useRouter, usePathname } from "next/navigation";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NavItem, { ActiveBar, navItemClass } from "@/components/nav/NavItem";
import { useShopkeeperRoomId } from "@/hooks/useShopkeeperRoomId";
import { NAV_ITEMS } from "./navConstants";
import SidebarNotifications from "./SidebarNotifications";

const NAV_ICONS = {
  dashboard: DashboardOutlinedIcon,
  myroom: ChatOutlinedIcon,
  members: PeopleOutlinedIcon,
  billing: CreditCardOutlinedIcon,
  profile: PersonOutlinedIcon,
  settings: SettingsOutlinedIcon,
} as const;

/** The shopkeeper's main navigation. Shared by the desktop sidebar and the mobile drawer. */
export default function ShopkeeperNavList({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const roomId = useShopkeeperRoomId();

  async function openMyRoom() {
    const id = await roomId();
    if (id) router.push(`/shopkeeper/room/${id}`);
  }

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pt-2">
      {NAV_ITEMS.map(({ id, label, href }) => {
        if (id === "notifications") return <SidebarNotifications key={id} collapsed={collapsed} />;
        const Icon = NAV_ICONS[id];
        const active = pathname === href || pathname.startsWith(`${href}/`);
        if (id === "myroom") {
          return (
            <button
              key={id}
              type="button"
              onClick={() => void openMyRoom()}
              title={collapsed ? label : undefined}
              className={navItemClass(active, collapsed)}
            >
              {active && <ActiveBar />}
              <Icon sx={{ fontSize: 18 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        }
        return <NavItem key={id} href={href} label={label} Icon={Icon} active={active} collapsed={collapsed} />;
      })}
    </nav>
  );
}
