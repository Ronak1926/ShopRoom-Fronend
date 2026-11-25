/**
 * features/notifications/plan.ts — Which plan unlocks what, for showing locks
 * and upgrade prompts. The API enforces every rule; this only mirrors it so the
 * UI never offers something the server would refuse.
 */

const PLAN_RANK: Record<string, number> = { "1m": 1, "2m": 2, "3m": 3 };

export const PLAN_NAMES: Record<string, string> = { "1m": "1 Month", "2m": "2 Months", "3m": "3 Months" };

export const UPGRADE_HREF = "/shopkeeper/billing";

/** True when `planType` includes something that needs `requiredPlan` (null means every plan). */
export function meetsRequiredPlan(planType: string | null | undefined, requiredPlan: string | null | undefined): boolean {
  if (!requiredPlan || !PLAN_RANK[requiredPlan]) return true;
  return (PLAN_RANK[planType ?? ""] ?? 1) >= PLAN_RANK[requiredPlan];
}
