"use client";

import { useEffect, useState } from "react";
import { getCapabilities, type PlanCapabilities } from "@/features/notifications/api";

export interface PlanState {
  planType: string;
  capabilities: PlanCapabilities;
}

/**
 * The shop's plan and what it allows, for locking UI the plan doesn't include.
 * Null while loading or if the request fails: callers then show the full UI
 * and the API still refuses anything outside the plan.
 */
export function usePlanCapabilities(): PlanState | null {
  const [plan, setPlan] = useState<PlanState | null>(null);
  useEffect(() => {
    let cancelled = false;
    getCapabilities()
      .then(({ planType, capabilities }) => {
        if (!cancelled) setPlan({ planType, capabilities });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return plan;
}
