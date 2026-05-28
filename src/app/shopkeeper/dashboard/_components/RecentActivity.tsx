"use client";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { ACTIVITY_ITEMS } from "../_data/constants";

const AVATAR_ICON_MAP: Record<string, SvgIconComponent> = {
  person:   PersonOutlinedIcon,
  campaign: CampaignOutlinedIcon,
};

export default function RecentActivity() {
  return (
    <div className="flex-[0_0_60%] bg-(--color-bg-surface) border border-(--color-border-default) rounded-[14px] p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-bold text-(--color-text-primary)">Recent Activity</span>
        <button className="text-[13px] font-semibold text-(--color-brand-primary) bg-transparent border-0 cursor-pointer font-[inherit] hover:text-(--color-brand-primary-hover) transition-colors">
          View All
        </button>
      </div>

      {ACTIVITY_ITEMS.map((item, idx) => {
        const AvatarIcon = AVATAR_ICON_MAP[item.avatarIconKey];
        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 py-3 ${idx < ACTIVITY_ITEMS.length - 1 ? "border-b border-(--color-bg-page)" : ""}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.avatarBgClass}`}>
              <AvatarIcon sx={{ fontSize: 18, color: item.avatarIconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div>
                <span className="text-[13px] font-bold text-(--color-text-primary)">{item.name}</span>
                <span className="text-[13px] text-(--color-text-secondary)">{item.action}</span>
              </div>
              <div className="text-[11px] text-(--color-text-secondary) mt-0.5">{item.time}</div>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${item.badge.className}`}>
              {item.badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
