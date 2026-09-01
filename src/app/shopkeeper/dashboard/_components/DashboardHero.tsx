"use client";

import { useRouter } from "next/navigation";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import type { DashboardSnapshot } from "../_hooks/useDashboardData";
import { RANGE_OPTIONS } from "../_data/ranges";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface Props {
  data: DashboardSnapshot;
  rangeDays: number;
  onRangeChange: (days: number) => void;
  rangeSpan: string;
  onShare: () => void;
}

/** Who the shop is, and the window everything below is measured over. */
export default function DashboardHero({
  data,
  rangeDays,
  onRangeChange,
  rangeSpan,
  onShare,
}: Props) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <Avatar
            name={data.shopName}
            src={data.logoUrl}
            size="lg"
            shape="square"
            className="shrink-0"
          />

          <div className="min-w-0">
            <p className="text-[12px] text-(--color-text-hint)">{greeting()},</p>
            <h1 className="text-[24px] font-bold leading-tight text-(--color-text-primary) truncate">
              {data.shopName}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-(--color-success-light) text-[11px] font-semibold text-(--color-success-text)">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-online)" />
                Room live
              </span>
              <span className="h-6 px-2.5 rounded-full bg-(--color-bg-surface-hover) text-[11px] font-medium text-(--color-text-secondary) flex items-center">
                {data.category}
              </span>
              <span className="flex items-center gap-1 h-6 px-2.5 rounded-full bg-(--color-bg-surface-hover) text-[11px] font-medium text-(--color-text-secondary)">
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 13 }} />
                {data.planType} plan
              </span>
              {data.place && (
                <span className="flex items-center gap-1 h-6 px-2.5 rounded-full bg-(--color-bg-surface-hover) text-[11px] font-medium text-(--color-text-secondary) max-w-64">
                  <PlaceOutlinedIcon sx={{ fontSize: 13 }} />
                  <span className="truncate">{data.place}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <Dropdown
              value={rangeDays}
              options={RANGE_OPTIONS}
              onChange={onRangeChange}
              ariaLabel="Reporting window"
              className="w-36"
            />
            <button
              type="button"
              onClick={onShare}
              disabled={!data.inviteLink}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShareOutlinedIcon sx={{ fontSize: 16 }} />
              Share room
            </button>
            <button
              type="button"
              onClick={() => router.push("/shopkeeper/notifications/send")}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
            >
              <SendOutlinedIcon sx={{ fontSize: 16 }} />
              Send notification
            </button>
          </div>
          <p className="text-[11px] text-(--color-text-hint)">{rangeSpan}</p>
        </div>
      </div>
    </section>
  );
}
