"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ChartTooltip from "./charts/ChartTooltip";
import { NEARBY_RADIUS_KM, type AudienceStats } from "../_hooks/useDashboardData";

const BAND_COLORS = [
  "var(--color-brand-primary)",
  "var(--color-avatar-2)",
  "var(--color-brand-primary-muted)",
];

const BAND_DOTS = [
  "bg-(--color-brand-primary)",
  "bg-(--color-avatar-2)",
  "bg-(--color-brand-primary-muted)",
];

interface Props {
  audience: AudienceStats;
  hasCoordinates: boolean;
  onViewMembers: () => void;
}

/**
 * Where the room actually is, in rings around the shop — the figure a radius
 * send targets. Real: every membership carries a server-computed distance.
 */
export default function AudienceLocationCard({
  audience,
  hasCoordinates,
  onViewMembers,
}: Props) {
  const total = audience.bands.reduce((sum, band) => sum + band.count, 0);
  // With nothing to plot, one flat slice keeps the ring on screen instead of
  // leaving a hole where the chart should be.
  const data = total
    ? audience.bands.map((band) => ({ name: band.label, value: band.count }))
    : [{ name: "No location data", value: 1 }];

  return (
    <section className="h-full rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 flex flex-col">
      <h2 className="text-[14px] font-bold text-(--color-text-primary)">
        Audience Location ({NEARBY_RADIUS_KM} km radius)
      </h2>

      {!hasCoordinates ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border-strong) py-10 px-5 text-center">
          <PlaceOutlinedIcon sx={{ fontSize: 20, color: "var(--color-text-hint)" }} />
          <p className="text-[12px] text-(--color-text-secondary)">
            Add your shop location in Profile to see how far your members are.
          </p>
        </div>
      ) : (
        <>
          <div className="relative mt-4">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                {total > 0 && <Tooltip content={<ChartTooltip suffix=" people" />} />}
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={total ? 1.5 : 0}
                  isAnimationActive={total > 0}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {data.map((band, i) => (
                    <Cell
                      key={band.name}
                      fill={total ? BAND_COLORS[i] : "var(--color-bg-surface-hover)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <span className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[22px] font-bold leading-none text-(--color-text-primary) tabular-nums">
                {audience.nearby.toLocaleString()}
              </span>
              <span className="text-[11px] text-(--color-text-hint) mt-1">People</span>
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {audience.bands.map((band, i) => (
              <li key={band.label} className="flex items-center gap-2.5">
                <span className={`w-2 h-2 shrink-0 rounded-full ${BAND_DOTS[i]}`} />
                <span className="flex-1 text-[12px] text-(--color-text-secondary)">
                  {band.label}
                </span>
                <span className="text-[12px] font-semibold text-(--color-text-primary) tabular-nums">
                  {band.count.toLocaleString()}
                  <span className="ml-1 font-normal text-(--color-text-hint)">
                    ({total ? Math.round((band.count / total) * 1000) / 10 : 0}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {audience.unknown > 0 && (
            <p className="mt-3 text-[11px] text-(--color-text-hint)">
              {audience.unknown.toLocaleString()} member
              {audience.unknown === 1 ? "" : "s"} share no location.
            </p>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onViewMembers}
        className="mt-4 flex items-center justify-center gap-1.5 h-9 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        <PlaceOutlinedIcon sx={{ fontSize: 15 }} />
        View location insights
      </button>
    </section>
  );
}
