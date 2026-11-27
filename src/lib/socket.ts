"use client";

import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/constants/api";
import { TOKEN_MODE, readSessionToken } from "@/utils/sessionMode";

export type Role = "customer" | "shopkeeper";

const sockets: Partial<Record<Role, Socket>> = {};

/**
 * Singleton Socket.IO connection per role. The session is the HttpOnly cookie the browser already holds for
 * the API (`withCredentials` sends it with the handshake), so there is no token for the page to read or pass:
 * only the role is stated, so the API knows which of the two session cookies to check. In token mode
 * (utils/sessionMode.ts) there is no cookie, so the stored token is passed instead; it is read on every
 * (re)connect, so signing in as someone else is picked up.
 */
export function getSocket(role: Role): Socket {
  const existing = sockets[role];
  if (existing) return existing;

  const socket = io(API_BASE_URL, {
    auth: (send) => {
      const token = TOKEN_MODE ? readSessionToken(role) : null;
      send(token ? { role, token } : { role });
    },
    withCredentials: !TOKEN_MODE,
    transports: ["websocket", "polling"],
  });
  sockets[role] = socket;
  return socket;
}

export function disconnectSocket(role: Role): void {
  sockets[role]?.disconnect();
  delete sockets[role];
}
