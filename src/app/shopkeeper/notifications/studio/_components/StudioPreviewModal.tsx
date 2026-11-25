"use client";

import { useEffect, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { NotificationDesign } from "@/features/notifications/types";

interface StudioPreviewModalProps {
  design: NotificationDesign;
  name: string;
  onClose: () => void;
}

/** Plays the design the way a customer sees it, with a button to watch it again. */
export default function StudioPreviewModal({ design, name, onClose }: StudioPreviewModalProps) {
  // Changing the key remounts the preview, which restarts every animation.
  const [run, setRun] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Preview">
      <button type="button" aria-label="Close preview" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-xl rounded-2xl bg-(--color-bg-surface) p-5 shadow-(--shadow-lg)">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-bold text-(--color-text-primary)">Preview</h2>
            <p className="truncate text-[12px] text-(--color-text-hint)">{name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
          >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-(--color-border-default)">
          <DesignPreview key={run} design={design} isPlaying />
        </div>

        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="mt-4 flex h-10 items-center gap-1.5 rounded-lg border border-(--color-border-default) px-4 text-[13px] font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-bg-surface-hover)"
        >
          <ReplayOutlinedIcon sx={{ fontSize: 16 }} />
          Play again
        </button>
      </div>
    </div>
  );
}
