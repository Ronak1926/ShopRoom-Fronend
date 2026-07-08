"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import ReplyPreview from "./ReplyPreview";
import MessageActions from "./MessageActions";
import MessageReactions from "./MessageReactions";
import EditableMessageText from "./EditableMessageText";
import type { ChatMessage } from "@/hooks/useRoomChat";

/** Mirrors the server's EDIT_DELETE_WINDOW_MS in message.service.ts — used
 * only to hide the affordance client-side; the server re-checks regardless. */
const EDIT_DELETE_WINDOW_MS = 60 * 60 * 1000;

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  currentViewerId: string | null;
  /** True once the server has told us someone else has read this message —
   * the live-hide push for Edit / Delete-for-everyone. */
  seenIneligible: boolean;
  highlighted: boolean;
  onReply: (message: ChatMessage) => void;
  onEdit: (messageId: string, text: string) => void;
  onDelete: (messageId: string, scope: "everyone" | "me") => void;
  onReact: (messageId: string, emoji: string) => void;
  onReplyPreviewClick: (messageId: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageBubble({
  message,
  isOwnMessage,
  currentViewerId,
  seenIneligible,
  highlighted,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onReplyPreviewClick,
  registerRef,
}: MessageBubbleProps) {
  const isAdmin = message.senderType === "SHOPKEEPER";
  const avatarName = isAdmin ? (message.sender.shopName ?? message.sender.name) : message.sender.name;
  const avatarSize = isAdmin ? "md" : "sm";

  const [isEditing, setIsEditing] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [withinEditWindow, setWithinEditWindow] = useState(
    () => Date.now() - new Date(message.createdAt).getTime() < EDIT_DELETE_WINDOW_MS,
  );

  // The 1h window closes on its own even with no server push — "seen" is
  // the other, independent gate, pushed live via seenIneligible.
  useEffect(() => {
    if (!isOwnMessage || !withinEditWindow) return;
    const remaining =
      new Date(message.createdAt).getTime() + EDIT_DELETE_WINDOW_MS - Date.now();
    const timeout = setTimeout(() => setWithinEditWindow(false), Math.max(remaining, 0));
    return () => clearTimeout(timeout);
  }, [isOwnMessage, withinEditWindow, message.createdAt]);

  const canModify = isOwnMessage && withinEditWindow && !seenIneligible;

  // Your own message is always the solid blue bubble, whichever role you are.
  // Every *received* message — an admin's or another customer's — gets the
  // same white bubble + blue left accent strip, so a shopkeeper looking at a
  // customer's message reads as consistently "intentional" as a customer
  // looking at the shop's message, not a different, unstyled default.
  const bubbleClass = isOwnMessage
    ? "bg-(--color-brand-primary) text-white"
    : "bg-(--color-bg-surface) text-(--color-text-primary) shadow-(--shadow-sm)";

  const accentBorder = !isOwnMessage
    ? { borderLeft: "3px solid var(--color-brand-primary)" }
    : undefined;

  function handleCopy() {
    if (message.deletedForEveryone) return;
    navigator.clipboard.writeText(message.text).catch(() => {});
  }

  return (
    <div
      ref={(el) => registerRef(message.id, el)}
      className={`flex items-end gap-2 rounded-lg transition-colors duration-700 ${
        isOwnMessage ? "justify-end" : "justify-start"
      } ${highlighted ? "bg-(--color-brand-primary-light)" : ""}`}
    >
      {!isOwnMessage && <Avatar name={avatarName} size={avatarSize} className="mb-1" />}

      <div
        className={`group relative flex flex-col gap-1 max-w-sm ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
        onClick={() => setMobileActionsOpen((v) => !v)}
      >
        <MessageActions
          isOwnMessage={isOwnMessage}
          deletedForEveryone={message.deletedForEveryone}
          canModify={canModify}
          forceVisible={mobileActionsOpen}
          onReply={() => onReply(message)}
          onReact={(emoji) => onReact(message.id, emoji)}
          onCopy={handleCopy}
          onEdit={() => setIsEditing(true)}
          onDeleteForMe={() => onDelete(message.id, "me")}
          onDeleteForEveryone={() => onDelete(message.id, "everyone")}
        />

        {(isAdmin || !isOwnMessage) && !message.deletedForEveryone && (
          <div className="flex items-baseline gap-2 px-1 flex-wrap">
            {isAdmin ? (
              <>
                <span className="text-[13px] font-bold text-(--color-brand-primary)">
                  {message.sender.shopName}
                </span>
                <span className="text-[11px] text-(--color-text-secondary)">
                  {message.sender.name}
                </span>
              </>
            ) : (
              <span className="text-[11px] text-(--color-text-hint)">{message.sender.name}</span>
            )}
          </div>
        )}

        <div
          className={`${bubbleClass} rounded-xl px-4 py-2.5 ${
            isOwnMessage ? "rounded-tr-none" : "rounded-tl-none"
          } ${message.deletedForEveryone ? "italic opacity-70" : ""}`}
          style={message.deletedForEveryone ? undefined : accentBorder}
        >
          {message.deletedForEveryone ? (
            <p className="text-sm leading-relaxed m-0">This message was deleted</p>
          ) : isEditing ? (
            <div onClick={(e) => e.stopPropagation()}>
              <EditableMessageText
                initialText={message.text}
                onSave={(text) => {
                  onEdit(message.id, text);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              {message.replyTo && (
                <div className="mb-1.5" onClick={(e) => e.stopPropagation()}>
                  <ReplyPreview
                    senderName={message.replyTo.senderName}
                    text={message.replyTo.text}
                    deletedForEveryone={message.replyTo.deletedForEveryone}
                    onClick={() => onReplyPreviewClick(message.replyTo!.id)}
                  />
                </div>
              )}
              <p className="text-sm leading-relaxed m-0 whitespace-pre-wrap wrap-break-word">
                {message.text}
              </p>
              <div className={`flex items-center gap-1.5 mt-1 ${isOwnMessage ? "justify-end" : ""}`}>
                {message.editedAt && (
                  <span
                    className={`text-[10px] ${
                      isOwnMessage ? "text-white/60" : "text-(--color-text-hint)"
                    }`}
                  >
                    (edited)
                  </span>
                )}
                <span
                  className={`text-[11px] ${
                    isOwnMessage ? "text-white/70" : "text-(--color-text-hint)"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </>
          )}
        </div>

        {!message.deletedForEveryone && message.reactions.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <MessageReactions
              reactions={message.reactions}
              currentViewerId={currentViewerId}
              onToggle={(emoji) => onReact(message.id, emoji)}
            />
          </div>
        )}
      </div>

      {isOwnMessage && <Avatar name={avatarName} size={avatarSize} className="mb-1" />}
    </div>
  );
}
