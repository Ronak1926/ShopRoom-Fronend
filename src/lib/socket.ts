"use client";

import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/constants/api";
import { getCookie } from "@/utils/cookieUtils";

export type Role = "customer" | "shopkeeper";

const COOKIE_BY_ROLE: Record<Role, string> = {
  customer: "token",
  shopkeeper: "shopkeeper_token",
};

const sockets: Partial<Record<Role, Socket>> = {};

/**
 * Singleton Socket.IO connection per role, reusing the same bearer-token
 * cookie apiClient already reads (see src/utils/apiClient.ts) — passed via
 * the handshake `auth` payload since the backend has no HttpOnly session
 * cookie to read automatically.
 */
export function getSocket(role: Role): Socket {
  const existing = sockets[role];
  if (existing) return existing;

  const token = getCookie(COOKIE_BY_ROLE[role]);
  const socket = io(API_BASE_URL, {
    auth: { token, role },
    transports: ["websocket", "polling"],
  });
  sockets[role] = socket;
  return socket;
}

export function disconnectSocket(role: Role): void {
  sockets[role]?.disconnect();
  delete sockets[role];
}
