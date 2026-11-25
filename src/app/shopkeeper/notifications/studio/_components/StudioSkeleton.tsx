import type { ReactNode } from "react";

const BLOCK = "animate-pulse rounded bg-(--color-bg-surface-hover)";

/**
 * Shown until the Studio knows which layout to use (the screen size and the shop's plan), so it
 * never starts as one editor and swaps to another. Mirrors the real shell: sidebar, top bar, canvas.
 */
export default function StudioSkeleton({ sidebar }: { sidebar: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) lg:flex-row" aria-busy="true" aria-label="Loading the studio">
      {sidebar}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-(--color-border-default) bg-(--color-bg-surface) px-4">
          <div className={`${BLOCK} h-5 w-48`} />
          <div className={`${BLOCK} ml-auto h-9 w-24`} />
        </div>
        <div className="flex flex-1 items-start justify-center p-6">
          <div className={`${BLOCK} aspect-2/1 w-full max-w-[560px] rounded-2xl`} />
        </div>
      </div>
    </div>
  );
}
