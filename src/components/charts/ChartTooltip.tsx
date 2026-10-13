"use client";

interface TooltipEntry {
  name?: string | number;
  value?: string | number;
  color?: string;
}

interface Props {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  /** Appended to every value, e.g. "%" or " members". */
  suffix?: string;
}

/**
 * Shared tooltip for every chart on the dashboard.
 *
 * Written as a component rather than Recharts' `contentStyle` so the panel is
 * built from the same tokens and Tailwind classes as the cards around it.
 */
export default function ChartTooltip({ active, label, payload, suffix = "" }: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) px-3 py-2 shadow-(--shadow-md)">
      {label !== undefined && (
        <p className="text-[11px] font-semibold text-(--color-text-primary)">{label}</p>
      )}
      <ul className="mt-1 flex flex-col gap-1">
        {payload.map((entry, i) => (
          <li
            key={`${entry.name ?? i}`}
            className="flex items-center gap-2 text-[11px] text-(--color-text-secondary)"
          >
            {/* The series colour only exists at runtime, so the swatch is
                drawn rather than classed. */}
            <svg width="8" height="8" className="shrink-0" aria-hidden>
              <circle cx="4" cy="4" r="4" fill={entry.color} />
            </svg>
            <span className="flex-1">{entry.name}</span>
            <span className="font-semibold text-(--color-text-primary) tabular-nums">
              {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
              {suffix}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
