"use client";

import { useEffect } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DesignPreview from "./DesignPreview";
import type { TemplateSummary } from "@/features/notifications/api";

interface Props {
  template: TemplateSummary;
  categoryName?: string;
  busy: boolean;
  locked: boolean;
  onClose: () => void;
  onUse: (template: TemplateSummary) => void;
}

export default function TemplatePreviewModal({
  template,
  categoryName,
  busy,
  locked,
  onClose,
  onUse,
}: Props) {
  // Escape closes, and the page behind must not scroll under the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const design = template.designJson;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} preview`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-(--color-bg-overlay)"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-(--color-bg-surface) shadow-(--shadow-lg) overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 px-5 h-14 border-b border-(--color-border-default)">
          <div className="min-w-0">
            <h2 className="text-[14px] font-bold text-(--color-text-primary) truncate">
              {template.name}
            </h2>
            {categoryName && (
              <p className="text-[11px] text-(--color-text-hint)">{categoryName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close preview"
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-5 bg-(--color-bg-page)">
          <div className="rounded-xl overflow-hidden shadow-(--shadow-md)">
            <DesignPreview design={design} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-(--color-text-secondary)">
            This is the notification image itself. Android and iOS draw the app icon, name, time,
            title and body around it.
          </p>
          <p className="mt-1 text-[10.5px] text-(--color-text-hint)">
            {design.canvas.width} × {design.canvas.height} · {design.elements.length} layers
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 h-16 border-t border-(--color-border-default)">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            disabled={busy || locked}
            title={locked ? "Upgrade your plan to use this template" : undefined}
            onClick={() => onUse(template)}
            className="h-9 px-5 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "Opening…" : "Use Template"}
          </button>
        </div>
      </div>
    </div>
  );
}
