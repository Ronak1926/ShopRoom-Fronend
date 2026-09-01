"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SampleBadge from "@/components/ui/SampleBadge";
import ChartTooltip from "./charts/ChartTooltip";
import type { NotificationMetrics } from "../_data/sampleMetrics";

const STAGE_COLORS = [
  "var(--color-brand-primary)",
  "var(--color-avatar-2)",
  "var(--color-avatar-1)",
  "var(--color-avatar-3)",
];

const AXIS_TICK = { fontSize: 11, fill: "var(--color-text-secondary)" };

/** Recharts hands labels through as renderable text, so narrow it here. */
function shortNumber(value: unknown): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "";
  if (amount >= 1000) return `${Math.round(amount / 100) / 10}K`;
  return String(amount);
}

/** Sent → delivered → opened → clicked, and what falls away at each step. */
export default function EngagementFunnel({ metrics }: { metrics: NotificationMetrics }) {
  const { totals } = metrics;
  const stages = [
    { stage: "Sent", value: totals.sent },
    { stage: "Delivered", value: totals.delivered },
    { stage: "Opened", value: totals.opened },
    { stage: "Clicked", value: totals.clicked },
  ];

  const share = (value: number) =>
    totals.sent ? `${Math.round((value / totals.sent) * 1000) / 10}%` : "—";

  return (
    <section className="h-full rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex items-center gap-2">
        <h2 className="text-[14px] font-bold text-(--color-text-primary)">Engagement Funnel</h2>
        <SampleBadge />
      </header>
      <p className="text-[11px] text-(--color-text-hint) mt-0.5">
        How far a notification travels, from send to tap.
      </p>

      <ResponsiveContainer width="100%" height={200} className="mt-4">
        <BarChart
          data={stages}
          layout="vertical"
          margin={{ top: 4, right: 44, bottom: 0, left: 8 }}
          barCategoryGap={12}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="stage"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-bg-surface-hover)" }} />
          <Bar dataKey="value" name="People" radius={[6, 6, 6, 6]}>
            {stages.map((stage, i) => (
              <Cell key={stage.stage} fill={STAGE_COLORS[i]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={shortNumber}
              fontSize={11}
              fill="var(--color-text-primary)"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <ul className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Delivery", value: share(totals.delivered) },
          { label: "Open", value: share(totals.opened) },
          { label: "Click", value: share(totals.clicked) },
        ].map((item) => (
          <li key={item.label} className="rounded-xl bg-(--color-bg-page) px-3 py-2.5">
            <p className="text-[10.5px] text-(--color-text-hint)">{item.label} of sent</p>
            <p className="mt-0.5 text-[15px] font-bold text-(--color-text-primary) tabular-nums">
              {item.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
