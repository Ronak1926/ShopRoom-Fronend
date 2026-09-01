import { z } from "zod";

/**
 * The scheduling wizard, as one document.
 *
 * Audience follows the union model the send flow is moving to: room members
 * and people inside the radius are independent legs OR'd together, with the
 * overlap counted once. At least one leg has to stay on.
 */

export const MIN_RADIUS_KM = 1;
export const MAX_RADIUS_KM = 25;
export const DEFAULT_RADIUS_KM = 10;
export const RADIUS_PRESETS_KM = [5, 10, 15, 25] as const;

export const RECURRENCES = ["ONCE", "DAILY", "WEEKLY", "MONTHLY"] as const;
export type Recurrence = (typeof RECURRENCES)[number];

export const END_MODES = ["NEVER", "ON", "AFTER"] as const;
export const DELIVERY_SPEEDS = ["STANDARD", "PRIORITY"] as const;
export type DeliverySpeed = (typeof DELIVERY_SPEEDS)[number];

export const WIZARD_STEPS = [
  { id: "notification", title: "Select Notification", hint: "Choose from your drafts" },
  { id: "audience", title: "Audience", hint: "Choose who will receive" },
  { id: "schedule", title: "Schedule", hint: "Pick date and time" },
  { id: "review", title: "Review & Confirm", hint: "Review and schedule" },
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number]["id"];

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected a 24-hour time");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date");

export const ScheduleSchema = z
  .object({
    // 1 — the notification
    source: z.enum(["DESIGN", "TEMPLATE"]),
    notificationId: z.string().min(1, "Choose a notification to schedule."),

    // 2 — audience
    includeMembers: z.boolean(),
    includeNearby: z.boolean(),
    radiusKm: z.number().int().min(MIN_RADIUS_KM).max(MAX_RADIUS_KM),
    includeFutureMembers: z.boolean(),
    skipNotificationsOff: z.boolean(),

    // 3 — schedule
    date: isoDate,
    time: hhmm,
    recurrence: z.enum(RECURRENCES),
    repeatEvery: z.number().int().min(1).max(30),
    weekdays: z.array(z.number().int().min(0).max(6)),
    endMode: z.enum(END_MODES),
    endDate: isoDate.nullable(),
    endAfter: z.number().int().min(1).max(365).nullable(),
    deliverySpeed: z.enum(DELIVERY_SPEEDS),
  })
  .refine((v) => v.includeMembers || v.includeNearby, {
    message: "Pick at least one audience.",
    path: ["includeMembers"],
  })
  .refine((v) => v.recurrence !== "WEEKLY" || v.weekdays.length > 0, {
    message: "Pick at least one day of the week.",
    path: ["weekdays"],
  })
  .refine((v) => v.endMode !== "ON" || Boolean(v.endDate), {
    message: "Pick the date the repeat ends.",
    path: ["endDate"],
  })
  .refine((v) => new Date(`${v.date}T${v.time}`).getTime() > Date.now(), {
    message: "Pick a time in the future.",
    path: ["time"],
  });

export type ScheduleInput = z.infer<typeof ScheduleSchema>;

export const RECURRENCE_OPTIONS: {
  value: Recurrence;
  label: string;
  description: string;
}[] = [
  { value: "ONCE", label: "Send Once", description: "Send only once at the selected date and time." },
  { value: "DAILY", label: "Daily", description: "Repeat every day at the selected time." },
  { value: "WEEKLY", label: "Weekly", description: "Repeat every week on selected days." },
  { value: "MONTHLY", label: "Monthly", description: "Repeat every month on the selected date." },
];

export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const RECURRENCE_UNIT: Record<Recurrence, string> = {
  ONCE: "",
  DAILY: "day(s)",
  WEEKLY: "week(s)",
  MONTHLY: "month(s)",
};

/** "2 May 2026, 10:00 AM" from the wizard's own date and time fields. */
export function formatWhen(date: string, time: string): string {
  const at = new Date(`${date}T${time}`);
  if (Number.isNaN(at.getTime())) return "—";
  return at.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function describeRecurrence(values: ScheduleInput): string {
  if (values.recurrence === "ONCE") return "Once";
  const unit = RECURRENCE_UNIT[values.recurrence];
  const every = values.repeatEvery === 1 ? `Every ${unit.replace("(s)", "")}` : `Every ${values.repeatEvery} ${unit}`;
  if (values.endMode === "ON" && values.endDate) return `${every}, until ${values.endDate}`;
  if (values.endMode === "AFTER" && values.endAfter) return `${every}, ${values.endAfter} times`;
  return every;
}

export function describeAudience(values: {
  includeMembers: boolean;
  includeNearby: boolean;
  radiusKm: number;
}): string {
  const legs: string[] = [];
  if (values.includeMembers) legs.push("Room members");
  if (values.includeNearby) legs.push(`Anyone within ${values.radiusKm} km`);
  return legs.join(" + ") || "No audience selected";
}

/** Today in the local zone, as the date input wants it. */
export function todayIso(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}
