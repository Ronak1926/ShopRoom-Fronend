"use client";

import { useRouter } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import ShopkeeperShell from "@/components/shopkeeper/ShopkeeperShell";

interface Props {
  title: string;
  description: string;
  icon: ElementType;
  /** Page body. Without it the shell renders the "not built yet" placeholder. */
  children?: ReactNode;
  /** Optional strip of stat/feature chips beside the page title. */
  headerAside?: ReactNode;
}

/**
 * Shared shell for the Notifications sub-pages (Send / Scheduled / History /
 * Templates / Preferences). The Studio editor has its own full-screen shell.
 * Pages that have not been built yet pass no children and get a placeholder.
 */
export default function NotificationsShell({
  title,
  description,
  icon: Icon,
  children,
  headerAside,
}: Props) {
  const router = useRouter();

  return (
    <ShopkeeperShell>
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-(--color-text-primary) mb-1">
                {title}
              </h1>
              <p className="text-[14px] text-(--color-text-secondary)">{description}</p>
            </div>
            {headerAside}
          </div>

          {children}

          {!children && (
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-(--color-border-strong) bg-(--color-bg-surface) py-20 px-6">
            <span className="w-14 h-14 rounded-2xl bg-(--color-brand-primary-light) flex items-center justify-center text-(--color-brand-primary) mb-4">
              <Icon sx={{ fontSize: 28 }} />
            </span>
            <h2 className="text-[17px] font-semibold text-(--color-text-primary)">
              {title} is coming together
            </h2>
            <p className="mt-1.5 max-w-md text-[13px] text-(--color-text-secondary)">
              This section is part of the notification system. The Notification
              Studio editor is ready — the rest of this workflow will plug into
              the same designs.
            </p>
            <button
              type="button"
              onClick={() => router.push("/shopkeeper/notifications/studio")}
              className="mt-6 h-10 px-5 rounded-lg bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-(--color-text-on-brand) text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Open Notification Studio
            </button>
          </div>
          )}
    </ShopkeeperShell>
  );
}
