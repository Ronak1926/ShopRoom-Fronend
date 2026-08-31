/** Mirrors the two-column send layout so the page does not jump when it loads. */
export default function SendSkeleton() {
  return (
    <div
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start"
      aria-hidden
    >
      <div className="flex flex-col gap-5 min-w-0">
        {[0, 1, 2].map((card) => (
          <div
            key={card}
            className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-(--color-bg-surface-hover)" />
              <span className="h-3.5 w-40 rounded bg-(--color-bg-surface-hover)" />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="h-24 rounded-xl bg-(--color-bg-surface-hover)" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {[0, 1].map((card) => (
          <div
            key={card}
            className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse"
          >
            <span className="block h-3.5 w-44 rounded bg-(--color-bg-surface-hover)" />
            <span className="block mt-4 h-40 rounded-xl bg-(--color-bg-surface-hover)" />
          </div>
        ))}
      </div>
    </div>
  );
}
