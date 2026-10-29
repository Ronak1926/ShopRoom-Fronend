"use client";

/**
 * components/notifications/PushNotificationHost.tsx — listens for foreground
 * FCM messages and replays the shopkeeper's full animated design in-app,
 * since native OS notifications can't run Framer Motion. Mounted once in the
 * customer layout so it's present on every customer route.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onMessage } from "firebase/messaging";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { getMessagingIfSupported } from "@/lib/firebaseMessaging";
import { getSendDesign } from "@/features/push/pushApi";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import DesignPreview from "./DesignPreview";
import type { NotificationDesign, RenderContext } from "@/features/notifications/types";

const DEFAULT_AUTO_DISMISS_MS = 4000;
const AUTO_DISMISS_BUFFER_MS = 1000;

interface IncomingPush {
  design: NotificationDesign;
  context: RenderContext;
  roomId: string;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PushNotificationHost() {
  const router = useRouter();
  const [incoming, setIncoming] = useState<IncomingPush | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getMessagingIfSupported().then((messaging) => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        const sendId = payload.data?.sendId;
        if (!sendId) return;

        getSendDesign(sendId)
          .then((result) => {
            setIncoming({
              design: result.designJson,
              roomId: result.roomId,
              context: {
                ...EDITOR_CONTEXT,
                shop: { ...EDITOR_CONTEXT.shop, ...result.context.shop },
                customer: { ...EDITOR_CONTEXT.customer, ...result.context.customer },
              },
            });
          })
          .catch(() => {
            // A push referencing a send the customer can no longer see
            // (e.g. left the room) — silently drop it.
          });
      });
    });

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (!incoming) return;
    const durationMs = incoming.design.timeline?.durationMs ?? DEFAULT_AUTO_DISMISS_MS;
    const timer = setTimeout(() => setIncoming(null), durationMs + AUTO_DISMISS_BUFFER_MS);
    return () => clearTimeout(timer);
  }, [incoming]);

  // Escape dismisses, matching the close button — keyboard parity for a
  // popup that otherwise has no modal focus trap (it never blocks the page).
  useEffect(() => {
    if (!incoming) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIncoming(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [incoming]);

  if (!incoming) return null;

  function openRoom() {
    if (incoming) router.push(`/customer/room/${incoming.roomId}`);
    setIncoming(null);
  }

  return (
    <div
      role="dialog"
      aria-label="New notification"
      className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-lg overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setIncoming(null)}
        aria-label="Dismiss notification"
        className="absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-(--color-bg-surface) border-0 cursor-pointer hover:bg-(--color-bg-surface-hover)"
      >
        <CloseOutlinedIcon sx={{ fontSize: 16 }} />
      </button>
      <div
        role="button"
        tabIndex={0}
        aria-label="Open this notification's room"
        onClick={openRoom}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openRoom();
          }
        }}
        className="cursor-pointer"
      >
        <DesignPreview design={incoming.design} context={incoming.context} isPlaying={!prefersReducedMotion()} />
      </div>
    </div>
  );
}
