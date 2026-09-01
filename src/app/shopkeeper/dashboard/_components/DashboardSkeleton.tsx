/** Mirrors the dashboard grid so nothing jumps when the data lands. */
export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden>
      <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <span className="w-13 h-13 rounded-2xl bg-(--color-bg-surface-hover)" />
          <span className="flex flex-col gap-2">
            <span className="block h-3 w-24 rounded bg-(--color-bg-surface-hover)" />
            <span className="block h-5 w-56 rounded bg-(--color-bg-surface-hover)" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-4 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-(--color-bg-surface-hover) shrink-0" />
              <span className="flex-1 flex flex-col gap-2">
                <span className="block h-2.5 w-20 rounded bg-(--color-bg-surface-hover)" />
                <span className="block h-5 w-16 rounded bg-(--color-bg-surface-hover)" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-5 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
          <span className="block h-3.5 w-48 rounded bg-(--color-bg-surface-hover)" />
          <span className="block mt-4 h-56 rounded-xl bg-(--color-bg-surface-hover)" />
        </div>
        <div className="xl:col-span-3 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
          <span className="block h-3.5 w-40 rounded bg-(--color-bg-surface-hover)" />
          <span className="block mt-6 mx-auto w-40 h-40 rounded-full bg-(--color-bg-surface-hover)" />
        </div>
        <div className="xl:col-span-4 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
          <span className="block h-3.5 w-36 rounded bg-(--color-bg-surface-hover)" />
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="block mt-3 h-12 rounded-xl bg-(--color-bg-surface-hover)" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
          <span className="block h-3.5 w-44 rounded bg-(--color-bg-surface-hover)" />
          <span className="block mt-4 h-64 rounded-xl bg-(--color-bg-surface-hover)" />
        </div>
        <div className="xl:col-span-5 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 animate-pulse">
          <span className="block h-3.5 w-36 rounded bg-(--color-bg-surface-hover)" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="block h-20 rounded-xl bg-(--color-bg-surface-hover)" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
