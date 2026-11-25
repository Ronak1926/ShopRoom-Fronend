"use client";

import { useSyncExternalStore } from "react";
import { getCookie } from "@/utils/cookieUtils";

export type AuthSession = "customer" | "shopkeeper" | "none";

const subscribe = () => () => {};

function snapshot(): AuthSession {
  if (getCookie("token")) return "customer";
  if (getCookie("shopkeeper_token")) return "shopkeeper";
  return "none";
}

/**
 * Who is signed in, read from the session cookies. `null` while server-rendering and
 * during hydration, so the first client render matches the server's.
 */
export function useAuthSession(): AuthSession | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
