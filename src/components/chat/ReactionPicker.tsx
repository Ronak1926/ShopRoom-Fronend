"use client";

import { useEffect, useRef } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  align?: "left" | "right";
  /** Which side of its anchor the popover opens on. The composer sits at the bottom, so it opens upward. */
  placement?: "below" | "above";
}

/** Thin wrapper around the emoji-picker-react popover — a full WhatsApp-style
 * picker (categories + search), not a fixed quick-react set. */
export default function ReactionPicker({
  onSelect,
  onClose,
  align = "left",
  placement = "below",
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
      className={`absolute z-30 ${placement === "above" ? "bottom-full mb-1" : "top-full mt-1"} ${align === "right" ? "right-0" : "left-0"}`}
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
