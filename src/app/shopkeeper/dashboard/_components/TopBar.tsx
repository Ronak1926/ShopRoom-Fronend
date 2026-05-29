"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

interface TopBarProps {
  inviteLink?: string;
  onShareClick?: () => void;
}

export default function TopBar({ inviteLink, onShareClick }: TopBarProps) {
  return (
    <header className="h-16 bg-(--color-bg-surface) border-b border-(--color-border-default) flex items-center px-6 gap-4 sticky top-0 z-10">
      {/* Search */}
      <div className="flex items-center gap-2 bg-(--color-bg-page) rounded-full h-9.5 px-3.5 w-70 shrink-0">
        <SearchOutlinedIcon
          sx={{ fontSize: 16, color: "var(--color-text-secondary)" }}
        />
        <input
          className="border-0 bg-transparent outline-none text-[13px] text-(--color-text-primary) w-full font-[inherit] placeholder:text-(--color-text-hint)"
          placeholder="Search orders, members..."
        />
      </div>

      {/* Right zone */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={onShareClick}
          disabled={!inviteLink}
          className="flex items-center gap-1.5 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-white border-0 rounded-lg h-9 px-4 text-[13px] font-bold cursor-pointer whitespace-nowrap font-[inherit] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShareOutlinedIcon sx={{ fontSize: 15 }} /> Share Room Link
        </button>
        <div className="w-px h-7 bg-(--color-border-default)" />
        <button className="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-lg cursor-pointer text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
          <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-transparent border-0 rounded-lg cursor-pointer text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
          <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
        </button>
        <div className="w-8 h-8 rounded-full bg-(--color-brand-primary-light) flex items-center justify-center text-(--color-brand-primary)">
          <PersonOutlinedIcon sx={{ fontSize: 18 }} />
        </div>
      </div>
    </header>
  );
}
