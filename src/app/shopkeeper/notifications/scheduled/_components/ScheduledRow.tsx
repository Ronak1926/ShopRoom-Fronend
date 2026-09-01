"use client";

import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { ScheduledItem, ScheduleStatus } from "../_data/sampleSchedules";

const STATUS_STYLE: Record<ScheduleStatus, string> = {
  SCHEDULED: "bg-(--color-success-light) text-(--color-success-text)",
  PAUSED: "bg-(--color-brand-alert-light) text-(--color-brand-alert-text)",
  SENT: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
  FAILED: "bg-(--color-danger-bg) text-(--color-danger)",
};

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  SCHEDULED: "Scheduled",
  PAUSED: "Paused",
  SENT: "Sent",
  FAILED: "Failed",
};

const TIME = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });

interface Props {
  item: ScheduledItem;
  onPreview: (item: ScheduledItem) => void;
  onEdit: (item: ScheduledItem) => void;
}

/** One queued notification: its banner, what it says, and when it goes out. */
export default function ScheduledRow({ item, onPreview, onEdit }: Props) {
  return (
    <article className="flex flex-wrap items-center gap-4 px-4 py-3.5 border-b border-(--color-border-default) last:border-b-0">
      <span className="w-24 shrink-0 rounded-xl overflow-hidden border border-(--color-border-default)">
        {item.design ? (
          <DesignPreview design={item.design.designJson} />
        ) : (
          <span className="flex aspect-2/1 items-center justify-center bg-(--color-brand-primary-light) text-(--color-brand-primary)">
            <CampaignOutlinedIcon sx={{ fontSize: 18 }} />
          </span>
        )}
      </span>

      <div className="flex-1 min-w-52">
        <span className="inline-flex h-5 px-2 rounded-full bg-(--color-brand-primary-light) text-[10px] font-semibold text-(--color-brand-primary) items-center">
          {item.tag}
        </span>
        <h3 className="mt-1.5 text-[14px] font-bold text-(--color-text-primary) truncate">
          {item.title}
        </h3>
        <p className="text-[12px] text-(--color-text-secondary) truncate">{item.body}</p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-(--color-text-hint)">
          <span className="flex items-center gap-1">
            <ScheduleOutlinedIcon sx={{ fontSize: 13 }} />
            {TIME.format(item.sendAt)}
          </span>
          <span className="flex items-center gap-1">
            <PeopleOutlineOutlinedIcon sx={{ fontSize: 13 }} />
            {item.audienceLabel} ({item.audienceCount.toLocaleString()})
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
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="h-8 px-3.5 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="h-8 px-3.5 rounded-lg border border-(--color-brand-primary) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}
