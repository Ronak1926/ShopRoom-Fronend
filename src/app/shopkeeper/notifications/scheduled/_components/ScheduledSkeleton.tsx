/** Mirrors the list layout so the page does not jump when the data lands. */
export default function ScheduledSkeleton() {
  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start"
      aria-hidden
    >
      <div className="flex flex-col gap-5 min-w-0">
        <div className="flex items-center gap-3 border-b border-(--color-border-default) pb-2 animate-pulse">
          {[0, 1, 2].map((tab) => (
            <span key={tab} className="h-6 w-28 rounded bg-(--color-bg-surface-hover)" />
          ))}
        </div>

        <div className="h-20 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) animate-pulse" />

        {[0, 1].map((group) => (
          <div key={group} className="flex flex-col gap-2">
            <span className="h-3 w-40 rounded bg-(--color-bg-surface-hover) animate-pulse" />
            <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-4 flex flex-col gap-4 animate-pulse">
              {[0, 1].map((row) => (
                <div key={row} className="flex items-center gap-4">
                  <span className="w-24 h-12 rounded-xl bg-(--color-bg-surface-hover) shrink-0" />
                  <span className="flex-1 flex flex-col gap-2">
                    <span className="h-3 w-48 rounded bg-(--color-bg-surface-hover)" />
                    <span className="h-2.5 w-64 rounded bg-(--color-bg-surface-hover)" />
                  </span>
                  <span className="h-8 w-32 rounded-lg bg-(--color-bg-surface-hover)" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
        <span className="block h-3.5 w-32 rounded bg-(--color-bg-surface-hover)" />
        {[0, 1, 2, 3].map((row) => (
          <span key={row} className="block mt-4 h-3 rounded bg-(--color-bg-surface-hover)" />
        ))}
      </div>
    </div>
  );
}
