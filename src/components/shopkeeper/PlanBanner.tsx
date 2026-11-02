"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { usePlanStatus } from "@/features/billing/usePlanStatus";

const WARN_WITHIN_DAYS = 7;

/** A strip above every shopkeeper page once the plan has ended, or is about to. */
export default function PlanBanner() {
  const { billing } = usePlanStatus();
  const pathname = usePathname();
  if (!billing || pathname.startsWith("/shopkeeper/billing")) return null;

  const expired = !billing.active;
  if (!expired && billing.daysLeft > WARN_WITHIN_DAYS) return null;

  const message = expired
    ? "Your plan has ended. Sending and scheduling notifications is paused until you renew."
    : `Your plan ends in ${billing.daysLeft} ${billing.daysLeft === 1 ? "day" : "days"}. Renew to keep sending notifications.`;

  return (
    <div
      role={expired ? "alert" : "status"}
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-[13px] sm:px-7 ${
        expired
          ? "bg-(--color-danger-bg) text-(--color-danger)"
          : "bg-(--color-brand-alert-light) text-(--color-brand-alert-text)"
      }`}
    >
      <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />
      <span className="min-w-0 flex-1">{message}</span>
      <Link href="/shopkeeper/billing" className="font-bold underline">
        Renew plan
      </Link>
    </div>
  );
}
