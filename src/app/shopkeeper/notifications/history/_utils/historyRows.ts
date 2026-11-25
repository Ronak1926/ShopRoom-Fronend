import type { DesignSummary, SendHistoryItem } from "@/features/notifications/api";
import { audienceText, failureText, sendOutcome, type Analytics, type SendOutcome } from "@/features/notifications/insights";

/** One recorded send, as the history table shows it. */
export interface HistoryRow {
  id: string;
  title: string;
  body: string;
  source: "Scheduled" | "Sent now";
  /** How many devices it was addressed to. */
  audience: number;
  audienceLabel: string;
  status: SendOutcome;
  sentAt: Date;
  delivered: number;
  opened: number;
  clicked: number;
  /** Set on failed sends: what the row shows instead of metrics. */
  error: string | null;
  /** Present when the send's design is one of the shop's current designs. */
  design: DesignSummary | null;
}

/** Totals over a window, for the summary cards. */
export interface HistoryTotals {
  /** Notifications that finished sending in the window, including failed ones. */
  notifications: number;
  failed: number;
  /** Devices addressed, delivered to, and what they did next. */
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
}

export function rate(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function toHistoryRow(item: SendHistoryItem, designs: DesignSummary[]): HistoryRow {
  const status = sendOutcome(item);
  return {
    id: item.id,
    title: item.designName,
    body: item.message ?? "",
    source: item.scheduled ? "Scheduled" : "Sent now",
    audience: item.recipientCount,
    audienceLabel: audienceText(item),
    status,
    sentAt: new Date(item.sentAt ?? item.createdAt),
    delivered: item.deliveredCount,
    opened: item.openedCount,
    clicked: item.clickedCount,
    error: status === "FAILED" ? failureText(item.failureReason) : null,
    design: designs.find((d) => d.id === item.designId) ?? null,
  };
}

export function toTotals(analytics: Analytics, failed: number): HistoryTotals {
  return {
    notifications: analytics.sends,
    failed,
    sent: analytics.totals.sent,
    delivered: analytics.totals.delivered,
    opened: analytics.totals.opened,
    clicked: analytics.totals.clicked,
    deliveryRate: analytics.rates.delivery,
  };
}
