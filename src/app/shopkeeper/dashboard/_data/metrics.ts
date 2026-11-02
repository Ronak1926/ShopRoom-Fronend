import type { DesignSummary, SendHistoryItem } from "@/features/notifications/api";
import { sendOutcome, type Analytics } from "@/features/notifications/insights";

/** What the dashboard panels draw: measured results over the chosen window. */

export interface MetricPoint {
  date: Date;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export type SendStatus = "Delivered" | "Sending" | "Failed";

export interface SendRow {
  id: string;
  title: string;
  body: string;
  audience: number;
  sentAt: Date;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  status: SendStatus;
  /** Present when the send's design is one of the shop's current designs. */
  design: DesignSummary | null;
}

export interface NotificationMetrics {
  totals: { sent: number; delivered: number; opened: number; clicked: number };
  rates: { delivery: number; open: number; click: number };
  deltas: { sent: number; delivered: number; opened: number; clicked: number };
  series: MetricPoint[];
  recent: SendRow[];
  insights: { activeMembers: number; returningMembers: number; engagementScore: number };
}

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);

/** "2026-11-03" as a local date, so the chart labels the right day whatever the viewer's time zone. */
function localDate(isoDay: string): Date {
  const [year, month, day] = isoDay.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const STATUS_LABEL = { SENDING: "Sending", FAILED: "Failed" } as const;

function toRow(item: SendHistoryItem, designs: DesignSummary[]): SendRow {
  const outcome = sendOutcome(item);
  return {
    id: item.id,
    title: item.designName,
    body: item.message ?? "",
    audience: item.recipientCount,
    sentAt: new Date(item.sentAt ?? item.createdAt),
    deliveryRate: pct(item.deliveredCount, item.recipientCount),
    openRate: pct(item.openedCount, item.deliveredCount),
    clickRate: pct(item.clickedCount, item.deliveredCount),
    status: outcome === "SENDING" || outcome === "FAILED" ? STATUS_LABEL[outcome] : "Delivered",
    design: designs.find((d) => d.id === item.designId) ?? null,
  };
}

export function buildMetrics(analytics: Analytics, sends: SendHistoryItem[], designs: DesignSummary[]): NotificationMetrics {
  const { totals, rates, deltas, insights } = analytics;
  return {
    totals,
    rates,
    deltas,
    series: analytics.series.map(({ date, ...counts }) => ({ date: localDate(date), ...counts })),
    recent: sends.map((send) => toRow(send, designs)),
    insights: {
      activeMembers: insights.activeMembers,
      returningMembers: insights.returningMembers,
      engagementScore: insights.engagementScore,
    },
  };
}
