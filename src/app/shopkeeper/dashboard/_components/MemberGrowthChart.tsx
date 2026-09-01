"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ChartTooltip from "./charts/ChartTooltip";

const DAY = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const AXIS_TICK = { fontSize: 10.5, fill: "var(--color-text-hint)" };

interface Props {
  /** Joins per day across the window, oldest first. */
  joins: { date: Date; count: number }[];
  delta: number;
  windowLabel: string;
}

/**
 * Real member growth — every membership arrives with its join date, so this is
 * measured rather than estimated. Daily joins rather than a running total: the
 * headcount is already the first stat card, and the shape of the joins is what
 * the card can add.
 */
export default function MemberGrowthChart({ joins, delta, windowLabel }: Props) {
  const inWindow = joins.reduce((sum, day) => sum + day.count, 0);
  const data = joins.map((day) => ({ day: DAY.format(day.date), Joined: day.count }));

  return (
    <section className="h-full rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-bold text-(--color-text-primary)">Member Growth</h2>
          <p className="text-[11px] text-(--color-text-hint) mt-0.5">
            People joining your room, day by day.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-bold leading-none text-(--color-text-primary) tabular-nums">
            +{inWindow.toLocaleString()}
          </p>
          {delta ? (
            <p
              className={`mt-1 flex items-center justify-end gap-0.5 text-[11px] font-semibold ${
                delta > 0 ? "text-(--color-success)" : "text-(--color-danger)"
              }`}
            >
              {delta > 0 ? (
                <ArrowUpwardOutlinedIcon sx={{ fontSize: 12 }} />
              ) : (
                <ArrowDownwardOutlinedIcon sx={{ fontSize: 12 }} />
              )}
              {Math.abs(delta)}%
              <span className="font-normal text-(--color-text-hint)"> {windowLabel}</span>
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-(--color-text-hint)">{windowLabel}</p>
          )}
        </div>
      </header>

      <ResponsiveContainer width="100%" height={220} className="mt-4">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="memberFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-avatar-8)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-avatar-8)" stopOpacity={0} />
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
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border-strong)" }} />
          <Area
            type="monotone"
            dataKey="Joined"
            stroke="var(--color-avatar-8)"
            strokeWidth={2.5}
            fill="url(#memberFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
