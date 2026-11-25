import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { Billing, PlanId } from "@/features/billing/api";
import { formatDate, formatInr } from "@/features/billing/format";
import { PLAN_FEATURES, PLAN_OFFERS, pricePerMonth, savingVersusMonthly } from "@/features/billing/plans";

interface PlanPickerProps {
  plans: Billing["plans"];
  currentPlan: string;
  /** When the running plan ends (ISO). */
  expiresAt: string;
  active: boolean;
  /** The plan whose payment is in progress, if any. */
  paying: PlanId | null;
  onChoose: (id: PlanId) => void;
}

const RANK: Record<string, number> = { "1m": 1, "2m": 2, "3m": 3 };

/** The rows shown on each card; the full list is in the comparison table below. */
const CARD_ROWS = ["Notifications a day", "Who you can reach", "Ready-made templates", "Editing", "Design from a blank canvas", "Custom animations"];

export default function PlanPicker({ plans, currentPlan, expiresAt, active, paying, onChoose }: PlanPickerProps) {
  return (
    <section id="plans" className="scroll-mt-6">
      <h2 className="text-[18px] font-bold text-(--color-text-primary)">{active ? "Extend or change your plan" : "Renew your plan"}</h2>
      <p className="mt-1 flex items-start gap-1.5 text-[13px] leading-relaxed text-(--color-text-secondary)">
        <InfoOutlinedIcon sx={{ fontSize: 16 }} className="mt-0.5 shrink-0" />
        The plan you buy starts straight away, and its days are added on top of the time you have left, so you can
        extend or upgrade any time. A shorter plan becomes available once your current one ends. One-time payment
        through Razorpay; nothing renews automatically.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const offer = PLAN_OFFERS.find((o) => o.id === plan.id);
          const isCurrent = active && plan.id === currentPlan;
          // The API refuses a lower plan while a higher one is running (it would shrink days already paid for).
          const locked = active && RANK[plan.id] < (RANK[currentPlan] ?? 1);
          const saving = offer ? savingVersusMonthly(offer) : 0;
          const featured = !!offer?.recommended;
          const busy = paying === plan.id;
          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 bg-(--color-bg-surface) p-5 ${
                featured ? "border-(--color-brand-primary) shadow-(--shadow-brand-glow)" : "border-(--color-border-default)"
              }`}
            >
              <div className="flex min-h-6 flex-wrap items-center gap-1.5">
                {featured && (
                  <span className="rounded-full bg-(--color-brand-primary) px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-(--color-text-on-brand) uppercase">
                    Most popular
                  </span>
                )}
                {isCurrent && (
                  <span className="rounded-full bg-(--color-success-light) px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-(--color-success-text) uppercase">
                    Your plan
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-[17px] font-bold text-(--color-text-primary)">{plan.label}</h3>
              <p className="text-[12px] text-(--color-text-hint)">{offer?.description}</p>

              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[30px] font-extrabold leading-none text-(--color-text-primary)">{formatInr(plan.priceInr)}</span>
                <span className="text-[12px] text-(--color-text-hint)">for {plan.days} days</span>
              </p>
              <p className="mt-1.5 flex min-h-6 flex-wrap items-center gap-1.5 text-[12px] text-(--color-text-secondary)">
                {offer && <span>{formatInr(pricePerMonth(offer))} a month</span>}
                {saving > 0 && (
                  <span className="rounded-full bg-(--color-success-light) px-2 py-0.5 text-[11px] font-semibold text-(--color-success-text)">
                    Save {formatInr(saving)}
                  </span>
                )}
              </p>

              <ul className="mt-4 flex flex-1 flex-col gap-2.5 border-t border-(--color-border-default) pt-4">
                {CARD_ROWS.map((label) => {
                  const value = PLAN_FEATURES.find((f) => f.label === label)?.values[plan.id];
                  const included = value !== false;
                  return (
                    <li key={label} className="flex items-start gap-2 text-[12.5px] leading-snug">
                      {included ? (
                        <CheckOutlinedIcon sx={{ fontSize: 16 }} className="mt-px shrink-0 text-(--color-success)" />
                      ) : (
                        <CloseOutlinedIcon sx={{ fontSize: 16 }} className="mt-px shrink-0 text-(--color-text-hint)" />
                      )}
                      <span className={included ? "text-(--color-text-primary)" : "text-(--color-text-hint) line-through"}>
                        {typeof value === "string" ? (
                          <>
                            <span className="font-semibold">{value}</span>
                            {label === "Notifications a day" ? " notification" + (value === "1" ? "" : "s") + " a day" : ""}
                            {label === "Ready-made templates" ? " templates" : ""}
                          </>
                        ) : (
                          label
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {locked && (
                <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-(--color-bg-page) px-3 py-2 text-[11.5px] leading-snug text-(--color-text-secondary)">
                  <LockOutlinedIcon sx={{ fontSize: 14 }} className="mt-px shrink-0" />
                  Your plan has higher limits until {formatDate(expiresAt)}, so this one can be bought after that.
                </p>
              )}

              <button
                type="button"
                onClick={() => onChoose(plan.id)}
                disabled={paying !== null || locked}
                className={`mt-4 h-11 w-full rounded-xl text-[14px] font-semibold transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                  featured
                    ? "bg-(--color-brand-primary) text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover)"
                    : "border border-(--color-brand-primary) text-(--color-brand-primary) hover:bg-(--color-brand-primary-light)"
                }`}
              >
                {busy ? "Processing…" : locked ? `Available after ${formatDate(expiresAt)}` : `${isCurrent ? "Extend" : active ? "Switch to" : "Get"} ${plan.label} · ${formatInr(plan.priceInr)}`}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
