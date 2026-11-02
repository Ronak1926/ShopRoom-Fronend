const BLOCK = "animate-pulse rounded bg-(--color-bg-surface-hover)";

export default function BillingSkeleton() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5" aria-busy="true" aria-label="Loading billing">
      <div className={`${BLOCK} h-8 w-40`} />
      <div className={`${BLOCK} h-36 rounded-2xl`} />
      <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-6">
        <div className={`${BLOCK} h-5 w-40`} />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${BLOCK} h-28 rounded-xl`} />
          ))}
        </div>
        <div className={`${BLOCK} mt-5 h-12 w-40`} />
      </div>
      <div className={`${BLOCK} h-48 rounded-2xl`} />
    </div>
  );
}
