"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { ChatMessage, TypingUser } from "@/hooks/useRoomChat";

interface MessageFeedProps {
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  loading: boolean;
  isOwnMessage: (message: ChatMessage) => boolean;
  currentViewerId: string | null;
  seenIneligibleIds: Set<string>;
  onReply: (message: ChatMessage) => void;
  onEdit: (messageId: string, text: string) => void;
  onDelete: (messageId: string, scope: "everyone" | "me") => void;
  onReact: (messageId: string, emoji: string) => void;
  emptyHint?: string;
}

const HIGHLIGHT_DURATION_MS = 1500;

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.toDateString() === b.toDateString();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export default function MessageFeed({
  messages,
  typingUsers,
  loading,
  isOwnMessage,
  currentViewerId,
  seenIneligibleIds,
  onReply,
  onEdit,
  onDelete,
  onReact,
  emptyHint = "No messages yet — say hello!",
}: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typingUsers.length]);

  useEffect(() => {
    return () => {
      if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    };
  }, []);

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current.set(id, el);
    else messageRefs.current.delete(id);
  }, []);

  // The WhatsApp "jump to and flash the original" behavior — only works for
  // messages already loaded client-side (there's no load-more/pagination UI
  // yet, so this covers the common case of replying within recent history).
  const handleReplyPreviewClick = useCallback((messageId: string) => {
    const el = messageRefs.current.get(messageId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(messageId);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(
      () => setHighlightedId((cur) => (cur === messageId ? null : cur)),
      HIGHLIGHT_DURATION_MS,
    );
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 bg-(--color-gray-100)">
      {loading && (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-hint)">
          Loading conversation...
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-hint)">
          {emptyHint}
        </div>
      )}

      {!loading &&
        messages.map((message, i) => {
          const prev = messages[i - 1];
          const showSeparator = !prev || dayLabel(prev.createdAt) !== dayLabel(message.createdAt);
          return (
            <div key={message.id} className="flex flex-col gap-4">
              {showSeparator && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-(--color-border-default)" />
                  <span className="text-xs text-(--color-text-hint) whitespace-nowrap">
                    {dayLabel(message.createdAt)}
                  </span>
                  <div className="flex-1 h-px bg-(--color-border-default)" />
                </div>
              )}
              <MessageBubble
                message={message}
                isOwnMessage={isOwnMessage(message)}
                currentViewerId={currentViewerId}
                seenIneligible={seenIneligibleIds.has(message.id)}
                highlighted={highlightedId === message.id}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReact={onReact}
                onReplyPreviewClick={handleReplyPreviewClick}
                registerRef={registerRef}
              />
            </div>
          );
        })}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={bottomRef} />
    </div>
  );
}
