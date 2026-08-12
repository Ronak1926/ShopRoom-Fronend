"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import Sidebar from "../../dashboard/_components/Sidebar";
import TopBar from "../../dashboard/_components/TopBar";
import { getCookie } from "../../../../utils/cookieUtils";

interface Props {
  title: string;
  description: string;
  icon: ElementType;
}

/**
 * Shared shell for the Notifications sub-pages (Send / Scheduled / History /
 * Templates / Preferences). The Studio editor has its own full-screen shell.
 * These pages are intentional empty states until their features are built.
 */
export default function NotificationsShell({ title, description, icon: Icon }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!getCookie("shopkeeper_token")) {
      router.replace("/customer/login?tab=shopkeeper");
    }
  }, [router]);

  function handleNavChange(id: string) {
    if (id === "profile") router.push("/shopkeeper/profile");
    else if (id !== "notifications") router.push("/shopkeeper/dashboard");
  }

  return (
    <div className="flex h-screen bg-(--color-bg-page) text-(--color-text-primary) overflow-hidden">
      <Sidebar activeNav="notifications" onNavChange={handleNavChange} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 p-7 overflow-y-auto">
          <h1 className="text-[28px] font-bold text-(--color-text-primary) mb-1">
            {title}
          </h1>
          <p className="text-[14px] text-(--color-text-secondary) mb-8">
            {description}
          </p>

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
        </main>
      </div>
    </div>
  );
}
