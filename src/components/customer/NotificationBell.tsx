"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { getFeed, type Feed } from "@/features/push/pushApi";
import { requestReplay } from "@/features/push/tapLink";
import { getCookie } from "@/utils/cookieUtils";
import { timeAgo } from "@/utils/timeAgo";

const REFRESH_MS = 60_000;

/**
 * The customer's notification bell: recent notifications from the shops they've joined.
 * Tapping one plays its animated banner again, exactly as tapping it in the OS tray does.
 */
export default function NotificationBell() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    const token = getCookie("token");
    if (!token) return;
    getFeed(token).then(
      (next) => {
        setFeed(next);
        setFailed(false);
      },
      () => setFailed(true),
    );
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) refresh();
    setOpen((v) => !v);
  }

  function play(sendId: string, receiptToken: string) {
    requestReplay({ sendId, receiptToken });
    setOpen(false);
    setFeed((prev) =>
      prev
        ? {
            items: prev.items.map((i) => (i.sendId === sendId ? { ...i, read: true } : i)),
            unread: Math.max(0, prev.unread - (prev.items.find((i) => i.sendId === sendId)?.read ? 0 : 1)),
          }
        : prev,
    );
  }

  const unread = feed?.unread ?? 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-page)"
      >
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-danger-dot) px-1 text-[10px] leading-none font-bold text-white ring-2 ring-(--color-bg-surface)">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-(--shadow-lg)">
          <p className="border-b border-(--color-border-default) px-4 py-3 text-[13px] font-bold text-(--color-text-primary)">Notifications</p>
          {failed && !feed ? (
            <p className="px-4 py-8 text-center text-[13px] text-(--color-text-secondary)">Could not load notifications.</p>
          ) : !feed ? (
            <div className="flex animate-pulse flex-col gap-3 p-4" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 rounded bg-(--color-bg-surface-hover)" />
              ))}
            </div>
          ) : feed.items.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-(--color-text-secondary)">
              Nothing yet. Notifications from the shops you join show up here.
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {feed.items.map((item) => (
                <li key={item.sendId}>
                  <button
                    type="button"
                    onClick={() => play(item.sendId, item.receiptToken)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-(--color-bg-page)"
                  >
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-transparent" : "bg-(--color-brand-primary)"}`} />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[13px] text-(--color-text-primary) ${item.read ? "font-medium" : "font-bold"}`}>{item.shopName}</span>
                      <span className="block truncate text-[12px] text-(--color-text-secondary)">{item.message ?? "Sent you a notification"}</span>
                      <span className="mt-0.5 block text-[11px] text-(--color-text-hint)">{timeAgo(item.sentAt)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
