import type { Billing, PlanId } from "@/features/billing/api";
import { formatInr } from "@/features/billing/format";

interface PlanPickerProps {
  plans: Billing["plans"];
  selected: PlanId | null;
  onSelect: (id: PlanId) => void;
  onPay: () => void;
  paying: boolean;
  active: boolean;
}

const POPULAR: PlanId = "2m";

export default function PlanPicker({ plans, selected, onSelect, onPay, paying, active }: PlanPickerProps) {
  const chosen = plans.find((p) => p.id === selected);
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">{active ? "Extend your plan" : "Renew your plan"}</h2>
      <p className="mt-1 text-[13px] text-(--color-text-secondary)">
        {active ? "Time you buy is added to the end of your current plan, so nothing is lost." : "Pick a length and pay securely with Razorpay."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              aria-pressed={isSelected}
              className={`relative rounded-xl border-2 p-4 text-left transition ${
                isSelected
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary-light)"
                  : "border-(--color-border-default) hover:border-(--color-brand-primary)/50"
              }`}
            >
              {plan.id === POPULAR && (
                <span className="absolute -top-2.5 left-3 rounded-full bg-(--color-brand-primary) px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                  Popular
                </span>
              )}
              <p className="text-[14px] font-semibold text-(--color-text-primary)">{plan.label}</p>
              <p className="mt-1 text-[22px] font-extrabold text-(--color-text-primary)">{formatInr(plan.priceInr)}</p>
              <p className="text-[11px] text-(--color-text-hint)">{plan.days} days · one-time</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={!chosen || paying}
        className="mt-5 h-12 w-full rounded-lg bg-(--color-brand-primary) text-[15px] font-semibold text-white transition hover:bg-(--color-brand-primary-hover) disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {paying ? "Processing…" : chosen ? `Pay ${formatInr(chosen.priceInr)}` : "Choose a plan"}
      </button>
    </section>
  );
}
