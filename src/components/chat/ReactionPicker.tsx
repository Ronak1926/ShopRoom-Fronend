"use client";

import { useEffect, useRef } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  align?: "left" | "right";
}

/** Thin wrapper around the emoji-picker-react popover — a full WhatsApp-style
 * picker (categories + search), not a fixed quick-react set. */
export default function ReactionPicker({
  onSelect,
  onClose,
  align = "left",
}: ReactionPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute z-30 top-full mt-1 ${align === "right" ? "right-0" : "left-0"}`}
    >
      <EmojiPicker
        onEmojiClick={(data: EmojiClickData) => {
          onSelect(data.emoji);
          onClose();
        }}
        autoFocusSearch={false}
        width={320}
        height={380}
      />
    </div>
  );
}
