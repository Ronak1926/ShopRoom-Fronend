"use client";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import StarIcon from "@mui/icons-material/Star";

export default function QuickActionsPanel() {
  return (
    <div className="flex-[0_0_40%] flex flex-col gap-3">
      <div className="text-base font-bold text-(--color-text-primary)">Quick Actions</div>

      {/* Send Stock Alert */}
      <div className="bg-(--color-brand-alert) rounded-xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:shadow-(--shadow-brand-card) transition-shadow">
        <div className="flex-1">
          <div className="text-sm font-bold text-white mb-0.5">Send Stock Alert</div>
          <div className="text-xs text-white/80">Notify everyone about new arrivals</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <NotificationsOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
        </div>
      </div>

      {/* Broadcast Message */}
      <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:shadow-(--shadow-brand-card) transition-shadow">
        <div className="flex-1">
          <div className="text-sm font-bold text-(--color-brand-primary) mb-0.5">Broadcast Message</div>
          <div className="text-xs text-(--color-text-secondary)">Send a personal note to all members</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0 text-(--color-brand-primary)">
          <CampaignOutlinedIcon sx={{ fontSize: 18 }} />
        </div>
      </div>

      {/* Copy Invite Link */}
      <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:shadow-(--shadow-brand-card) transition-shadow">
        <div className="flex-1">
          <div className="text-sm font-bold text-(--color-text-primary) mb-0.5">Copy Invite Link</div>
          <div className="text-xs text-(--color-text-secondary)">Grow your digital store community</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-(--color-badge-neutral-bg) flex items-center justify-center shrink-0 text-(--color-text-secondary)">
          <LinkOutlinedIcon sx={{ fontSize: 18 }} />
        </div>
      </div>

      {/* Room Health Score */}
      <div className="bg-brand-gradient rounded-[14px] p-6 relative overflow-hidden">
        <div className="text-[13px] text-white mb-2">Room Health Score</div>
        <div className="text-[40px] font-bold text-white leading-none">98%</div>
        <div className="text-xs text-white/70 mt-1.5 flex items-center gap-1">↑ Top 2% of rooms</div>
        <div className="absolute -right-2.5 -bottom-2.5 opacity-10">
          <StarIcon sx={{ fontSize: 80, color: "#fff" }} />
        </div>
      </div>
    </div>
  );
}
