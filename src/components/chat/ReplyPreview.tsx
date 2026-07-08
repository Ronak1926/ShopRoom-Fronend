"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

interface ReplyPreviewProps {
  senderName: string;
  text: string;
  deletedForEveryone: boolean;
  /** Present inside a bubble that is itself a reply — clicking jumps to and
   * highlights the original message, like WhatsApp. */
  onClick?: () => void;
  /** Present inside the composer's "replying to" bar — cancels the reply. */
  onCancel?: () => void;
}

/** The compact quoted-message strip, reused both inside a reply bubble and
 * inside the composer while composing a reply. */
export default function ReplyPreview({
  senderName,
  text,
  deletedForEveryone,
  onClick,
  onCancel,
}: ReplyPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ borderLeft: "3px solid var(--color-brand-primary)" }}
      className={`flex items-start gap-2 rounded-lg bg-(--color-bg-surface-hover) px-3 py-1.5 text-left w-full border-y-0 border-r-0 ${
        onClick ? "cursor-pointer hover:bg-(--color-bg-page)" : "cursor-default"
      } transition-colors`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-(--color-brand-primary) truncate m-0">
          {senderName}
        </p>
        <p
          className={`text-[12px] truncate m-0 ${
            deletedForEveryone ? "italic text-(--color-text-hint)" : "text-(--color-text-secondary)"
          }`}
        >
          {deletedForEveryone ? "This message was deleted" : text}
        </p>
      </div>
      {onCancel && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full cursor-pointer text-(--color-text-hint) hover:text-(--color-text-primary)"
        >
          <CloseOutlinedIcon sx={{ fontSize: 14 }} />
        </span>
      )}
    </button>
  );
}
