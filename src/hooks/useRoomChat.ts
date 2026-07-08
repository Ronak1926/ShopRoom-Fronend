"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket, type Role } from "@/lib/socket";
import { apiClient, setAuthToken } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export interface ReplyPreviewData {
  id: string;
  text: string;
  senderName: string;
  deletedForEveryone: boolean;
}

export interface MessageReactionData {
  emoji: string;
  viewerId: string;
  viewerName: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderType: "CUSTOMER" | "SHOPKEEPER";
  text: string;
  createdAt: string;
  editedAt: string | null;
  deletedForEveryone: boolean;
  sender: { id: string; name: string; shopName?: string };
  replyTo: ReplyPreviewData | null;
  reactions: MessageReactionData[];
}

export interface TypingUser {
  userId: string;
  name: string;
}

const TYPING_IDLE_MS = 1200;
const TYPING_SAFETY_TIMEOUT_MS = 3000;
const READ_DEBOUNCE_MS = 800;
const COOKIE_BY_ROLE: Record<Role, string> = {
  customer: "token",
  shopkeeper: "shopkeeper_token",
};

/**
 * Shared real-time chat state for a room — used by both the shopkeeper's
 * MyRoom view and the customer room chat page so socket plumbing (join/leave,
 * message list, typing, presence, and the WhatsApp-style message actions)
 * is implemented exactly once.
 */
export function useRoomChat(roomId: string | undefined, role: Role) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineCustomerIds, setOnlineCustomerIds] = useState<string[]>([]);
  // Own message IDs the server has told us are no longer editable/deletable
  // because another participant has now read them — drives the live-hide
  // behavior for the Edit / Delete-for-everyone menu items.
  const [seenIneligibleIds, setSeenIneligibleIds] = useState<Set<string>>(new Set());
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
  const readDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

  // ── Mark-as-read: debounced, and only while the tab is actually visible ────
  const markReadNow = useCallback(() => {
    if (!roomId) return;
    if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
    const last = messagesRef.current[messagesRef.current.length - 1];
    if (!last) return;
    getSocket(role).emit("room:read", { roomId, at: last.createdAt });
  }, [roomId, role]);

  const scheduleMarkRead = useCallback(() => {
    if (readDebounce.current) clearTimeout(readDebounce.current);
    readDebounce.current = setTimeout(markReadNow, READ_DEBOUNCE_MS);
  }, [markReadNow]);

  useEffect(() => {
    if (!roomId || messages.length === 0) return;
    scheduleMarkRead();
  }, [roomId, messages.length, scheduleMarkRead]);

  useEffect(() => {
    if (!roomId || typeof document === "undefined") return;
    function handleVisibility() {
      if (document.visibilityState === "visible") scheduleMarkRead();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [roomId, scheduleMarkRead]);

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

    function handleUpdated(message: ChatMessage) {
      if (message.roomId !== roomId) return;
      setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)));
    }

    function handleDeleted(payload: { roomId: string; messageId: string }) {
      if (payload.roomId !== roomId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === payload.messageId
            ? { ...m, deletedForEveryone: true, text: "", reactions: [] }
            : m,
        ),
      );
    }

    function handleRemoved(payload: { roomId: string; messageId: string }) {
      if (payload.roomId !== roomId) return;
      setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
    }

    function handleReacted(payload: {
      roomId: string;
      messageId: string;
      reactions: MessageReactionData[];
    }) {
      if (payload.roomId !== roomId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m,
        ),
      );
    }

    function handleSeen(payload: { roomId: string; messageIds: string[] }) {
      if (payload.roomId !== roomId || payload.messageIds.length === 0) return;
      setSeenIneligibleIds((prev) => {
        const next = new Set(prev);
        payload.messageIds.forEach((id) => next.add(id));
        return next;
      });
    }

    function handleCleared(payload: { roomId: string; clearedAt: string }) {
      if (payload.roomId !== roomId) return;
      const clearedAtMs = new Date(payload.clearedAt).getTime();
      setMessages((prev) =>
        prev.filter((m) => new Date(m.createdAt).getTime() > clearedAtMs),
      );
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
    socket.on("message:updated", handleUpdated);
    socket.on("message:deleted", handleDeleted);
    socket.on("message:removed", handleRemoved);
    socket.on("message:reacted", handleReacted);
    socket.on("message:seen", handleSeen);
    socket.on("chat:cleared", handleCleared);
    socket.on("presence:update", handlePresence);
    socket.on("typing:update", handleTyping);
    socket.emit("room:join", { roomId });

    return () => {
      socket.emit("room:leave", { roomId });
      socket.off("message:new", handleNewMessage);
      socket.off("message:updated", handleUpdated);
      socket.off("message:deleted", handleDeleted);
      socket.off("message:removed", handleRemoved);
      socket.off("message:reacted", handleReacted);
      socket.off("message:seen", handleSeen);
      socket.off("chat:cleared", handleCleared);
      socket.off("presence:update", handlePresence);
      socket.off("typing:update", handleTyping);

      typingTimeoutMap.forEach((t) => clearTimeout(t));
      typingTimeoutMap.clear();
      if (typingIdleTimeout.current) clearTimeout(typingIdleTimeout.current);
      if (readDebounce.current) clearTimeout(readDebounce.current);
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
    (text: string, replyToId?: string) => {
      const trimmed = text.trim();
      if (!roomId || !trimmed) return;
      getSocket(role).emit("message:send", { roomId, text: trimmed, replyToId });
      if (typingIdleTimeout.current) clearTimeout(typingIdleTimeout.current);
      stopTypingNow();
    },
    [roomId, role, stopTypingNow],
  );

  const editMessage = useCallback(
    (messageId: string, text: string) => {
      const trimmed = text.trim();
      if (!roomId || !trimmed) return;
      getSocket(role).emit("message:edit", { roomId, messageId, text: trimmed });
    },
    [roomId, role],
  );

  const deleteMessage = useCallback(
    (messageId: string, scope: "everyone" | "me") => {
      if (!roomId) return;
      getSocket(role).emit("message:delete", { roomId, messageId, scope });
    },
    [roomId, role],
  );

  const reactToMessage = useCallback(
    (messageId: string, emoji: string) => {
      if (!roomId) return;
      getSocket(role).emit("message:react", { roomId, messageId, emoji });
    },
    [roomId, role],
  );

  const clearChat = useCallback(() => {
    if (!roomId) return;
    getSocket(role).emit("chat:clear", { roomId });
  }, [roomId, role]);

  return {
    messages,
    typingUsers,
    onlineCustomerIds,
    seenIneligibleIds,
    loading,
    sendMessage,
    notifyTyping,
    editMessage,
    deleteMessage,
    reactToMessage,
    clearChat,
  };
}
