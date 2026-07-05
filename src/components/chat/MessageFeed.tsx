"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { ChatMessage, TypingUser } from "@/hooks/useRoomChat";

interface MessageFeedProps {
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  loading: boolean;
  isOwnMessage: (message: ChatMessage) => boolean;
  emptyHint?: string;
}

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
  emptyHint = "No messages yet — say hello!",
}: MessageFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typingUsers.length]);

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
              <MessageBubble message={message} isOwnMessage={isOwnMessage(message)} />
            </div>
          );
        })}

      <TypingIndicator typingUsers={typingUsers} />
      <div ref={bottomRef} />
    </div>
  );
}
