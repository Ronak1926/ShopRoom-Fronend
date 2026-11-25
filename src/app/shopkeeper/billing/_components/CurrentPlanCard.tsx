import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import type { Billing } from "@/features/billing/api";
import { formatDate } from "@/features/billing/format";
import { PLAN_FEATURES, PLAN_OFFERS, type PlanId } from "@/features/billing/plans";

const HIGHLIGHTS = [
  { row: "Notifications a day", icon: NotificationsActiveOutlinedIcon, suffix: " notifications a day" },
  { row: "Who you can reach", icon: MyLocationOutlinedIcon, suffix: "" },
  { row: "Ready-made templates", icon: GridViewOutlinedIcon, suffix: " templates" },
  { row: "Editing", icon: BrushOutlinedIcon, suffix: "" },
] as const;

export default function CurrentPlanCard({ billing }: { billing: Billing }) {
  const expired = !billing.active;
  const offer = PLAN_OFFERS.find((p) => p.id === billing.planType);
  const planId = (offer?.id ?? "1m") as PlanId;
  // Extensions stack, so time left can exceed one plan's length; the bar is capped at full.
  const left = Math.min(1, billing.daysLeft / (offer?.days ?? 30));

  return (
    <section className="overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface)">
      <div className="bg-linear-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) p-5 text-(--color-text-on-brand) sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase opacity-80">Current plan</p>
            <p className="mt-1 text-[26px] font-bold leading-tight">{offer?.label ?? billing.planType}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-bold ${
              expired ? "bg-(--color-danger-bg) text-(--color-danger)" : "bg-(--color-success-light) text-(--color-success-text)"
            }`}
          >
            {expired ? "Expired" : "Active"}
          </span>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-[13.5px]">
          <EventOutlinedIcon sx={{ fontSize: 17 }} />
          {expired ? "Ended on " : "Runs until "}
          <span className="font-semibold">{formatDate(billing.planExpiresAt)}</span>
          {!expired && <span className="opacity-80">· {billing.daysLeft} {billing.daysLeft === 1 ? "day" : "days"} left</span>}
        </p>
        {!expired && (
          <progress
            value={Math.max(0.04, left)}
            max={1}
            aria-label="Time left on your plan"
            className="mt-3 block h-2 w-full appearance-none overflow-hidden rounded-full bg-(--color-text-on-brand)/25 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-(--color-text-on-brand) [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-(--color-text-on-brand)"
          />
        )}
      </div>

      <div className="p-5 sm:p-6">
        {expired ? (
          <p className="text-[13px] leading-relaxed text-(--color-text-secondary)">
            Sending and scheduling notifications is paused. Your room, members and designs are untouched, and everything
            resumes the moment you renew.
          </p>
        ) : (
          <>
            <p className="text-[12px] font-semibold tracking-wide text-(--color-text-hint) uppercase">Your plan includes</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map(({ row, icon: Icon, suffix }) => {
                const value = PLAN_FEATURES.find((f) => f.label === row)?.values[planId];
                return (
                  <li key={row} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                      <Icon sx={{ fontSize: 18 }} />
                    </span>
                    <span className="text-[13px] font-medium text-(--color-text-primary)">
                      {String(value)}
                      {value === "1" ? suffix.replace("notifications", "notification") : suffix}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
