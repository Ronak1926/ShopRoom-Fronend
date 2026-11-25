"use client";

import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { UPGRADE_HREF } from "@/features/notifications/plan";
import { CUSTOM_ANIMATION_LOCKED } from "./StudioPlanContext";

/** The Animation tool on plans without custom animation. */
export default function LockedAnimationPanel({ width }: { width: number }) {
  return (
    <aside style={{ width }} className="shrink-0 border-r border-(--color-border-default) bg-(--color-bg-surface) p-4">
      <h2 className="text-[13px] font-semibold text-(--color-text-primary)">Animation</h2>
      <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-(--color-text-secondary)">
        <LockOutlinedIcon sx={{ fontSize: 16 }} className="mt-0.5 shrink-0 text-(--color-brand-primary)" />
        {CUSTOM_ANIMATION_LOCKED}
      </p>
      <Link href={UPGRADE_HREF} className="mt-3 inline-block text-[12px] font-semibold text-(--color-brand-primary) hover:underline">
        See plans
      </Link>
    </aside>
  );
}
