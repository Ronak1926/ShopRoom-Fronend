"use client";

import { useState, type KeyboardEvent } from "react";

interface EditableMessageTextProps {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

/** Inline edit mode for a bubble's own text — local to the bubble, no
 * coupling to the composer (which stays purely for composing new messages). */
export default function EditableMessageText({
  initialText,
  onSave,
  onCancel,
}: EditableMessageTextProps) {
  const [text, setText] = useState(initialText);

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="w-full resize-none rounded-lg border border-(--color-border-default) bg-(--color-bg-page) px-2.5 py-1.5 text-sm text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
      />
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-7 px-3 rounded-lg text-[12px] font-semibold text-(--color-text-secondary) bg-transparent border-0 cursor-pointer hover:bg-(--color-bg-surface-hover)"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!text.trim()}
          className="h-7 px-3 rounded-lg text-[12px] font-semibold text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) disabled:opacity-40 disabled:cursor-not-allowed border-0 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
