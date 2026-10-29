"use client";

import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { usePushNotifications } from "@/hooks/usePushNotifications";

function PushNotificationsSkeleton() {
  return (
    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="h-5 w-40 rounded animate-pulse bg-(--color-bg-surface-hover) mb-3" />
      <div className="h-4 w-64 rounded animate-pulse bg-(--color-bg-surface-hover) mb-4" />
      <div className="h-9 w-32 rounded-lg animate-pulse bg-(--color-bg-surface-hover)" />
    </div>
  );
}

export default function PushNotificationsCard() {
  const { permission, loading, error, enable, disable } = usePushNotifications();

  if (permission === "checking") {
    return <PushNotificationsSkeleton />;
  }

  const isEnabled = permission === "granted";

  return (
    <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2 mb-1">
        {isEnabled ? (
          <NotificationsActiveOutlinedIcon sx={{ fontSize: 20 }} className="text-(--color-brand-primary)" />
        ) : (
          <NotificationsOffOutlinedIcon sx={{ fontSize: 20 }} className="text-(--color-text-secondary)" />
        )}
        <h2 className="text-base font-semibold text-(--color-text-primary)">
          Push Notifications
        </h2>
      </div>

      {permission === "unsupported" ? (
        <p className="text-sm text-(--color-text-secondary)">
          Push notifications aren&apos;t supported in this browser.
        </p>
      ) : permission === "denied" ? (
        <p className="text-sm text-(--color-text-secondary)">
          Notifications are blocked for ShopRoom in your browser settings. Enable them from your
          browser&apos;s site settings to receive updates from shops you&apos;ve joined.
        </p>
      ) : (
        <>
          <p className="text-sm text-(--color-text-secondary) mb-4">
            Get notified when shops you&apos;ve joined send a new update, even when ShopRoom isn&apos;t open.
          </p>
          <button
            type="button"
            onClick={isEnabled ? disable : enable}
            disabled={loading}
            className="h-9 px-4 flex items-center gap-1.5 rounded-lg text-[13px] font-semibold text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) border-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Working..." : isEnabled ? "Disable" : "Enable"}
          </button>
          {error && <p className="text-sm text-(--color-danger-text) mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
