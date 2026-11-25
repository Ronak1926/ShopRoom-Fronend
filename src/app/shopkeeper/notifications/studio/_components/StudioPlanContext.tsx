"use client";

import { createContext, useContext } from "react";

/**
 * What the shop's plan lets the Studio do. Defaults to everything allowed, so
 * the editor works while the plan loads; the API refuses anything outside it.
 */
export interface StudioPlan {
  /** Custom animation (3 Months): change or add element animations. */
  canAnimate: boolean;
}

const StudioPlanContext = createContext<StudioPlan>({ canAnimate: true });

export const StudioPlanProvider = StudioPlanContext.Provider;

export function useStudioPlan(): StudioPlan {
  return useContext(StudioPlanContext);
}

export const CUSTOM_ANIMATION_LOCKED =
  "Custom animations are part of the 3 Months plan. Elements keep the animation their template came with.";
