"use client";

import { useEffect, useState } from "react";
import { getCapabilities, type PlanCapabilities } from "@/features/notifications/api";

export interface PlanState {
  planType: string;
  capabilities: PlanCapabilities;
}

/**
 * The shop's plan and what it allows, for locking UI the plan doesn't include.
 *
 * `loading` is true until the request settles. If it fails, `plan` stays null and `loading` turns
 * false: callers then show the full UI, and the API still refuses anything outside the plan.
 * A screen whose layout depends on the plan (the Studio) waits for `loading` to end.
 */
export function usePlanCapabilities(): { plan: PlanState | null; loading: boolean } {
  const [state, setState] = useState<{ plan: PlanState | null; loading: boolean }>({ plan: null, loading: true });
  useEffect(() => {
    let cancelled = false;
    getCapabilities()
      .then(({ planType, capabilities }) => {
        if (!cancelled) setState({ plan: { planType, capabilities }, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ plan: null, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
