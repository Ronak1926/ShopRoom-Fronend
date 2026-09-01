/** The reporting windows the dashboard can be read over. */
export const RANGE_OPTIONS: { value: number; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
];

export const DEFAULT_RANGE_DAYS = 7;

const SPAN_DAY = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const SPAN_END = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "26 Apr – 2 May 2026" for the window ending today. */
export function rangeSpanLabel(days: number): string {
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  return `${SPAN_DAY.format(start)} – ${SPAN_END.format(end)}`;
}

export function rangeLabel(days: number): string {
  return RANGE_OPTIONS.find((option) => option.value === days)?.label ?? `Last ${days} days`;
}
