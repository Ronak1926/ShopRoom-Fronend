import { z } from "zod";

/**
 * The send flow targets by distance, not only by membership: a notification can
 * go to everyone standing within a few kilometres of the shop right now, which
 * is a different — and usually larger — audience than the room.
 */
export const AUDIENCE_MODES = ["ROOM_MEMBERS", "NEARBY", "MEMBERS_NEARBY"] as const;
export type AudienceMode = (typeof AUDIENCE_MODES)[number];

export const MIN_RADIUS_KM = 1;
export const MAX_RADIUS_KM = 25;
export const DEFAULT_RADIUS_KM = 10;
export const RADIUS_PRESETS_KM = [5, 10, 15, 25] as const;
export const MESSAGE_MAX_LENGTH = 100;

/** True for the modes measured from the shop's coordinates. */
export function usesRadius(mode: AudienceMode): boolean {
  return mode !== "ROOM_MEMBERS";
}

export const SendNotificationSchema = z.object({
  /** An owned design, or a catalog template sent as it stands. */
  source: z.enum(["DESIGN", "TEMPLATE"]),
  notificationId: z.string().min(1, "Choose a notification to send."),
  audience: z.enum(AUDIENCE_MODES),
  radiusKm: z.number().int().min(MIN_RADIUS_KM).max(MAX_RADIUS_KM),
  message: z
    .string()
    .max(MESSAGE_MAX_LENGTH, `Keep the message under ${MESSAGE_MAX_LENGTH} characters.`),
});

export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;

export const AUDIENCE_OPTIONS: {
  value: AudienceMode;
  label: string;
  description: string;
}[] = [
  {
    value: "ROOM_MEMBERS",
    label: "All Members",
    description: "Everyone who joined your room, wherever they are.",
  },
  {
    value: "NEARBY",
    label: "Nearby Customers",
    description: "Anyone sharing their location inside the radius.",
  },
  {
    value: "MEMBERS_NEARBY",
    label: "Members Nearby",
    description: "Room members who are inside the radius right now.",
  },
];

export const AUDIENCE_LABELS: Record<AudienceMode, string> = {
  ROOM_MEMBERS: "All Members",
  NEARBY: "Nearby Customers",
  MEMBERS_NEARBY: "Members Nearby",
};
