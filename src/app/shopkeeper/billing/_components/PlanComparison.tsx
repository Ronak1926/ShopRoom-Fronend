import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { PLAN_FEATURES, PLAN_OFFERS } from "@/features/billing/plans";

function Value({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} className="text-(--color-success)" aria-label="Included" />;
  if (value === false) return <RemoveOutlinedIcon sx={{ fontSize: 18 }} className="text-(--color-text-hint)" aria-label="Not included" />;
  return <span className="text-[12.5px] font-medium text-(--color-text-primary)">{value}</span>;
}

/** Every plan side by side, feature by feature. */
export default function PlanComparison({ currentPlan }: { currentPlan: string }) {
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 sm:p-6">
      <h2 className="text-[16px] font-bold text-(--color-text-primary)">What each plan includes</h2>

      {/* Wide screens: a table. */}
      <table className="mt-4 hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-(--color-border-default)">
            <th className="py-3 pr-4 text-[11px] font-semibold tracking-wide text-(--color-text-hint) uppercase">Feature</th>
            {PLAN_OFFERS.map((p) => (
              <th key={p.id} className="w-1/5 py-3 pr-4 text-center">
                <span className={`text-[13px] font-bold ${p.id === currentPlan ? "text-(--color-brand-primary)" : "text-(--color-text-primary)"}`}>{p.label}</span>
                <span className="block text-[11px] font-medium text-(--color-text-hint)">₹{p.price.toLocaleString("en-IN")}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN_FEATURES.map((row) => (
            <tr key={row.label} className="border-b border-(--color-border-default) last:border-0">
              <td className="py-3 pr-4">
                <span className="text-[13px] font-medium text-(--color-text-primary)">{row.label}</span>
                {row.hint && <span className="block text-[11px] text-(--color-text-hint)">{row.hint}</span>}
              </td>
              {PLAN_OFFERS.map((p) => (
                <td key={p.id} className={`py-3 pr-4 text-center ${p.id === currentPlan ? "bg-(--color-brand-primary-light)" : ""}`}>
                  <Value value={row.values[p.id]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phones: one block per feature, plans listed inside it. */}
      <dl className="mt-3 flex flex-col divide-y divide-(--color-border-default) md:hidden">
        {PLAN_FEATURES.map((row) => (
          <div key={row.label} className="py-3">
            <dt className="text-[13px] font-semibold text-(--color-text-primary)">{row.label}</dt>
            {row.hint && <p className="text-[11px] text-(--color-text-hint)">{row.hint}</p>}
            <dd className="mt-2 grid grid-cols-3 gap-2">
              {PLAN_OFFERS.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col items-center gap-1 rounded-lg px-1.5 py-2 text-center ${
                    p.id === currentPlan ? "bg-(--color-brand-primary-light)" : "bg-(--color-bg-page)"
                  }`}
                >
                  <span className="text-[10.5px] font-semibold text-(--color-text-hint)">{p.label}</span>
                  <Value value={row.values[p.id]} />
                </div>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
