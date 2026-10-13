"use client";

import type { ElementType } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import SampleBadge from "@/components/ui/SampleBadge";
import Dropdown from "@/components/ui/Dropdown";
import { rate, type HistoryTotals } from "../_data/sampleHistory";

const RANGE_OPTIONS = [
  { value: 7, label: "This week" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
];

function Tile({
  icon: Icon,
  value,
  label,
  hint,
}: {
  icon: ElementType;
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <article className="rounded-xl border border-(--color-border-default) p-3">
      <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
        <Icon sx={{ fontSize: 16 }} />
      </span>
      <p className="mt-2 text-[19px] font-bold leading-none text-(--color-text-primary) tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-(--color-text-secondary)">{label}</p>
      <p className="text-[10.5px] text-(--color-text-hint)">{hint}</p>
    </article>
  );
}

interface Props {
  totals: HistoryTotals;
  rangeDays: number;
  onRangeChange: (days: number) => void;
}

export default function OverallPerformanceCard({ totals, rangeDays, onRangeChange }: Props) {
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">
            Overall performance
          </h2>
          <SampleBadge />
        </div>
        <Dropdown
          value={rangeDays}
          options={RANGE_OPTIONS}
          onChange={onRangeChange}
          ariaLabel="Performance window"
          className="w-36"
        />
      </header>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Tile
          icon={SendOutlinedIcon}
          value={totals.sent.toLocaleString()}
          label="Sent"
          hint={`${totals.failed} failed`}
        />
        <Tile
          icon={MarkEmailReadOutlinedIcon}
          value={totals.delivered.toLocaleString()}
          label="Delivered"
          hint={`${rate(totals.delivered, totals.delivered + totals.failed || 1)}% of sends`}
        />
        <Tile
          icon={VisibilityOutlinedIcon}
          value={totals.opened.toLocaleString()}
          label="Opened"
          hint={`${rate(totals.opened, totals.delivered)}% open rate`}
        />
        <Tile
          icon={AdsClickOutlinedIcon}
          value={totals.clicked.toLocaleString()}
          label="Clicked"
          hint={`${rate(totals.clicked, totals.delivered)}% click rate`}
        />
      </div>
    </section>
  );
}
