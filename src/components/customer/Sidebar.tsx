"use client";

import Image from "next/image";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

// ── Nav items ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "discover", label: "Discover", Icon: ExploreOutlinedIcon },
  { id: "orders", label: "Orders", Icon: ShoppingBagOutlinedIcon },
  { id: "myrooms", label: "My Rooms", Icon: FavoriteBorderOutlinedIcon },
  { id: "settings", label: "Settings", Icon: SettingsOutlinedIcon },
];

// ── Props ──────────────────────────────────────────────────────────────────

type Props = {
  activeNav: string;
  onNavChange: (id: string) => void;
};

// ── Component ──────────────────────────────────────────────────────────────

export default function Sidebar({ activeNav, onNavChange }: Props) {
  const { collapsed, toggle } = useSidebarCollapse("customer");

  return (
    <aside
      className={`flex flex-col overflow-hidden bg-(--color-bg-surface) transition-[width,min-width] duration-200 ease-in-out shrink-0 ${
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
          <span
            className="text-[17px] font-bold leading-none"
            style={{ color: "var(--color-text-primary)" }}
          >
            ShopRoom
          </span>
        )}
      </div>

      {/* Collapse toggle */}
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

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
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
              {/* Active left indicator */}
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
    </aside>
  );
}
