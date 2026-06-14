"use client";

import { useState, useEffect } from "react";

interface Props {
  planType: string;
  planExpiresAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProfilePlanCard({ planType, planExpiresAt }: Props) {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [pct, setPct] = useState(0);
  const isPro = planType.toUpperCase() === "PRO";

  useEffect(() => {
    const expires = new Date(planExpiresAt);
    const days = Math.max(
      0,
      Math.ceil((expires.getTime() - Date.now()) / 86_400_000),
    );
    setDaysRemaining(days);
    setPct(Math.min(100, Math.round((days / 365) * 100)));
  }, [planExpiresAt]);

  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-(--color-text-secondary) uppercase tracking-wide">
          Plan
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
            isPro
              ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
              : "bg-(--color-bg-surface-hover) text-(--color-text-secondary)"
          }`}
        >
          {planType.toUpperCase()}
        </span>
      </div>

      <div>
        <p className="text-[13px] text-(--color-text-secondary)">
          Expires{" "}
          <span
            className="font-medium text-(--color-text-primary)"
            suppressHydrationWarning
          >
            {formatDate(planExpiresAt)}
          </span>
        </p>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">
          {daysRemaining} days remaining
        </p>
      </div>

      {/* Progress bar — dynamic width requires inline style */}
      <div className="h-1.5 rounded-full bg-(--color-bg-surface-hover) overflow-hidden">
        <div
          className="h-full rounded-full bg-(--color-brand-primary) transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <a
        href="/shopkeeper/dashboard"
        className="text-[13px] font-medium text-(--color-text-link) hover:text-(--color-text-link-hover) transition-colors"
      >
        Manage Billing →
      </a>
    </div>
  );
}
