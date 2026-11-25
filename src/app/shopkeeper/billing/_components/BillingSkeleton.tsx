const BLOCK = "animate-pulse rounded bg-(--color-bg-surface-hover)";

export default function BillingSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6" aria-busy="true" aria-label="Loading billing">
      <div>
        <div className={`${BLOCK} h-8 w-40`} />
        <div className={`${BLOCK} mt-2 h-4 w-72`} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface)">
        <div className={`${BLOCK} h-40 rounded-none`} />
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${BLOCK} h-9 rounded-xl`} />
          ))}
        </div>
      </div>
      <div className={`${BLOCK} h-5 w-56`} />
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${BLOCK} h-96 rounded-2xl`} />
        ))}
      </div>
      <div className={`${BLOCK} h-72 rounded-2xl`} />
      <div className={`${BLOCK} h-40 rounded-2xl`} />
    </div>
  );
}
