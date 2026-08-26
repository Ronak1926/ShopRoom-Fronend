"use client";

import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DesignPreview from "./DesignPreview";
import type { DesignSummary } from "@/features/notifications/api";

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-(--color-bg-surface-hover) text-(--color-text-secondary)",
  ACTIVE: "bg-(--color-success-light) text-(--color-success)",
  ARCHIVED: "bg-(--color-bg-surface-hover) text-(--color-text-hint)",
};

interface Props {
  design: DesignSummary;
  /** Set while this card's delete request is in flight. */
  busy: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

/** One of the shopkeeper's own saved designs, in My Templates / Drafts. */
export default function DesignCard({ design, busy, onOpen, onDelete }: Props) {
  // Two-step rather than a modal: the Studio autosaves constantly, so drafts
  // pile up and deleting is routine — but it should still take two clicks.
  const [confirming, setConfirming] = useState(false);
  const edited = new Date(design.updatedAt);

  return (
    <article className="flex flex-col rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) overflow-hidden transition-colors hover:border-(--color-brand-primary)">
      <div className="relative">
        <DesignPreview design={design.designJson} />
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            STATUS_STYLE[design.status] ?? STATUS_STYLE.DRAFT
          }`}
        >
          {design.status.toLowerCase()}
        </span>
        <button
          type="button"
          title="Delete this design"
          disabled={busy}
          onClick={() => setConfirming(true)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-(--color-bg-surface) shadow-(--shadow-sm) text-(--color-text-hint) hover:text-(--color-danger) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
        </button>
      </div>

      <div className="px-3 pt-2.5">
        <h3 className="text-[12.5px] font-semibold text-(--color-text-primary) truncate">
          {design.name}
        </h3>
        <p className="text-[10.5px] text-(--color-text-hint) mt-0.5">
          v{design.version} · edited {edited.toLocaleDateString()}
        </p>
      </div>

      <div className="p-3">
        {confirming ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10.5px] leading-snug text-(--color-text-secondary)">
              Delete this design? You can restore it later.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="h-8 rounded-lg border border-(--color-border-default) text-[11.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
              >
                Keep
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onDelete(design.id)}
                className="h-8 rounded-lg bg-(--color-danger) text-[11.5px] font-semibold text-white hover:bg-(--color-danger-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpen(design.id)}
            className="w-full h-8 rounded-lg bg-(--color-brand-primary) text-[11.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
          >
            Open in Studio
          </button>
        )}
      </div>
    </article>
  );
}
