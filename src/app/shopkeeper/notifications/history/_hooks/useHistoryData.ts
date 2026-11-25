"use client";

import { useEffect, useMemo, useState } from "react";
import { listDesigns, listSends, type DesignSummary, type SendHistoryParams } from "@/features/notifications/api";
import { fetchAnalytics, type Analytics } from "@/features/notifications/insights";
import { toHistoryRow, toTotals, type HistoryRow, type HistoryTotals } from "../_utils/historyRows";

const DESIGN_LIMIT = 100;

interface HistoryFilters {
  outcome: NonNullable<SendHistoryParams["outcome"]>;
  sort: NonNullable<SendHistoryParams["sort"]>;
  q: string;
  days: number;
  page: number;
  pageSize: number;
}

/** The shop's designs, so rows can show their real banner. Best effort: rows fall back to a generic icon. */
export function useDesigns() {
  const [designs, setDesigns] = useState<DesignSummary[]>([]);
  useEffect(() => {
    let cancelled = false;
    listDesigns({ archived: false, limit: DESIGN_LIMIT })
      .then((res) => !cancelled && setDesigns(res.items))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return designs;
}

/** One page of recorded sends under the current filters. */
export function useSendRows(filters: HistoryFilters, designs: DesignSummary[]) {
  const { outcome, sort, q, days, page, pageSize } = filters;
  type Items = Awaited<ReturnType<typeof listSends>>["items"];
  // Each answer is tagged with the request it belongs to, so "still loading" and "failed" are
  // read off the current filters rather than reset by hand.
  const requestKey = JSON.stringify([outcome, sort, q, days, page, pageSize]);
  const [state, setState] = useState<{ key: string; items: Items; total: number; failed: boolean } | null>(null);
  const [lastGood, setLastGood] = useState<{ items: Items; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    listSends({ page, limit: pageSize, outcome, sort, days, ...(q ? { q } : {}) })
      .then((res) => {
        if (cancelled) return;
        setLastGood({ items: res.items, total: res.total });
        setState({ key: requestKey, items: res.items, total: res.total, failed: false });
      })
      .catch(() => !cancelled && setState({ key: requestKey, items: [], total: 0, failed: true }));
    return () => {
      cancelled = true;
    };
  }, [outcome, sort, q, days, page, pageSize, requestKey]);

  const current = state?.key === requestKey ? state : null;
  // While a new page loads, the previous rows stay on screen (dimmed by the caller).
  const shown = current && !current.failed ? current : lastGood;
  const rows: HistoryRow[] = useMemo(() => (shown?.items ?? []).map((item) => toHistoryRow(item, designs)), [shown, designs]);
  return { rows, total: shown?.total ?? 0, loading: current === null, error: current?.failed ?? false, loaded: state !== null };
}

/** The summary cards: totals over the window and its best design. */
export function useSummary(days: number) {
  const [summary, setSummary] = useState<{ analytics: Analytics; totals: HistoryTotals } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAnalytics(days), listSends({ outcome: "failed", days, limit: 1 })])
      .then(([analytics, failed]) => !cancelled && setSummary({ analytics, totals: toTotals(analytics, failed.total) }))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [days]);

  return summary;
}
