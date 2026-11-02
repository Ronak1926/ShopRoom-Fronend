"use client";

export default function ProfileSkeleton() {
  return (
    <div>
      <div className="h-8 w-48 rounded-xl animate-pulse bg-(--color-bg-surface-hover) mb-6" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left column */}
        <div className="w-full shrink-0 flex flex-col gap-4 lg:w-85">
          <div className="h-72 rounded-2xl animate-pulse bg-(--color-bg-surface-hover)" />
          <div className="h-40 rounded-2xl animate-pulse bg-(--color-bg-surface-hover)" />
          <div className="h-44 rounded-2xl animate-pulse bg-(--color-bg-surface-hover)" />
        </div>
        {/* Right column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-80 rounded-2xl animate-pulse bg-(--color-bg-surface-hover)" />
          <div className="h-44 rounded-2xl animate-pulse bg-(--color-bg-surface-hover)" />
        </div>
      </div>
    </div>
  );
}
