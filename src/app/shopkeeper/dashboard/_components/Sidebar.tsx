"use client";

import Image from "next/image";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { NAV_ITEMS } from "../_data/constants";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import SidebarNotifications from "./SidebarNotifications";

const NAV_ICONS: Record<string, React.ElementType> = {
  dashboard: DashboardOutlinedIcon,
  myroom: ChatOutlinedIcon,
  stockalerts: NotificationsOutlinedIcon,
  members: PeopleOutlinedIcon,
  notifications: NotificationsOutlinedIcon,
  analytics: EqualizerOutlinedIcon,
  billing: CreditCardOutlinedIcon,
  profile: PersonOutlinedIcon,
};

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  /** Force the rail into its collapsed state and hide the toggle. Used by the
   *  Notification Studio, which needs the extra width for its own toolbar. */
  forceCollapsed?: boolean;
}

export default function Sidebar({
  activeNav,
  onNavChange,
  forceCollapsed = false,
}: SidebarProps) {
  const { collapsed: storedCollapsed, toggle } = useSidebarCollapse("shopkeeper");
  const collapsed = forceCollapsed || storedCollapsed;

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-(--color-bg-surface) transition-[width] duration-200 shrink-0 ${
        collapsed ? "w-16 min-w-16" : "w-56 min-w-56"
      }`}
      style={{ borderRight: "1px solid var(--color-border-default)" }}
    >
      {/* Brand */}
      <div
        className={`pt-6 pb-5 flex items-center gap-3 ${collapsed ? "px-0 justify-center" : "px-5"}`}
      >
        <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={20} height={18} />
        {!collapsed && (
          <div>
            <div
              className="text-[17px] font-bold leading-none"
              style={{ color: "var(--color-text-primary)" }}
            >
              ShopRoom
            </div>
            <div
              className="text-[10px] tracking-[0.12em] uppercase mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Management
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle — hidden when the rail is force-collapsed by a page */}
      {!forceCollapsed && (
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-3 mb-2 h-8 flex items-center justify-center rounded-lg border border-(--color-border-default) bg-transparent text-(--color-text-secondary) hover:bg-(--color-bg-page) hover:text-(--color-text-primary) transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} />
          ) : (
            <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />
          )}
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label }) => {
          if (id === "notifications") {
            return <SidebarNotifications key={id} collapsed={collapsed} />;
          }
          const Icon = NAV_ICONS[id];
          const active = activeNav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              title={collapsed ? label : undefined}
              className={`relative flex items-center w-full py-2.5 rounded-xl cursor-pointer text-[14px] select-none transition-all duration-150 text-left border-0 ${
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              }`}
              style={
                active
                  ? {
                      background: "var(--color-brand-primary-light)",
                      color: "var(--color-brand-primary)",
                      fontWeight: 600,
                    }
                  : {
                      background: "transparent",
                      color: "var(--color-text-secondary)",
                      fontWeight: 400,
                    }
              }
            >
              {active && (
                <span
                  className="absolute left-0 top-2.5 bottom-2.5 w-0.75 rounded-full"
                  style={{ background: "var(--color-brand-primary)" }}
                />
              )}
              <Icon sx={{ fontSize: 18 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className={`pb-5 pt-2 flex flex-col gap-1 ${collapsed ? "px-2.5" : "px-4"}`}>
        <button
          type="button"
          title={collapsed ? "New Entry" : undefined}
          className={`flex items-center justify-center w-full h-11 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98] ${
            collapsed ? "px-0" : "gap-2 px-4"
          }`}
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand-primary) 0%, color-mix(in srgb, var(--color-brand-primary) 60%, white) 100%)",
            boxShadow:
              "0 4px 14px color-mix(in srgb, var(--color-brand-primary) 40%, transparent)",
          }}
        >
          <AddOutlinedIcon sx={{ fontSize: 16 }} />
          {!collapsed && "New Entry"}
        </button>
        <button
          type="button"
          title={collapsed ? "Help Center" : undefined}
          className={`flex items-center text-[13px] cursor-pointer bg-transparent border-0 w-full rounded-xl h-9 transition-colors ${
            collapsed ? "justify-center px-0" : "gap-2 px-3"
          }`}
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-secondary)")
          }
        >
          <HelpOutlineOutlinedIcon sx={{ fontSize: 16 }} />
          {!collapsed && "Help Center"}
        </button>
      </div>
    </aside>
  );
}
