"use client";

import { useRouter } from "next/navigation";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import SampleBadge from "./SampleBadge";
import ChartTooltip from "./charts/ChartTooltip";
import type { MetricPoint } from "../_data/sampleMetrics";

const DAY = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

const AXIS_TICK = { fontSize: 10.5, fill: "var(--color-text-hint)" };

function shortNumber(value: number): string {
  if (value >= 1000) return `${Math.round(value / 100) / 10}K`;
  return String(value);
}

export default function PerformanceChart({
  series,
  rangeLabel,
}: {
  series: MetricPoint[];
  rangeLabel: string;
}) {
  const router = useRouter();
  const data = series.map((point) => ({
    day: DAY.format(point.date),
    Sent: point.sent,
    Delivered: point.delivered,
    Opened: point.opened,
    Clicked: point.clicked,
  }));

  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-(--color-text-primary)">
            Notification Performance
          </h2>
          <SampleBadge />
        </div>
        <span className="h-8 px-3 rounded-lg border border-(--color-border-default) text-[12px] font-medium text-(--color-text-secondary) flex items-center">
          {rangeLabel}
        </span>
      </header>

      <ResponsiveContainer width="100%" height={260} className="mt-4">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="var(--color-border-default)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            minTickGap={16}
          />
          <YAxis
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={shortNumber}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border-strong)" }} />
          <Legend
            iconType="plainline"
            iconSize={14}
            wrapperStyle={{ fontSize: 11.5, paddingTop: 8 }}
          />

          <Area
            type="monotone"
            dataKey="Sent"
            stroke="var(--color-brand-primary)"
            strokeWidth={2.5}
            fill="url(#sentFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Delivered"
            stroke="var(--color-avatar-2)"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Opened"
            stroke="var(--color-avatar-1)"
            strokeWidth={2}
            strokeDasharray="3 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Clicked"
            stroke="var(--color-avatar-3)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <button
        type="button"
        onClick={() => router.push("/shopkeeper/notifications/history")}
        className="mt-3 flex items-center gap-1.5 h-9 px-4 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        <InsightsOutlinedIcon sx={{ fontSize: 16 }} />
        View detailed analytics
      </button>
    </section>
  );
}
