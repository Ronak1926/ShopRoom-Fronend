"use client";

import { useEffect, useState } from "react";
import { listSends, type DesignSummary, type SendHistoryItem } from "@/features/notifications/api";
import { fetchAnalytics, type Analytics } from "@/features/notifications/insights";
import { buildMetrics, type NotificationMetrics } from "../_data/metrics";

const RECENT_SENDS = 4;

/**
 * Measured notification results for the dashboard. The previous window's figures stay
 * on screen while a new range loads, so changing the range never blanks the page.
 */
export function useDashboardMetrics(days: number, designs: DesignSummary[]) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [sends, setSends] = useState<SendHistoryItem[]>([]);
  const [failedDays, setFailedDays] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAnalytics(days), listSends({ limit: RECENT_SENDS })])
      .then(([summary, recent]) => {
        if (cancelled) return;
        setFailedDays(null);
        setAnalytics(summary);
        setSends(recent.items);
      })
      .catch(() => {
        if (!cancelled) setFailedDays(days);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const metrics: NotificationMetrics | null = analytics ? buildMetrics(analytics, sends, designs) : null;
  return { metrics, error: failedDays === days };
}
