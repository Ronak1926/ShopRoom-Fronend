"use client";

/**
 * components/customer/CustomerBackgroundSync.tsx — keeps two things about the
 * signed-in customer's device current without ever interrupting them:
 *   1. its push registration, so notifications follow whoever is signed in;
 *   2. its location, so shops can reach customers who are nearby.
 * Neither shows a permission prompt — both only act on permissions the
 * customer has already granted.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getCookie } from "@/utils/cookieUtils";
import { syncDeviceRegistration } from "@/features/push/pushDevice";
import { reportLocation } from "@/features/push/pushApi";

const LOCATION_KEY = "shoproom_location_reported_at";
/** Location is refreshed at most this often; the server treats it as live for 48 hours. */
const LOCATION_REFRESH_MS = 30 * 60 * 1000;

function lastReportedAt(): number {
  try {
    return Number(localStorage.getItem(LOCATION_KEY)) || 0;
  } catch {
    return 0;
  }
}

function rememberReport(): void {
  try {
    localStorage.setItem(LOCATION_KEY, String(Date.now()));
  } catch {
    // Private mode: the next page load simply reports again.
  }
}

async function locationAlreadyAllowed(): Promise<boolean> {
  if (!("geolocation" in navigator) || !("permissions" in navigator)) return false;
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return false;
  }
}

function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      maximumAge: 10 * 60 * 1000,
      timeout: 10_000,
    });
  });
}

export default function CustomerBackgroundSync() {
  const pathname = usePathname();
  // Remember which session was already synced so navigating doesn't repeat the calls.
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    // Re-evaluated on every route change so a sign-in made without a full
    // page load is picked up as soon as the customer lands somewhere new.
    // Not on the sign-out screen: a sync there could re-register the device
    // just after the customer unregistered it.
    if (pathname.startsWith("/customer/logout")) return;
    // The signed-in flag is unique to each sign-in, so a different account on the same tab is noticed.
    const session = getCookie("token");
    if (!session || syncedFor.current === session) return;
    syncedFor.current = session;

    // Best effort: both syncs improve delivery, neither is worth interrupting
    // the customer over, and the next page load tries again.
    syncDeviceRegistration().catch(() => {});

    if (Date.now() - lastReportedAt() < LOCATION_REFRESH_MS) return;
    locationAlreadyAllowed()
      .then((allowed) => (allowed ? currentPosition() : null))
      .then(async (position) => {
        if (!position) return;
        await reportLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        rememberReport();
      })
      .catch(() => {});
  }, [pathname]);

  return null;
}
