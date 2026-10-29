"use client";

import { useState } from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { ScheduledItem, ScheduleStatus } from "../_utils/scheduleView";

const STATUS_STYLE: Record<ScheduleStatus, string> = {
  SCHEDULED: "bg-(--color-success-light) text-(--color-success-text)",
  PAUSED: "bg-(--color-brand-alert-light) text-(--color-brand-alert-text)",
  SENT: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
  CANCELLED: "bg-(--color-bg-surface-hover) text-(--color-text-secondary)",
};

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  SCHEDULED: "Scheduled",
  PAUSED: "Paused",
  SENT: "Completed",
  CANCELLED: "Cancelled",
};

const TIME = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });

const SECONDARY_BUTTON =
  "h-8 px-3.5 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

interface Props {
  item: ScheduledItem;
  /** True while a pause, resume or cancel for this row is in flight. */
  busy: boolean;
  onPreview: (item: ScheduledItem) => void;
  onToggle: (item: ScheduledItem) => void;
  onCancel: (item: ScheduledItem) => void;
}

/** One queued notification: its banner, what it says, and when it goes out. */
export default function ScheduledRow({ item, busy, onPreview, onToggle, onCancel }: Props) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  return (
    <article className="flex flex-wrap items-center gap-4 px-4 py-3.5 border-b border-(--color-border-default) last:border-b-0">
      <span className="w-24 shrink-0 rounded-xl overflow-hidden border border-(--color-border-default)">
        <DesignPreview design={item.design} />
      </span>

      <div className="flex-1 min-w-52">
        <span className="inline-flex h-5 px-2 rounded-full bg-(--color-brand-primary-light) text-[10px] font-semibold text-(--color-brand-primary) items-center">
          {item.tag}
        </span>
        <h3 className="mt-1.5 text-[14px] font-bold text-(--color-text-primary) truncate">
          {item.title}
        </h3>
        {item.body && (
          <p className="text-[12px] text-(--color-text-secondary) truncate">{item.body}</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-(--color-text-hint)">
          <span className="flex items-center gap-1">
            <ScheduleOutlinedIcon sx={{ fontSize: 13 }} />
            {TIME.format(item.sendAt)}
          </span>
          <span className="flex items-center gap-1">
            <PeopleOutlineOutlinedIcon sx={{ fontSize: 13 }} />
            {item.audienceLabel}
          </span>
          {item.recurrence !== "Once" && (
            <span className="flex items-center gap-1">
              <RepeatOutlinedIcon sx={{ fontSize: 13 }} />
              {item.recurrence}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2.5">
        <span
          className={`flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10.5px] font-semibold ${STATUS_STYLE[item.status]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {STATUS_LABEL[item.status]}
        </span>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onPreview(item)} className={SECONDARY_BUTTON}>
            Preview
          </button>

          {item.manageable &&
            (confirmingCancel ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setConfirmingCancel(false);
                    onCancel(item);
                  }}
                  className="h-8 px-3.5 rounded-lg bg-(--color-danger) text-[12px] font-semibold text-white hover:bg-(--color-danger-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm cancel
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(false)}
                  className={SECONDARY_BUTTON}
                >
                  Keep
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onToggle(item)}
                  className="h-8 px-3.5 rounded-lg border border-(--color-brand-primary) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.status === "PAUSED" ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmingCancel(true)}
                  className={SECONDARY_BUTTON}
                >
                  Cancel
                </button>
              </>
            ))}
        </div>
      </div>
    </article>
  );
}
