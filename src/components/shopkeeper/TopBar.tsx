"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export interface TopBarProps {
  inviteLink?: string;
  onShareClick?: () => void;
}

const ICON_BUTTON =
  "flex h-8 w-8 items-center justify-center rounded-lg text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)";

/** Desktop header. On phones the mobile bar in the sidebar takes its place. */
export default function TopBar({ inviteLink, onShareClick }: TopBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function search(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shopkeeper/members?q=${encodeURIComponent(q)}` : "/shopkeeper/members");
  }

  return (
    <header className="sticky top-0 z-10 hidden h-16 items-center gap-4 border-b border-(--color-border-default) bg-(--color-bg-surface) px-6 lg:flex">
      <form
        onSubmit={search}
        role="search"
        className="flex h-10 w-70 shrink-0 items-center gap-2 rounded-xl border border-(--color-border-default) bg-(--color-bg-page) px-3.5 transition-colors focus-within:border-(--color-brand-primary)"
      >
        <SearchOutlinedIcon sx={{ fontSize: 16 }} className="text-(--color-text-secondary)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search members"
          maxLength={100}
          className="w-full border-0 bg-transparent text-[13px] text-(--color-text-primary) outline-none placeholder:text-(--color-text-hint)"
          placeholder="Search members…"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onShareClick}
          disabled={!inviteLink}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-(--color-brand-primary) px-4 text-[13px] font-bold whitespace-nowrap text-white transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShareOutlinedIcon sx={{ fontSize: 15 }} /> Share Room Link
        </button>
        <div className="h-7 w-px bg-(--color-border-default)" />
        <Link href="/shopkeeper/notifications/history" aria-label="Notification history" title="Notification history" className={ICON_BUTTON}>
          <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
        </Link>
        <Link href="/shopkeeper/settings" aria-label="Settings" title="Settings" className={ICON_BUTTON}>
          <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
        </Link>
        <Link
          href="/shopkeeper/profile"
          aria-label="Profile"
          title="Profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-brand-primary-light) text-(--color-brand-primary) transition-opacity hover:opacity-80"
        >
          <PersonOutlinedIcon sx={{ fontSize: 18 }} />
        </Link>
      </div>
    </header>
  );
}
