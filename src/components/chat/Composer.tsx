"use client";

import { useState, type ReactNode, type KeyboardEvent } from "react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ReplyPreview from "./ReplyPreview";
import type { ChatMessage } from "@/hooks/useRoomChat";

interface ComposerProps {
  onSend: (text: string, replyToId?: string) => void;
  onTyping: () => void;
  placeholder?: string;
  extraAction?: ReactNode;
  replyingTo?: ChatMessage | null;
  onCancelReply?: () => void;
}

export default function Composer({
  onSend,
  onTyping,
  placeholder = "Type a message...",
  extraAction,
  replyingTo,
  onCancelReply,
}: ComposerProps) {
  const [text, setText] = useState("");

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed, replyingTo?.id);
    setText("");
    onCancelReply?.();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="bg-(--color-bg-surface) border-t border-(--color-border-default) px-4 py-3 shrink-0">
      {replyingTo && (
        <div className="mb-2">
          <ReplyPreview
            senderName={replyingTo.sender.shopName ?? replyingTo.sender.name}
            text={replyingTo.deletedForEveryone ? "" : replyingTo.text}
            deletedForEveryone={replyingTo.deletedForEveryone}
            onCancel={onCancelReply}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) hover:text-(--color-text-primary) transition-colors shrink-0">
          <EmojiEmotionsOutlinedIcon sx={{ fontSize: 20 }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border-0 bg-transparent cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) hover:text-(--color-text-primary) transition-colors shrink-0">
          <AttachFileOutlinedIcon
            sx={{ fontSize: 20, transform: "rotate(45deg)" }}
          />
        </button>

        <div className="flex-1 flex flex-col gap-0.5">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-10 bg-(--color-bg-page) border border-(--color-border-default) rounded-xl px-4 text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) outline-none focus:border-(--color-brand-primary) transition-colors"
          />
        </div>

        {extraAction}

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-9 h-9 rounded-full bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) disabled:opacity-40 disabled:cursor-not-allowed text-white border-0 cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-0.5"
        >
          <SendOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
}
