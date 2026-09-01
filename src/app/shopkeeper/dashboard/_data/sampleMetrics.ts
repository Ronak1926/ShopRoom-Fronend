import type { DesignSummary } from "@/features/notifications/api";

/**
 * Sample notification metrics.
 *
 * Nothing in the database records a send: there is no send row, no delivery
 * receipt and no open or click event, so none of these numbers can be measured
 * yet. They exist so the dashboard shows its real shape, and every panel drawn
 * from them carries a "Sample" badge.
 *
 * Swapping to live data is one substitution — replace this module with the
 * analytics call and the panels take it unchanged.
 */

export interface MetricPoint {
  date: Date;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export type SendStatus = "Delivered" | "Partially Opened" | "Sending";

export interface SendRow {
  id: string;
  title: string;
  body: string;
  type: string;
  audience: number;
  sentAt: Date;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  status: SendStatus;
  /** Present when the row was built from one of the shop's own designs. */
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

const FALLBACK_SENDS = [
  { title: "New Arrival!", body: "Fresh collection just arrived.", type: "Promotional" },
  { title: "Back in Stock", body: "Your favourite item is back.", type: "Restock Alert" },
  { title: "Weekend Sale", body: "Special offers for this weekend.", type: "Promotional" },
  { title: "Limited Offer", body: "Hurry up! Limited time only.", type: "Promotional" },
];

const STATUSES: SendStatus[] = ["Delivered", "Delivered", "Partially Opened", "Delivered"];

/** Deterministic 0–1 noise, so the figures never shift between renders. */
function noise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function buildSampleMetrics(
  days: number,
  membersTotal: number,
  designs: DesignSummary[],
): NotificationMetrics {
  const audience = Math.max(membersTotal, 240);
  const today = startOfDay(new Date());
  const dayMs = 86_400_000;

  const series: MetricPoint[] = Array.from({ length: days }, (_, i) => {
    const date = new Date(today.getTime() - (days - 1 - i) * dayMs);
    // A gentle rise across the window, plus stable per-day variation.
    const trend = 0.72 + (i / Math.max(days - 1, 1)) * 0.35;
    const sent = Math.round(audience * trend * (0.85 + noise(i + 1) * 0.3));
    const delivered = Math.round(sent * (0.9 + noise(i + 7) * 0.06));
    const opened = Math.round(delivered * (0.38 + noise(i + 13) * 0.08));
    const clicked = Math.round(delivered * (0.09 + noise(i + 23) * 0.04));
    return { date, sent, delivered, opened, clicked };
  });

  const sum = (pick: (p: MetricPoint) => number) =>
    series.reduce((total, point) => total + pick(point), 0);

  const totals = {
    sent: sum((p) => p.sent),
    delivered: sum((p) => p.delivered),
    opened: sum((p) => p.opened),
    clicked: sum((p) => p.clicked),
  };

  const half = Math.floor(series.length / 2);
  const growth = (pick: (p: MetricPoint) => number) => {
    const older = series.slice(0, half).reduce((t, p) => t + pick(p), 0);
    const newer = series.slice(half).reduce((t, p) => t + pick(p), 0);
    return older ? Math.round(((newer - older) / older) * 1000) / 10 : 0;
  };

  const recent: SendRow[] = Array.from({ length: 4 }, (_, i) => {
    const design = designs[i] ?? null;
    const fallback = FALLBACK_SENDS[i % FALLBACK_SENDS.length];
    return {
      id: design?.id ?? `sample-${i}`,
      title: design?.name ?? fallback.title,
      body: fallback.body,
      type: fallback.type,
      audience: Math.round(audience * (1 - noise(i + 31) * 0.25)),
      sentAt: new Date(Date.now() - (i * 14 + 6) * 3_600_000),
      deliveryRate: Math.round((89 + noise(i + 41) * 6) * 10) / 10,
      openRate: Math.round((30 + noise(i + 53) * 13) * 10) / 10,
      clickRate: Math.round((7 + noise(i + 61) * 4) * 10) / 10,
      status: STATUSES[i % STATUSES.length],
      design,
    };
  });

  const openRate = totals.delivered ? (totals.opened / totals.delivered) * 100 : 0;

  return {
    totals,
    rates: {
      delivery: totals.sent ? Math.round((totals.delivered / totals.sent) * 1000) / 10 : 0,
      open: Math.round(openRate * 10) / 10,
      click: totals.delivered
        ? Math.round((totals.clicked / totals.delivered) * 1000) / 10
        : 0,
    },
    deltas: {
      sent: growth((p) => p.sent),
      delivered: growth((p) => p.delivered),
      opened: growth((p) => p.opened),
      clicked: growth((p) => p.clicked),
    },
    series,
    recent,
    insights: {
      activeMembers: Math.round(audience * 0.31),
      returningMembers: Math.round(audience * 0.2),
      engagementScore: Math.min(99, Math.round(openRate * 1.85)),
    },
  };
}
