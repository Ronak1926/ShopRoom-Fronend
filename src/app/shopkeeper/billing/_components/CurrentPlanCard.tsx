import type { Billing } from "@/features/billing/api";
import { formatDate } from "@/features/billing/format";

const PLAN_LABELS: Record<string, string> = { "1m": "1 Month", "2m": "2 Months", "3m": "3 Months" };

export default function CurrentPlanCard({ billing }: { billing: Billing }) {
  const expired = !billing.active;
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold tracking-wide text-(--color-text-secondary) uppercase">Current plan</p>
          <p className="mt-1 text-[24px] font-bold text-(--color-text-primary)">{PLAN_LABELS[billing.planType] ?? billing.planType}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[12px] font-bold ${
            expired ? "bg-(--color-danger-bg) text-(--color-danger)" : "bg-(--color-success-light) text-(--color-success-text)"
          }`}
        >
          {expired ? "Expired" : "Active"}
        </span>
      </div>
      <p className="mt-4 text-[14px] text-(--color-text-secondary)">
        {expired ? "Ended on " : "Renews on "}
        <span className="font-semibold text-(--color-text-primary)">{formatDate(billing.planExpiresAt)}</span>
        {!expired && <> · {billing.daysLeft} {billing.daysLeft === 1 ? "day" : "days"} left</>}
      </p>
      {expired && (
        <p className="mt-2 text-[13px] text-(--color-text-secondary)">
          Sending and scheduling notifications is paused. Your room, members and designs are untouched, and everything resumes the moment you renew.
        </p>
      )}
    </section>
  );
}
