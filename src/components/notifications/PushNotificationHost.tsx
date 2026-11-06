"use client";

/**
 * components/notifications/PushNotificationHost.tsx — listens for foreground
 * FCM messages and replays the shopkeeper's full animated design in-app,
 * since native OS notifications can't run Framer Motion. Mounted once in the
 * customer layout so it's present on every customer route.
 *
 * The same banner also plays when the customer TAPS the notification in the OS
 * tray: the service worker opens the room with a "#push=" fragment (see
 * features/push/tapLink.ts) and this host replays that push's design.
 *
 * It also tells the server what happened to each push (delivered, opened,
 * clicked) so the shopkeeper's analytics are real.
 */

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { getMessagingIfSupported } from "@/lib/firebaseMessaging";
import { loadMessagingSdk, PUSH_ENABLED_EVENT } from "@/features/push/pushEvents";
import { getSendDesign, reportReceipt, type SendDesignResponse } from "@/features/push/pushApi";
import { parseTapHash, REPLAY_PUSH_EVENT, type TapReference } from "@/features/push/tapLink";
import { getCookie } from "@/utils/cookieUtils";
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

function toIncoming(result: SendDesignResponse, receiptToken: string | undefined): IncomingPush {
  return {
    design: result.designJson,
    roomId: result.roomId,
    receiptToken,
    context: {
      ...EDITOR_CONTEXT,
      shop: { ...EDITOR_CONTEXT.shop, ...result.context.shop },
      customer: { ...EDITOR_CONTEXT.customer, ...result.context.customer },
    },
  };
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PushNotificationHost() {
  const router = useRouter();
  const [incoming, setIncoming] = useState<IncomingPush | null>(null);

  // A push can only arrive in this tab if notifications are allowed, so the Firebase SDK is only
  // fetched then (or the moment the person turns them on), not for every visitor to a customer page.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let stopped = false;

    async function startListening() {
      if (unsubscribe) return;
      const [messaging, { onMessage }] = await Promise.all([getMessagingIfSupported(), loadMessagingSdk()]);
      if (stopped || unsubscribe || !messaging) return;
      void loadDesignPreview();
      unsubscribe = onMessage(messaging, (payload) => {
        const sendId = payload.data?.sendId;
        const receiptToken = payload.data?.rt;
        if (!sendId) return;

        reportReceipt(receiptToken, "DELIVERED");
        getSendDesign(sendId)
          .then((result) => {
            setIncoming(toIncoming(result, receiptToken));
            reportReceipt(receiptToken, "OPENED");
          })
          .catch(() => {
            // A push referencing a send the customer can no longer see
            // (e.g. left the room) — silently drop it.
          });
      });
    }

    if (typeof Notification !== "undefined" && Notification.permission === "granted") void startListening();
    window.addEventListener(PUSH_ENABLED_EVENT, startListening);

    return () => {
      stopped = true;
      window.removeEventListener(PUSH_ENABLED_EVENT, startListening);
      unsubscribe?.();
    };
  }, []);

  /** Plays a past push's animated design. `reportOpen` is for taps that the service worker did not already record. */
  const replay = useCallback((tapped: TapReference, reportOpen: boolean) => {
    const sessionToken = getCookie("token");
    if (!sessionToken) return;
    void loadDesignPreview();
    getSendDesign(tapped.sendId, sessionToken)
      .then((result) => {
        setIncoming(toIncoming(result, tapped.receiptToken));
        if (reportOpen) reportReceipt(tapped.receiptToken, "OPENED");
      })
      .catch(() => {
        // A push the customer can no longer see (left the room, deleted) — nothing to show.
      });
  }, []);

  // Tapped from the OS notification tray: replay that push's animated design. The
  // service worker has already recorded OPENED, so it is not reported again here.
  useEffect(() => {
    function replayTappedPush() {
      const tapped = parseTapHash(window.location.hash);
      if (!tapped) return;
      // Remove the reference at once so a refresh, or a copied link, replays nothing
      // (and the receipt token does not linger in the address bar or history). The state
      // argument must be null: Next wraps history.replaceState and only syncs its router
      // to the new URL for calls like this one. Passing the existing history state back
      // (Next's own object) skips that sync, and the router later writes the fragment back.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      replay(tapped, false);
    }
    replayTappedPush();
    // A tap while this tab is already on the same room changes only the fragment.
    window.addEventListener("hashchange", replayTappedPush);
    return () => window.removeEventListener("hashchange", replayTappedPush);
  }, [replay]);

  // Opened from inside the app (the notification bell): the open still has to be recorded.
  useEffect(() => {
    function onReplayRequest(e: Event) {
      replay((e as CustomEvent<TapReference>).detail, true);
    }
    window.addEventListener(REPLAY_PUSH_EVENT, onReplayRequest);
    return () => window.removeEventListener(REPLAY_PUSH_EVENT, onReplayRequest);
  }, [replay]);

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
      } else if (route.path !== window.location.pathname) {
        // Already on that page (typical after tapping a notification, which opens the
        // room): nothing to navigate to. Pushing the current path would also make Next
        // re-apply the "#push=" fragment it still remembers from the tap.
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
