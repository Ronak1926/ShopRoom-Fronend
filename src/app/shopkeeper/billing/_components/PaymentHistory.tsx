import Link from "next/link";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import type { Billing } from "@/features/billing/api";
import { formatDate, formatInr } from "@/features/billing/format";
import { PLAN_OFFERS } from "@/features/billing/plans";

const PURPOSE_LABELS = { REGISTRATION: "Sign-up", RENEWAL: "Renewal" } as const;
const planLabel = (id: string) => PLAN_OFFERS.find((p) => p.id === id)?.label ?? id;

function Refunded() {
  return <span className="rounded-full bg-(--color-bg-surface-hover) px-2 py-0.5 text-[11px] font-semibold text-(--color-text-secondary)">Refunded</span>;
}

export default function PaymentHistory({ payments, invoicesEnabled }: { payments: Billing["payments"]; invoicesEnabled: boolean }) {
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 sm:p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">Payment history</h2>
      {payments.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-(--color-border-strong) py-8 text-center">
          <ReceiptLongOutlinedIcon sx={{ fontSize: 26 }} className="text-(--color-text-hint)" />
          <p className="text-[13px] text-(--color-text-secondary)">No payments yet.</p>
        </div>
      ) : (
        <>
          <table className="mt-3 hidden w-full text-left text-[13px] sm:table">
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
                  <td className="py-3 pr-4 text-(--color-text-primary)">{formatDate(p.paidAt)}</td>
                  <td className="py-3 pr-4 text-(--color-text-secondary)">{PURPOSE_LABELS[p.purpose]}</td>
                  <td className="py-3 pr-4 text-(--color-text-secondary)">{planLabel(p.planType)}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-(--color-text-primary)">
                    {formatInr(p.amountInr)}
                    {p.refunded && <span className="ml-2"><Refunded /></span>}
                  </td>
                  {invoicesEnabled && (
                    <td className="py-3 text-right">
                      <Link href={`/shopkeeper/billing/invoice/${p.id}`} className="text-[13px] font-semibold text-(--color-brand-primary) hover:underline">
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-3 flex flex-col gap-2 sm:hidden">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-(--color-border-default) px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-(--color-text-primary)">
                    {planLabel(p.planType)} · {PURPOSE_LABELS[p.purpose]}
                  </p>
                  <p className="text-[12px] text-(--color-text-hint)">{formatDate(p.paidAt)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[14px] font-bold text-(--color-text-primary)">{formatInr(p.amountInr)}</span>
                  {p.refunded && <Refunded />}
                  {invoicesEnabled && (
                    <Link href={`/shopkeeper/billing/invoice/${p.id}`} className="text-[12px] font-semibold text-(--color-brand-primary)">
                      Invoice
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
