import type { DesignSummary } from "@/features/notifications/api";

/**
 * Sample notification history.
 *
 * Nothing records a send yet — no send row, no delivery receipt, no open or
 * click event — so none of this can be measured. The rows exist so the page
 * shows its real shape, and they borrow the shop's own drafts so the banners
 * and names are genuine. Every panel drawn from them carries a Sample badge.
 *
 * Swapping to live data is one substitution: replace this module with the
 * history call and the table takes the same row shape unchanged.
 */

export type HistoryStatus = "DELIVERED" | "OPENED" | "CLICKED" | "FAILED";

export interface HistoryRow {
  id: string;
  title: string;
  body: string;
  /** The chip in the Template column. */
  template: string;
  audience: number;
  audienceLabel: string;
  status: HistoryStatus;
  sentAt: Date;
  delivered: number;
  opened: number;
  clicked: number;
  /** Set on failed sends — what the row shows instead of metrics. */
  error: string | null;
  design: DesignSummary | null;
}

export interface HistoryTotals {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

const BLUEPRINTS = [
  { title: "New Collection Drop", body: "Fresh styles just landed!", template: "New Arrival", audienceLabel: "Room members + 10 km" },
  { title: "Back in Stock", body: "Your favourite is back!", template: "Stock Alert", audienceLabel: "Room members" },
  { title: "Weekend Special Offer", body: "Exclusive weekend deals!", template: "Offer & Sale", audienceLabel: "Room members + 10 km" },
  { title: "Don't Miss Out!", body: "Items in your cart are waiting.", template: "Reminder", audienceLabel: "Anyone within 10 km" },
  { title: "Flash Sale 50% OFF", body: "Today only. Don't miss it!", template: "Flash Sale", audienceLabel: "Room members + 10 km" },
  { title: "Restock Reminder", body: "We saved it for you!", template: "Restock", audienceLabel: "Room members" },
  { title: "Big Announcement", body: "Exciting news inside!", template: "Announcement", audienceLabel: "Room members" },
  { title: "Festive Special", body: "Special offers for you!", template: "Festive", audienceLabel: "Room members + 10 km" },
];

const FAILURES = [
  "Push credentials rejected by the provider.",
  "No reachable devices for this audience.",
];

/** Deterministic 0–1 noise, so a row never changes between renders. */
function noise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function buildSampleHistory(
  membersTotal: number,
  designs: DesignSummary[],
  count = 48,
): HistoryRow[] {
  const base = Math.max(membersTotal, 240);

  return Array.from({ length: count }, (_, i) => {
    const blueprint = BLUEPRINTS[i % BLUEPRINTS.length];
    const design = designs[i % Math.max(designs.length, 1)] ?? null;

    const sentAt = new Date();
    sentAt.setHours(9 + (i % 12), (i % 4) * 15, 0, 0);
    sentAt.setDate(sentAt.getDate() - Math.floor(i / 2));

    const failed = i % 11 === 5;
    const audience = Math.round(base * (0.4 + noise(i + 3) * 0.6));
    const delivered = failed ? 0 : Math.round(audience * (0.88 + noise(i + 17) * 0.1));
    const opened = failed ? 0 : Math.round(delivered * (0.62 + noise(i + 29) * 0.24));
    const clicked = failed ? 0 : Math.round(opened * (0.18 + noise(i + 41) * 0.16));

    const status: HistoryStatus = failed
      ? "FAILED"
      : clicked / Math.max(delivered, 1) > 0.2
        ? "CLICKED"
        : opened / Math.max(delivered, 1) > 0.7
          ? "OPENED"
          : "DELIVERED";

    return {
      id: `history-${i}`,
      title: design && i < designs.length ? design.name : blueprint.title,
      body: blueprint.body,
      template: blueprint.template,
      audience,
      audienceLabel: blueprint.audienceLabel,
      status,
      sentAt,
      delivered,
      opened,
      clicked,
      error: failed ? FAILURES[i % FAILURES.length] : null,
      design,
    };
  });
}

export function totalsOf(rows: HistoryRow[]): HistoryTotals {
  return rows.reduce<HistoryTotals>(
    (totals, row) => ({
      sent: totals.sent + 1,
      delivered: totals.delivered + row.delivered,
      opened: totals.opened + row.opened,
      clicked: totals.clicked + row.clicked,
      failed: totals.failed + (row.status === "FAILED" ? 1 : 0),
    }),
    { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
  );
}

export function rate(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}
