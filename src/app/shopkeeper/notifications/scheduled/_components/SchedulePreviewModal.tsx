"use client";

import { useEffect } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { ScheduledItem } from "../_data/sampleSchedules";

const WHEN = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export default function SchedulePreviewModal({
  item,
  onClose,
}: {
  item: ScheduledItem;
  onClose: () => void;
}) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} preview`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-(--color-bg-overlay)"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-(--color-bg-surface) shadow-(--shadow-lg) overflow-hidden"
      >
        <header className="flex items-center justify-between gap-3 px-5 h-14 border-b border-(--color-border-default)">
          <h2 className="text-[14px] font-bold text-(--color-text-primary) truncate">
            {item.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            title="Close preview"
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </header>

        <div className="p-5 bg-(--color-bg-page)">
          <div className="rounded-xl overflow-hidden shadow-(--shadow-md) bg-(--color-bg-surface)">
            {item.design ? (
              <DesignPreview design={item.design.designJson} />
            ) : (
              <p className="aspect-2/1 flex items-center justify-center text-[12px] text-(--color-text-hint)">
                This schedule has no design attached.
              </p>
            )}
          </div>
          <p className="mt-3 text-[12px] text-(--color-text-secondary)">{item.body}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11.5px] text-(--color-text-hint)">
            <span className="flex items-center gap-1">
              <ScheduleOutlinedIcon sx={{ fontSize: 14 }} />
              {WHEN.format(item.sendAt)}
            </span>
            <span className="flex items-center gap-1">
              <PeopleOutlineOutlinedIcon sx={{ fontSize: 14 }} />
              {item.audienceLabel} ({item.audienceCount.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
