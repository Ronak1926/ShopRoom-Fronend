import type { DesignSummary } from "@/features/notifications/api";

/**
 * Sample scheduled notifications.
 *
 * There is no schedule table yet — nothing can be queued, so nothing can be
 * listed. These rows exist so the page shows its real shape, and they are
 * built from the shop's own drafts so the banners and names are genuine even
 * though the times are not. Every panel drawn from them carries a Sample badge.
 *
 * The Drafts tab is not sample data: those are the shopkeeper's real designs.
 */

export type ScheduleStatus = "SCHEDULED" | "PAUSED" | "SENT" | "FAILED";

export interface ScheduledItem {
  id: string;
  title: string;
  body: string;
  /** "New Arrival", "Stock Alert" — the chip above the title. */
  tag: string;
  /** When it runs, as a local Date. */
  sendAt: Date;
  audienceLabel: string;
  audienceCount: number;
  status: ScheduleStatus;
  recurrence: string;
  /** The design the banner is drawn from, when one is available. */
  design: DesignSummary | null;
}

const BLUEPRINTS = [
  {
    title: "New Collection Drop",
    body: "Fresh styles just landed! Check out our latest collection.",
    tag: "New Arrival",
    hourOffset: 6,
    audienceShare: 1,
    audienceLabel: "Room members + 10 km",
  },
  {
    title: "Back in Stock",
    body: "Your favourite item is back in stock. Grab it now!",
    tag: "Stock Alert",
    hourOffset: 14,
    audienceShare: 0.7,
    audienceLabel: "Room members",
  },
  {
    title: "Weekend Special Offer",
    body: "Exclusive weekend deals! Limited time only.",
    tag: "Limited Offer",
    hourOffset: 30,
    audienceShare: 1,
    audienceLabel: "Room members + 10 km",
  },
  {
    title: "Don't Miss Out!",
    body: "Items in your cart are waiting for you.",
    tag: "Reminder",
    hourOffset: 77,
    audienceShare: 0.35,
    audienceLabel: "Anyone within 10 km",
  },
];

function at(hoursFromNow: number): Date {
  const when = new Date();
  when.setMinutes(0, 0, 0);
  when.setHours(when.getHours() + hoursFromNow);
  return when;
}

export function buildSampleSchedules(
  membersTotal: number,
  designs: DesignSummary[],
): { upcoming: ScheduledItem[]; completed: ScheduledItem[] } {
  const audience = Math.max(membersTotal, 240);

  const upcoming = BLUEPRINTS.map((blueprint, i) => ({
    id: `upcoming-${i}`,
    title: designs[i]?.name ?? blueprint.title,
    body: blueprint.body,
    tag: blueprint.tag,
    sendAt: at(blueprint.hourOffset),
    audienceLabel: blueprint.audienceLabel,
    audienceCount: Math.round(audience * blueprint.audienceShare),
    status: "SCHEDULED" as ScheduleStatus,
    recurrence: i === 1 ? "Every week" : "Once",
    design: designs[i] ?? null,
  }));

  const completed = BLUEPRINTS.slice(0, 2).map((blueprint, i) => ({
    id: `completed-${i}`,
    title: designs[i]?.name ?? blueprint.title,
    body: blueprint.body,
    tag: blueprint.tag,
    sendAt: at(-(24 * (i + 1)) - 3),
    audienceLabel: blueprint.audienceLabel,
    audienceCount: Math.round(audience * blueprint.audienceShare),
    status: "SENT" as ScheduleStatus,
    recurrence: "Once",
    design: designs[i] ?? null,
  }));

  return { upcoming, completed };
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

export function groupByDay(items: ScheduledItem[]): { label: string; date: Date; items: ScheduledItem[] }[] {
  const groups = new Map<string, { label: string; date: Date; items: ScheduledItem[] }>();
  for (const item of items) {
    const key = item.sendAt.toDateString();
    const existing = groups.get(key);
    if (existing) existing.items.push(item);
    else groups.set(key, { label: dayGroupLabel(item.sendAt), date: item.sendAt, items: [item] });
  }
  return Array.from(groups.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
}
