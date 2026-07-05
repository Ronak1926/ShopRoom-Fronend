"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

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
  const router = useRouter();

  return (
    <aside
      className="w-56 min-w-56 flex flex-col overflow-hidden bg-(--color-bg-surface)"
      style={{ borderRight: "1px solid var(--color-border-default)" }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        {/* SVG fill is dark purple — invert to white so it shows on the colored bg */}
        <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={20} height={18} />
        <span
          className="text-[17px] font-bold leading-none"
          style={{ color: "var(--color-text-primary)" }}
        >
          ShopRoom
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl cursor-pointer text-[14px] select-none transition-all duration-150 text-left border-0"
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
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-4 pt-2 pb-5 flex flex-col gap-1">
        <button
          type="button"
          className="group relative overflow-hidden flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-primary-active))",
            boxShadow:
              "0 4px 16px color-mix(in srgb, var(--color-brand-primary) 28%, transparent)",
          }}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <AddOutlinedIcon sx={{ fontSize: 18 }} />
          <span className="relative z-10">Create Room</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/customer/logout")}
          className="flex items-center gap-2 text-[13px] cursor-pointer bg-transparent border-0 w-full rounded-xl h-9 px-3 transition-colors font-medium"
          style={{ color: "var(--color-danger, #e53935)" }}
        >
          <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
