/**
 * features/notifications/insights.ts — Measured notification results: the
 * analytics summary, and how a recorded send reads to a shopkeeper.
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import type { SendHistoryItem } from "./api";

export interface Counts {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface Analytics {
  days: number;
  /** Notifications that finished sending in the window. */
  sends: number;
  totals: Counts;
  rates: { delivery: number; open: number; click: number };
  /** Percentage change against the previous window of the same length. */
  deltas: Counts;
  /** One point per day, oldest first, `date` as YYYY-MM-DD. */
  series: (Counts & { date: string })[];
  topDesigns: { designId: string; name: string; sends: number; opened: number; delivered: number; openRate: number; clickRate: number }[];
  insights: { membersTotal: number; activeMembers: number; returningMembers: number; engagementScore: number };
}

export async function fetchAnalytics(days: number): Promise<Analytics> {
  const { data } = await apiClient.get<{ data: Analytics }>("/api/notifications/analytics", {
    params: { days },
    headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` },
  });
  return data.data;
}

export type SendOutcome = "SENDING" | "FAILED" | "CLICKED" | "OPENED" | "DELIVERED";

/** The most advanced thing that happened to a send. */
export function sendOutcome(item: Pick<SendHistoryItem, "status" | "openedCount" | "clickedCount">): SendOutcome {
  if (item.status === "PENDING") return "SENDING";
  if (item.status === "FAILED") return "FAILED";
  if (item.clickedCount > 0) return "CLICKED";
  if (item.openedCount > 0) return "OPENED";
  return "DELIVERED";
}

export function audienceText(item: Pick<SendHistoryItem, "audience" | "radiusKm">): string {
  const km = item.radiusKm ?? 0;
  switch (item.audience) {
    case "NEARBY":
      return `Anyone within ${km} km`;
    case "MEMBERS_NEARBY":
    case "MEMBERS_AND_NEARBY":
      return `Room members + ${km} km`;
    default:
      return "Room members";
  }
}

const FAILURE_TEXT: Record<string, string> = {
  QUIET_HOURS: "Skipped: it was due during your quiet hours.",
  WEEKEND_BLOCKED: "Skipped: weekend sending is switched off in your preferences.",
  PLAN_EXPIRED: "Not sent: your plan had ended. Renew it to send again.",
  NO_RECIPIENTS: "Nobody could receive it: no member had a device set up for notifications.",
  DAILY_LIMIT_REACHED: "Not sent: your plan's daily limit had been reached.",
  ALL_DELIVERIES_FAILED: "The push service rejected every delivery. Members may have turned notifications off in their browser.",
  MISSED_WINDOW: "Not sent: the app was unavailable at the scheduled time and the window passed.",
  SHOP_LOCATION_MISSING: "Not sent: your shop has no location, which a nearby audience needs. Add it in your profile.",
  DISPATCH_ERROR: "Something went wrong while sending. Please try again.",
  STALE_PENDING: "Sending did not finish. Please try again.",
};

export function failureText(code: string | null): string {
  return (code && FAILURE_TEXT[code]) || "This notification could not be delivered.";
}
