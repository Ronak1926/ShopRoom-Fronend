"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { NAV_ITEMS } from "../_data/constants";

const NAV_ICONS: Record<string, React.ElementType> = {
  dashboard: DashboardOutlinedIcon,
  myroom: ChatOutlinedIcon,
  stockalerts: NotificationsOutlinedIcon,
  members: PeopleOutlinedIcon,
  notifications: NotificationsOutlinedIcon,
  analytics: EqualizerOutlinedIcon,
  billing: CreditCardOutlinedIcon,
};

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const router = useRouter();

  return (
    <aside
      className="w-56 min-w-56 flex flex-col h-screen sticky top-0 bg-(--color-bg-surface)"
      style={{ borderRight: "1px solid var(--color-border-default)" }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <Image src="/ShopRoomIcon.svg" alt="ShopRoom" width={20} height={18} />
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
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label }) => {
          const Icon = NAV_ICONS[id];
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
      <div className="px-4 pb-5 pt-2 flex flex-col gap-1">
        <button
          type="button"
          className="flex items-center gap-2 w-full h-11 rounded-xl text-[14px] font-semibold cursor-pointer border-0 text-white px-4 transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #5b47d4 0%, #7c63e8 100%)",
            boxShadow: "0 4px 14px rgba(91,71,212,0.4)",
          }}
        >
          <AddOutlinedIcon sx={{ fontSize: 16 }} />
          New Entry
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-[13px] cursor-pointer bg-transparent border-0 w-full rounded-xl h-9 px-3 transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-secondary)")
          }
        >
          <HelpOutlineOutlinedIcon sx={{ fontSize: 16 }} />
          Help Center
        </button>
        <button
          type="button"
          onClick={() => router.push("/shopkeeper/logout")}
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
