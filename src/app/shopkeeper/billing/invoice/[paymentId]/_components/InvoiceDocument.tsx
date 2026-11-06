import type { Invoice } from "@/features/billing/invoice";
import { formatDate } from "@/features/billing/format";
import { formatPaise } from "@/features/billing/formatPaise";

const halfRate = (rate: number) => `${rate / 2}%`;

function Party({ title, name, lines }: { title: string; name: string; lines: string[] }) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold tracking-wide text-(--color-text-secondary) uppercase">{title}</h2>
      <p className="mt-1 text-[14px] font-semibold text-(--color-text-primary)">{name}</p>
      {lines.map((line) => (
        <p key={line} className="text-[13px] text-(--color-text-secondary)">
          {line}
        </p>
      ))}
    </div>
  );
}

/** A printable GST tax invoice, exactly as it was issued. */
export default function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const { tax } = invoice;
  const split = tax.kind === "CGST_SGST";
  return (
    <article className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6 sm:p-8 print:rounded-none print:border-0 print:p-0">
      {invoice.refunded && (
        <p role="status" className="mb-5 rounded-lg bg-(--color-brand-alert-light) px-4 py-2.5 text-[13px] font-semibold text-(--color-brand-alert-text)">
          This payment was refunded.
        </p>
      )}

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-(--color-border-default) pb-5">
        <div>
          <h1 className="text-[24px] font-bold text-(--color-text-primary)">Tax Invoice</h1>
          <p className="mt-1 text-[13px] text-(--color-text-secondary)">Original for recipient</p>
        </div>
        <dl className="text-right text-[13px]">
          <div className="flex justify-end gap-2">
            <dt className="text-(--color-text-secondary)">Invoice no.</dt>
            <dd className="font-mono font-semibold text-(--color-text-primary)">{invoice.number}</dd>
          </div>
          <div className="flex justify-end gap-2">
            <dt className="text-(--color-text-secondary)">Date</dt>
            <dd className="font-semibold text-(--color-text-primary)">{formatDate(invoice.issuedOn)}</dd>
          </div>
        </dl>
      </header>

      <section className="grid gap-6 border-b border-(--color-border-default) py-5 sm:grid-cols-2">
        <Party title="Sold by" name={invoice.seller.name} lines={[invoice.seller.address, `GSTIN: ${invoice.seller.gstin}`]} />
        <Party
          title="Billed to"
          name={invoice.buyer.name}
          lines={[invoice.buyer.address, ...(invoice.buyer.gstin ? [`GSTIN: ${invoice.buyer.gstin}`] : []), `Place of supply: ${invoice.placeOfSupplyCode ? `${invoice.placeOfSupplyName ?? invoice.buyer.state} (state code ${invoice.placeOfSupplyCode})` : invoice.buyer.state}`]}
        />
      </section>

      <div className="overflow-x-auto py-5">
        <table className="w-full min-w-xl text-left text-[13px]">
          <thead>
            <tr className="border-b border-(--color-border-default) text-[11px] tracking-wide text-(--color-text-secondary) uppercase">
              <th className="py-2 pr-4 font-semibold">Description</th>
              <th className="py-2 pr-4 font-semibold">SAC</th>
              <th className="py-2 pr-4 text-right font-semibold">Taxable value</th>
              {split ? (
                <>
                  <th className="py-2 pr-4 text-right font-semibold">CGST ({halfRate(invoice.ratePercent)})</th>
                  <th className="py-2 pr-4 text-right font-semibold">SGST ({halfRate(invoice.ratePercent)})</th>
                </>
              ) : (
                <th className="py-2 pr-4 text-right font-semibold">IGST ({invoice.ratePercent}%)</th>
              )}
              <th className="py-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-(--color-border-default)">
              <td className="py-3 pr-4 text-(--color-text-primary)">{invoice.description}</td>
              <td className="py-3 pr-4 text-(--color-text-secondary)">{invoice.sac}</td>
              <td className="py-3 pr-4 text-right text-(--color-text-primary)">{formatPaise(tax.taxable)}</td>
              {split ? (
                <>
                  <td className="py-3 pr-4 text-right text-(--color-text-primary)">{formatPaise(tax.cgst)}</td>
                  <td className="py-3 pr-4 text-right text-(--color-text-primary)">{formatPaise(tax.sgst)}</td>
                </>
              ) : (
                <td className="py-3 pr-4 text-right text-(--color-text-primary)">{formatPaise(tax.igst)}</td>
              )}
              <td className="py-3 text-right font-semibold text-(--color-text-primary)">{formatPaise(invoice.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-end justify-between gap-4 border-t border-(--color-border-default) pt-5">
        <p className="max-w-sm text-[12px] text-(--color-text-secondary)">
          Paid online through Razorpay (payment {invoice.razorpayPaymentId}). Prices include GST. This is a computer-generated invoice.
        </p>
        <p className="text-right">
          <span className="block text-[12px] text-(--color-text-secondary)">Total (tax included)</span>
          <span className="text-[22px] font-bold text-(--color-text-primary)">{formatPaise(invoice.total)}</span>
        </p>
      </footer>
    </article>
  );
}
