"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket, type Role } from "@/lib/socket";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderType: "CUSTOMER" | "SHOPKEEPER";
  text: string;
  createdAt: string;
  sender: { id: string; name: string; shopName?: string };
}

export interface TypingUser {
  userId: string;
  name: string;
}

const TYPING_IDLE_MS = 1200;
const TYPING_SAFETY_TIMEOUT_MS = 3000;
const COOKIE_BY_ROLE: Record<Role, string> = {
  customer: "token",
  shopkeeper: "shopkeeper_token",
};

/**
 * Shared real-time chat state for a room — used by both the shopkeeper's
 * MyRoom view and the customer room chat page so socket plumbing (join/leave,
 * message list, typing, presence) is implemented exactly once.
 */
export function useRoomChat(roomId: string | undefined, role: Role) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineCustomerIds, setOnlineCustomerIds] = useState<string[]>([]);
  // Derived rather than an imperative flag, so there's no synchronous
  // setState at the top of the fetch effect — loading is simply "history for
  // this roomId hasn't resolved yet".
  const [loadedRoomId, setLoadedRoomId] = useState<string | undefined>(undefined);
  const loading = roomId !== undefined && loadedRoomId !== roomId;

  const typingTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const isTypingRef = useRef(false);
  const typingIdleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load initial history ────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    const token = getCookie(COOKIE_BY_ROLE[role]);
    if (token) setAuthToken(token);

    apiClient
      .get<{ messages: ChatMessage[] }>(`/api/rooms/${roomId}/messages`, {
        params: { page: 0, limit: 50 },
      })
      .then((res) => {
        if (cancelled) return;
        setMessages(res.data.messages);
        setLoadedRoomId(roomId);
      })
      .catch(() => {
        if (!cancelled) setLoadedRoomId(roomId);
      });

    return () => {
      cancelled = true;
    };
  }, [roomId, role]);

  // ── Socket lifecycle: join/leave + live event listeners ────────────────────
  useEffect(() => {
    if (!roomId) return;
    const socket = getSocket(role);
    // Captured once per effect run so the cleanup below always clears the
    // exact same Map instance it was scheduling timeouts into.
    const typingTimeoutMap = typingTimeouts.current;

    function handleNewMessage(message: ChatMessage) {
      if (message.roomId !== roomId) return;
      setMessages((prev) => [...prev, message]);
      setTypingUsers((prev) => prev.filter((u) => u.userId !== message.sender.id));
    }

    function handlePresence(payload: {
      roomId: string;
      onlineCustomerIds: string[];
    }) {
      if (payload.roomId !== roomId) return;
      setOnlineCustomerIds(payload.onlineCustomerIds);
    }

    function handleTyping(payload: {
      roomId: string;
      userId: string;
      name: string;
      isTyping: boolean;
    }) {
      if (payload.roomId !== roomId) return;

      const existing = typingTimeoutMap.get(payload.userId);
      if (existing) clearTimeout(existing);

      if (payload.isTyping) {
        setTypingUsers((prev) =>
          prev.some((u) => u.userId === payload.userId)
            ? prev
            : [...prev, { userId: payload.userId, name: payload.name }],
        );
        // Safety net in case a "stop" event is dropped (e.g. tab closed).
        const timeout = setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((u) => u.userId !== payload.userId),
          );
        }, TYPING_SAFETY_TIMEOUT_MS);
        typingTimeoutMap.set(payload.userId, timeout);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== payload.userId));
      }
    }

    socket.on("message:new", handleNewMessage);
    socket.on("presence:update", handlePresence);
    socket.on("typing:update", handleTyping);
    socket.emit("room:join", { roomId });

    return () => {
      socket.emit("room:leave", { roomId });
      socket.off("message:new", handleNewMessage);
      socket.off("presence:update", handlePresence);
      socket.off("typing:update", handleTyping);

      typingTimeoutMap.forEach((t) => clearTimeout(t));
      typingTimeoutMap.clear();
      if (typingIdleTimeout.current) clearTimeout(typingIdleTimeout.current);
      isTypingRef.current = false;
    };
  }, [roomId, role]);

  const stopTypingNow = useCallback(() => {
    if (!roomId || !isTypingRef.current) return;
    isTypingRef.current = false;
    getSocket(role).emit("typing:stop", { roomId });
  }, [roomId, role]);

  /** Call on every composer keystroke — emits "typing:start" once, then
   * auto-emits "typing:stop" after a short idle period with no further calls. */
  const notifyTyping = useCallback(() => {
    if (!roomId) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      getSocket(role).emit("typing:start", { roomId });
    }
    if (typingIdleTimeout.current) clearTimeout(typingIdleTimeout.current);
    typingIdleTimeout.current = setTimeout(stopTypingNow, TYPING_IDLE_MS);
  }, [roomId, role, stopTypingNow]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!roomId || !trimmed) return;
      getSocket(role).emit("message:send", { roomId, text: trimmed });
      if (typingIdleTimeout.current) clearTimeout(typingIdleTimeout.current);
      stopTypingNow();
    },
    [roomId, role, stopTypingNow],
  );

  return {
    messages,
    typingUsers,
    onlineCustomerIds,
    loading,
    sendMessage,
    notifyTyping,
  };
}
