import { z } from "zod";

/**
 * Notification preferences — the defaults applied when a shopkeeper creates a
 * new notification, plus how the Studio behaves while they work.
 *
 * There is no server model for these yet, so they live in localStorage. The
 * schema exists to guard that: stored JSON can be stale, hand-edited or written
 * by an older build, so it is parsed rather than trusted, and anything that
 * fails falls back to the defaults below.
 */

export const NOTIFICATION_TYPES = ["PROMOTIONAL", "TRANSACTIONAL", "ANNOUNCEMENT", "REMINDER"] as const;
export const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export const LANGUAGES = ["en-IN", "en-US", "hi-IN", "gu-IN"] as const;
export const TIME_ZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Singapore",
] as const;
export const FORMATS = ["BANNER", "EXPANDED"] as const;
export const BACKGROUNDS = ["WHITE", "TRANSPARENT"] as const;
export const FONT_FAMILIES = ["Inter", "Poppins", "Roboto", "System"] as const;
export const SCHEDULE_TYPES = ["NOW", "SCHEDULE"] as const;
export const EXPIRY_HOURS = [1, 6, 12, 24, 72, 168] as const;
export const CHANNELS = ["PUSH", "IN_APP", "EMAIL", "SMS"] as const;

const hhmm = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected a 24-hour time like 22:00");

export const PreferencesSchema = z.object({
  // General
  defaultType: z.enum(NOTIFICATION_TYPES),
  defaultPriority: z.enum(PRIORITIES),
  language: z.enum(LANGUAGES),
  timeZone: z.enum(TIME_ZONES),

  // Design
  defaultFormat: z.enum(FORMATS),
  defaultBackground: z.enum(BACKGROUNDS),
  cornerRadius: z.number().int().min(0).max(48),
  fontFamily: z.enum(FONT_FAMILIES),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected a hex colour"),

  // Content
  showAppLogo: z.boolean(),
  showTimestamp: z.boolean(),
  showSafeArea: z.boolean(),
  contentSuggestions: z.boolean(),

  // Scheduling
  scheduleType: z.enum(SCHEDULE_TYPES),
  expiryHours: z.number().int().refine((v) => (EXPIRY_HOURS as readonly number[]).includes(v)),
  quietFrom: hhmm,
  quietTo: hhmm,
  weekendSending: z.boolean(),

  // Delivery
  channels: z.array(z.enum(CHANNELS)).min(1, "Pick at least one channel"),
  retryFailed: z.boolean(),
  maxRetries: z.number().int().min(0).max(10),

  // Advanced
  analyticsTracking: z.boolean(),
  autoSaveDrafts: z.boolean(),
  confirmBeforeSending: z.boolean(),
});

export type NotificationPreferences = z.infer<typeof PreferencesSchema>;

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  defaultType: "PROMOTIONAL",
  defaultPriority: "NORMAL",
  language: "en-IN",
  timeZone: "Asia/Kolkata",

  defaultFormat: "BANNER",
  defaultBackground: "WHITE",
  cornerRadius: 16,
  fontFamily: "Inter",
  primaryColor: "#6C47FF",

  showAppLogo: true,
  showTimestamp: true,
  showSafeArea: true,
  contentSuggestions: true,

  scheduleType: "NOW",
  expiryHours: 24,
  quietFrom: "22:00",
  quietTo: "08:00",
  weekendSending: true,

  channels: ["PUSH", "IN_APP"],
  retryFailed: true,
  maxRetries: 3,

  analyticsTracking: true,
  autoSaveDrafts: true,
  confirmBeforeSending: false,
};

// ── labels ───────────────────────────────────────────────────────────────────

export const TYPE_LABELS: Record<string, string> = {
  PROMOTIONAL: "Promotional",
  TRANSACTIONAL: "Transactional",
  ANNOUNCEMENT: "Announcement",
  REMINDER: "Reminder",
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  "en-IN": "English (India)",
  "en-US": "English (US)",
  "hi-IN": "हिन्दी (Hindi)",
  "gu-IN": "ગુજરાતી (Gujarati)",
};

export const CHANNEL_LABELS: Record<string, string> = {
  PUSH: "Push",
  IN_APP: "In-App",
  EMAIL: "Email",
  SMS: "SMS",
};

/** "Asia/Kolkata" → "(GMT+05:30) Asia/Kolkata", computed so DST stays right. */
export function timeZoneLabel(zone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: zone,
      timeZoneName: "longOffset",
    }).formatToParts(new Date());
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return `(${offset.replace("GMT", "GMT")}) ${zone}`;
  } catch {
    return zone;
  }
}

export function expiryLabel(hours: number): string {
  if (hours < 24) return `${hours} Hour${hours === 1 ? "" : "s"}`;
  const days = hours / 24;
  return `${days} Day${days === 1 ? "" : "s"}`;
}
