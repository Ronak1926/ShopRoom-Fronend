/**
 * Mirrors the real card grid — same columns, same 2:1 preview, same footer
 * rows — so the page does not jump when the data lands.
 */
export default function TemplateGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-2/1 bg-(--color-bg-surface-hover)" />
          <div className="px-3 pt-3 flex items-center justify-between gap-2">
            <span className="h-3 w-24 rounded bg-(--color-bg-surface-hover)" />
            <span className="h-3 w-14 rounded-full bg-(--color-bg-surface-hover)" />
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            <span className="h-8 rounded-lg bg-(--color-bg-surface-hover)" />
            <span className="h-8 rounded-lg bg-(--color-bg-surface-hover)" />
          </div>
        </div>
      ))}
    </div>
  );
}
