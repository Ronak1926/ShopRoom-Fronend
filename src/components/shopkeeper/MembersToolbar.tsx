"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import type { MembersFilter } from "@/features/members/api";

type NotificationsFilter = NonNullable<MembersFilter["notifications"]> | "all";

const OPTIONS: { value: NotificationsFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "on", label: "Notifications on" },
  { value: "off", label: "Notifications off" },
];

interface MembersToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  notifications: NotificationsFilter;
  onNotificationsChange: (value: NotificationsFilter) => void;
  onExport: () => void;
  exporting: boolean;
  canExport: boolean;
}

export type { NotificationsFilter };

export default function MembersToolbar({
  query,
  onQueryChange,
  notifications,
  onNotificationsChange,
  onExport,
  exporting,
  canExport,
}: MembersToolbarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <label className="flex h-9 min-w-48 flex-1 items-center gap-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) px-3 focus-within:border-(--color-brand-primary) sm:max-w-xs">
        <SearchOutlinedIcon sx={{ fontSize: 16 }} className="text-(--color-text-secondary)" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          maxLength={100}
          placeholder="Search by name or email"
          aria-label="Search the member list"
          className="w-full bg-transparent text-[13px] text-(--color-text-primary) outline-none placeholder:text-(--color-text-hint)"
        />
      </label>

      <div role="group" aria-label="Filter by notifications" className="flex overflow-hidden rounded-lg border border-(--color-border-default)">
        {OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onNotificationsChange(value)}
            aria-pressed={notifications === value}
            className={`h-9 px-3 text-[12px] font-semibold transition-colors ${
              notifications === value
                ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "bg-(--color-bg-surface) text-(--color-text-secondary) hover:bg-(--color-bg-page)"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onExport}
        disabled={exporting || !canExport}
        className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) px-3 text-[12px] font-semibold text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-page) disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileDownloadOutlinedIcon sx={{ fontSize: 14 }} />
        {exporting ? "Exporting…" : "Export CSV"}
      </button>
    </div>
  );
}
