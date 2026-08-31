"use client";

import { useEffect } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { AUDIENCE_LABELS, usesRadius, type AudienceMode } from "../_schemas/sendNotification";

interface Props {
  name: string;
  mode: AudienceMode;
  radiusKm: number;
  sending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Shown when "Confirm before sending" is on in Preferences. */
export default function SendConfirmDialog({
  name,
  mode,
  radiusKm,
  sending,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm send"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-(--color-bg-overlay)"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-(--color-bg-surface) shadow-(--shadow-lg) p-5"
      >
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Send this now?</h2>
        <p className="mt-2 text-[12.5px] leading-relaxed text-(--color-text-secondary)">
          <span className="font-semibold text-(--color-text-primary)">{name}</span> goes out to{" "}
          {AUDIENCE_LABELS[mode].toLowerCase()}
          {usesRadius(mode) ? ` within ${radiusKm} km of your shop` : ""}. This cannot be undone.
        </p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className="h-9 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={sending}
            className="flex items-center gap-1.5 h-9 px-5 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendOutlinedIcon sx={{ fontSize: 15 }} />
            {sending ? "Sending…" : "Send Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
