/** Placeholder while a chart card and its Recharts bundle arrive. */
export default function ChartCardSkeleton() {
  return (
    <div
      className="h-full rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse"
      aria-hidden
    >
      <span className="block h-3.5 w-44 rounded bg-(--color-bg-surface-hover)" />
      <span className="block mt-4 h-56 rounded-xl bg-(--color-bg-surface-hover)" />
    </div>
  );
}
