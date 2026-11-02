"use client";

/**
 * components/notifications/PushNotificationHost.tsx — listens for foreground
 * FCM messages and replays the shopkeeper's full animated design in-app,
 * since native OS notifications can't run Framer Motion. Mounted once in the
 * customer layout so it's present on every customer route.
 *
 * It also tells the server what happened to each push (delivered, opened,
 * clicked) so the shopkeeper's analytics are real.
 */

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { onMessage } from "firebase/messaging";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { getMessagingIfSupported } from "@/lib/firebaseMessaging";
import { getSendDesign, reportReceipt } from "@/features/push/pushApi";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import { defaultRoute, resolveActionRoute, type ActionRoute } from "@/features/notifications/actionRouter";
import type {
  ElementAction,
  NotificationDesign,
  RenderContext,
} from "@/features/notifications/types";

const DEFAULT_AUTO_DISMISS_MS = 4000;
const AUTO_DISMISS_BUFFER_MS = 1000;

interface IncomingPush {
  design: NotificationDesign;
  context: RenderContext;
  roomId: string;
  /** Identifies this device's copy of the push for delivery analytics. */
  receiptToken: string | undefined;
}

// The renderer, Framer Motion and the animation preset catalog are only needed once a
// push actually arrives, yet this host is mounted on every customer page. Loading them
// lazily keeps them out of every page's first load; the chunk is fetched in the
// background as soon as the listener is set up, so the banner still appears instantly.
const loadDesignPreview = () => import("./DesignPreview");
const DesignPreview = dynamic(loadDesignPreview, { ssr: false });

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
      void loadDesignPreview();
      unsubscribe = onMessage(messaging, (payload) => {
        const sendId = payload.data?.sendId;
        const receiptToken = payload.data?.rt;
        if (!sendId) return;

        reportReceipt(receiptToken, "DELIVERED");
        getSendDesign(sendId)
          .then((result) => {
            setIncoming({
              design: result.designJson,
              roomId: result.roomId,
              receiptToken,
              context: {
                ...EDITOR_CONTEXT,
                shop: { ...EDITOR_CONTEXT.shop, ...result.context.shop },
                customer: { ...EDITOR_CONTEXT.customer, ...result.context.customer },
              },
            });
            reportReceipt(receiptToken, "OPENED");
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

  const follow = useCallback(
    (route: ActionRoute | null) => {
      if (!incoming || !route) return;
      reportReceipt(incoming.receiptToken, "CLICKED");
      setIncoming(null);
      if (route.kind === "external") {
        window.open(route.url, "_blank", "noopener,noreferrer");
      } else {
        router.push(route.path);
      }
    },
    [incoming, router],
  );

  if (!incoming) return null;

  const openRoom = () => follow(defaultRoute(incoming.roomId));
  const onElementAction = (action: ElementAction) =>
    follow(resolveActionRoute(action, incoming.roomId));

  return (
    <div
      role="dialog"
      aria-label="New notification"
      className="fixed top-4 right-4 z-9999 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-lg overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setIncoming(null)}
        aria-label="Dismiss notification"
        className="absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-(--color-bg-surface) border-0 cursor-pointer hover:bg-(--color-bg-surface-hover)"
      >
        <CloseOutlinedIcon sx={{ fontSize: 16 }} />
      </button>
      {/* Tapping the banner itself opens the room; elements with their own
          action (buttons, links) handle their tap first and stop it here. The
          keyboard path to the same place is the explicit button below. */}
      <div onClick={openRoom} className="cursor-pointer">
        <DesignPreview
          design={incoming.design}
          context={incoming.context}
          isPlaying={!prefersReducedMotion()}
          onAction={onElementAction}
        />
      </div>
      <button
        type="button"
        onClick={openRoom}
        className="flex w-full items-center justify-between gap-2 px-3.5 h-10 border-0 border-t border-(--color-border-default) bg-(--color-bg-surface) text-[12px] font-semibold text-(--color-brand-primary) cursor-pointer hover:bg-(--color-bg-surface-hover)"
      >
        Open room
        <ArrowForwardOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
    </div>
  );
}
