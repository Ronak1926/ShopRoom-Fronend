"use client";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export interface RecentJoin {
  id: string;
  customerName: string;
  joinedAt: string;
}

interface RecentActivityProps {
  recentJoins: RecentJoin[];
  loading?: boolean;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const AVATAR_COLORS = [
  "bg-[var(--color-brand-primary-light)]",
  "bg-[var(--color-brand-alert-light)]",
  "bg-[var(--color-avatar-pink-bg)]",
  "bg-[var(--color-avatar-indigo-bg)]",
  "bg-[var(--color-badge-neutral-bg)]",
];

export default function RecentActivity({
  recentJoins,
  loading,
}: RecentActivityProps) {
  return (
    <div className="flex-[0_0_60%] bg-(--color-bg-surface) border border-(--color-border-default) rounded-[14px] p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-bold text-(--color-text-primary)">
          Recent Activity
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-(--color-badge-neutral-bg) text-(--color-badge-neutral-text) border border-(--color-border-default)">
            Alerts & Chat coming soon
          </span>
        </div>
      </div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-(--color-bg-page)">
            <div className="w-9 h-9 rounded-full bg-(--color-bg-page) animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-(--color-bg-page) rounded animate-pulse w-2/3" />
              <div className="h-2.5 bg-(--color-bg-page) rounded animate-pulse w-1/3" />
            </div>
          </div>
        ))}

      {!loading && recentJoins.length === 0 && (
        <div className="py-8 text-center text-sm text-(--color-text-secondary)">
          No activity yet. Members will appear here once they join.
        </div>
      )}

      {!loading &&
        recentJoins.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 py-3 ${idx < recentJoins.length - 1 ? "border-b border-(--color-bg-page)" : ""}`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
            >
              <PersonOutlinedIcon
                sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div>
                <span className="text-[13px] font-bold text-(--color-text-primary)">
                  {item.customerName}
                </span>
                <span className="text-[13px] text-(--color-text-secondary)">
                  {" "}
                  joined the room
                </span>
              </div>
              <div className="text-[11px] text-(--color-text-secondary) mt-0.5">
                {timeAgo(item.joinedAt)}
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-(--color-brand-primary-light) text-(--color-brand-primary)">
              MEMBER
            </span>
          </div>
        ))}
    </div>
  );
}
