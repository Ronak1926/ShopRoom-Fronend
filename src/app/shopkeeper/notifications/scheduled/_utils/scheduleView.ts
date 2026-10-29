import type { ScheduleView } from "@/features/notifications/api";
import type { NotificationDesign } from "@/features/notifications/types";
import { RECURRENCE_UNIT, describeAudience } from "../_schemas/schedule";

export type ScheduleStatus = "SCHEDULED" | "PAUSED" | "SENT" | "CANCELLED";

/** One row on the Scheduled page, shaped for display from the server's schedule. */
export interface ScheduledItem {
  id: string;
  title: string;
  body: string;
  /** "New Arrival", "Flash Sale" — the chip above the title. */
  tag: string;
  /** Next run for a live schedule; last run for a finished one. */
  sendAt: Date;
  audienceLabel: string;
  status: ScheduleStatus;
  recurrence: string;
  design: NotificationDesign;
  /** Live schedules can be paused, resumed and cancelled. */
  manageable: boolean;
}

const STATUS_BY_SERVER: Record<ScheduleView["status"], ScheduleStatus> = {
  ACTIVE: "SCHEDULED",
  PAUSED: "PAUSED",
  COMPLETED: "SENT",
  CANCELLED: "CANCELLED",
};

/** "NEW_ARRIVAL" → "New Arrival" */
function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function describeRepeat(view: ScheduleView): string {
  if (view.recurrence === "ONCE") return "Once";
  const unit = RECURRENCE_UNIT[view.recurrence].replace("(s)", "");
  return view.repeatEvery === 1 ? `Every ${unit}` : `Every ${view.repeatEvery} ${unit}s`;
}

export function toScheduledItem(view: ScheduleView): ScheduledItem {
  const when = view.nextRunAt ?? view.lastRunAt;
  return {
    id: view.id,
    title: view.designName,
    body: view.message ?? "",
    tag: titleCase(view.designJson.category),
    sendAt: new Date(when ?? Date.now()),
    audienceLabel: describeAudience(view),
    status: STATUS_BY_SERVER[view.status],
    recurrence: describeRepeat(view),
    design: view.designJson,
    manageable: view.status === "ACTIVE" || view.status === "PAUSED",
  };
}

/** "Today", "Tomorrow", "Sunday" — the heading a group of rows sits under. */
export function dayGroupLabel(date: Date): string {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(date) - start(new Date())) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1 && days < 7) return date.toLocaleDateString("en-IN", { weekday: "long" });
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

export function groupByDay(
  items: ScheduledItem[],
  direction: "asc" | "desc" = "asc",
): { label: string; date: Date; items: ScheduledItem[] }[] {
  const groups = new Map<string, { label: string; date: Date; items: ScheduledItem[] }>();
  for (const item of items) {
    const key = item.sendAt.toDateString();
    const existing = groups.get(key);
    if (existing) existing.items.push(item);
    else groups.set(key, { label: dayGroupLabel(item.sendAt), date: item.sendAt, items: [item] });
  }
  const sign = direction === "asc" ? 1 : -1;
  return Array.from(groups.values()).sort((a, b) => sign * (a.date.getTime() - b.date.getTime()));
}
