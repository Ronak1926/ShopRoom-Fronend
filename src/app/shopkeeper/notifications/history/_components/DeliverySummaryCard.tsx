"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "@/components/charts/ChartTooltip";
import SampleBadge from "@/components/ui/SampleBadge";
import { rate, type HistoryTotals } from "../_data/sampleHistory";

const SLICE_COLORS = [
  "var(--color-success)",
  "var(--color-brand-primary)",
  "var(--color-brand-alert-muted)",
  "var(--color-danger)",
];

const DOT_CLASSES = [
  "bg-(--color-success)",
  "bg-(--color-brand-primary)",
  "bg-(--color-brand-alert-muted)",
  "bg-(--color-danger)",
];

export default function DeliverySummaryCard({ totals }: { totals: HistoryTotals }) {
  const failedRecipients = Math.max(0, totals.failed);
  const slices = [
    { name: "Delivered", value: totals.delivered, percent: rate(totals.delivered, totals.delivered) },
    { name: "Opened", value: totals.opened, percent: rate(totals.opened, totals.delivered) },
    { name: "Clicked", value: totals.clicked, percent: rate(totals.clicked, totals.delivered) },
    { name: "Failed sends", value: failedRecipients, percent: rate(totals.failed, totals.sent) },
  ];
  const hasData = slices.some((slice) => slice.value > 0);

  return (
    <section className="h-full rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">Delivery summary</h2>
        <SampleBadge />
      </div>

      <div className="relative mt-4">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            {hasData && <Tooltip content={<ChartTooltip />} />}
            <Pie
              data={hasData ? slices : [{ name: "No sends", value: 1 }]}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={hasData ? 1.5 : 0}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={hasData}
            >
              {(hasData ? slices : [{ name: "No sends", value: 1 }]).map((slice, i) => (
                <Cell
                  key={slice.name}
                  fill={hasData ? SLICE_COLORS[i] : "var(--color-bg-surface-hover)"}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <span className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[18px] font-bold leading-none text-(--color-text-primary) tabular-nums">
            {totals.sent.toLocaleString()}
          </span>
          <span className="text-[10.5px] text-(--color-text-hint) mt-1">Sends</span>
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {slices.map((slice, i) => (
          <li key={slice.name} className="flex items-center gap-2.5">
            <span className={`w-2 h-2 shrink-0 rounded-full ${DOT_CLASSES[i]}`} />
            <span className="flex-1 text-[12px] text-(--color-text-secondary)">{slice.name}</span>
            <span className="text-[12px] font-semibold text-(--color-text-primary) tabular-nums">
              {slice.percent}%
              <span className="ml-1 font-normal text-(--color-text-hint)">
                ({slice.value.toLocaleString()})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
