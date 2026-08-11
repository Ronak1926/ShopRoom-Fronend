"use client";

import dynamic from "next/dynamic";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import Avatar from "@/components/ui/Avatar";
import { formatCount, type TrendingItem } from "../types";

// Lazy-load MiniMap so Leaflet (browser-only) doesn't break SSR
const MiniMap = dynamic(() => import("@/components/map/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="h-52 bg-(--color-bg-surface-hover) animate-pulse" />
  ),
});

type DiscoverSidebarProps = {
  customerLat: number | null;
  customerLng: number | null;
  trending: TrendingItem[];
};

export default function DiscoverSidebar({
  customerLat,
  customerLng,
  trending,
}: DiscoverSidebarProps) {
  return (
    <aside className="w-72 min-w-72 bg-(--color-bg-page) border-l border-(--color-border-default) flex flex-col gap-4 overflow-y-auto p-4">
      {/* Map card */}
      <div className="rounded-2xl overflow-hidden border border-(--color-border-default) bg-(--color-bg-surface) shadow-(--shadow-xs) shrink-0">
        <MiniMap customerLat={customerLat} customerLng={customerLng} />
      </div>

      {/* Most Popular card */}
      <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-(--shadow-xs) flex flex-col overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
          <span className="text-[13px] font-bold text-(--color-text-primary) tracking-tight">
            Most Popular This Week
          </span>
          <StarOutlinedIcon sx={{ fontSize: 16, color: "var(--color-brand-alert-hover)" }} />
        </div>

        {/* Trending list */}
        <div className="px-3 pb-4">
          <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
            {trending.map((item, index) => (
              <li
                key={item.roomId}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl cursor-pointer hover:bg-(--color-bg-page) transition-colors group"
              >
                <span className="w-5 text-[12px] font-bold text-(--color-text-hint) shrink-0 text-center">
                  {index + 1}
                </span>
                <Avatar
                  name={item.shopName}
                  src={item.logoUrl}
                  size="md"
                  shape="square"
                  className="shadow-(--shadow-xs)"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-(--color-text-primary) truncate leading-tight">
                    {item.shopName}
                  </div>
                  <div className="text-[11px] text-(--color-text-hint) mt-0.5">
                    {formatCount(item.membersCount)} members
                  </div>
                </div>
                <ChevronRightOutlinedIcon
                  sx={{ fontSize: 14, color: "var(--color-text-hint)", flexShrink: 0 }}
                />
              </li>
            ))}
          </ul>

          <div className="mt-3 px-1">
            <button className="w-full h-9 border border-(--color-border-default) rounded-xl text-[13px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer bg-transparent">
              View All Trending
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
