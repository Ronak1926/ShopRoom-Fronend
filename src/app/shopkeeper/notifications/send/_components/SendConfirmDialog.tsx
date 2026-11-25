"use client";

import { useEffect } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { SAMPLE_PHOTO_WARNING } from "@/features/notifications/sampleContent";
import { AUDIENCE_LABELS, usesRadius, type AudienceMode } from "../_schemas/sendNotification";

interface Props {
  name: string;
  mode: AudienceMode;
  radiusKm: number;
  /** The banner still shows a template's placeholder photo. */
  samplePhoto?: boolean;
  sending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Shown when "Confirm before sending" is on in Preferences, and always when the banner still has a sample photo. */
export default function SendConfirmDialog({
  name,
  mode,
  radiusKm,
  samplePhoto = false,
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

        {samplePhoto && (
          <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-(--color-brand-alert-light) px-3 py-2.5 text-[12px] leading-relaxed text-(--color-brand-alert-text)">
            <WarningAmberOutlinedIcon sx={{ fontSize: 16 }} className="mt-0.5 shrink-0" />
            {SAMPLE_PHOTO_WARNING}
          </p>
        )}

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
            {sending ? "Sending…" : samplePhoto ? "Send anyway" : "Send Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
