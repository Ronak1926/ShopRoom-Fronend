import Link from "next/link";
import type { Billing } from "@/features/billing/api";
import { formatDate, formatInr } from "@/features/billing/format";

const PLAN_LABELS: Record<string, string> = { "1m": "1 Month", "2m": "2 Months", "3m": "3 Months" };
const PURPOSE_LABELS = { REGISTRATION: "Sign-up", RENEWAL: "Renewal" } as const;

export default function PaymentHistory({ payments, invoicesEnabled }: { payments: Billing["payments"]; invoicesEnabled: boolean }) {
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">Payment history</h2>
      {payments.length === 0 ? (
        <p className="mt-3 text-[13px] text-(--color-text-secondary)">No payments yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-md text-left text-[13px]">
            <thead>
              <tr className="border-b border-(--color-border-default) text-[11px] tracking-wide text-(--color-text-secondary) uppercase">
                <th className="py-2 pr-4 font-semibold">Date</th>
                <th className="py-2 pr-4 font-semibold">For</th>
                <th className="py-2 pr-4 font-semibold">Plan</th>
                <th className="py-2 pr-4 text-right font-semibold">Amount</th>
                {invoicesEnabled && <th className="py-2 text-right font-semibold">Invoice</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-(--color-border-default) last:border-0">
                  <td className="py-2.5 pr-4 text-(--color-text-primary)">{formatDate(p.paidAt)}</td>
                  <td className="py-2.5 pr-4 text-(--color-text-secondary)">{PURPOSE_LABELS[p.purpose]}</td>
                  <td className="py-2.5 pr-4 text-(--color-text-secondary)">{PLAN_LABELS[p.planType] ?? p.planType}</td>
                  <td className="py-2.5 pr-4 text-right font-semibold text-(--color-text-primary)">
                    {formatInr(p.amountInr)}
                    {p.refunded && <span className="ml-2 rounded-full bg-(--color-bg-surface-hover) px-2 py-0.5 text-[11px] font-semibold text-(--color-text-secondary)">Refunded</span>}
                  </td>
                  {invoicesEnabled && (
                    <td className="py-2.5 text-right">
                      <Link href={`/shopkeeper/billing/invoice/${p.id}`} className="text-[13px] font-semibold text-(--color-brand-primary) hover:underline">
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
