"use client";

import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

interface Props {
  planType: string;
  dailyLimit: number;
  /** Sends already made today. Zero until sends are recorded server-side. */
  usedToday: number;
}

const PLAN_LABEL: Record<string, string> = {
  "1m": "Starter",
  "2m": "Growth",
  "3m": "Pro",
};

/** The plan's daily ceiling — a real limit the backend enforces per plan. */
export default function DailyLimitStrip({ planType, dailyLimit, usedToday }: Props) {
  const pct = dailyLimit ? Math.min(100, Math.round((usedToday / dailyLimit) * 100)) : 0;
  // Widths come from a fixed ladder so the bar stays in Tailwind.
  const WIDTHS = ["w-0", "w-1/4", "w-2/4", "w-3/4", "w-full"];
  const width = WIDTHS[Math.min(WIDTHS.length - 1, Math.round((pct / 100) * (WIDTHS.length - 1)))];

  return (
    <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) px-4 py-3.5">
      <span className="w-10 h-10 shrink-0 rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary) flex items-center justify-center">
        <EventAvailableOutlinedIcon sx={{ fontSize: 19 }} />
      </span>

      <div className="min-w-48 flex-1">
        <h2 className="text-[13px] font-bold text-(--color-text-primary)">
          Daily limit ({PLAN_LABEL[planType] ?? planType} plan)
        </h2>
        <p className="text-[11.5px] text-(--color-text-hint) mt-0.5">
          You can send up to {dailyLimit} notification{dailyLimit === 1 ? "" : "s"} per day.
        </p>
      </div>

      <div className="min-w-56 flex-1">
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="text-(--color-text-secondary)">
            Used {usedToday} / {dailyLimit} today
          </span>
          <span className="font-semibold text-(--color-text-primary) tabular-nums">{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-(--color-bg-surface-hover) overflow-hidden">
          <span className={`block h-full rounded-full bg-(--color-brand-primary) ${width}`} />
        </div>
      </div>
    </section>
  );
}
