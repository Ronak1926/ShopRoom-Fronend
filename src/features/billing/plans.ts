/**
 * features/billing/plans.ts — What each shopkeeper plan costs and includes, as
 * advertised. Checkout, the pricing section and the structured data all read it.
 *
 * Prices and perks mirror the API (ShopRoom-Backend services/plans.ts and
 * notificationPlan.service.ts), which is what actually charges and enforces them.
 */

export type PlanId = "1m" | "2m" | "3m";

export interface PlanOffer {
  id: PlanId;
  label: string;
  /** Rupees. */
  price: number;
  days: number;
  /** One line shown under the plan name at checkout. */
  description: string;
  /** What the plan adds to the one before it (everything is cumulative). */
  perks: string[];
  recommended?: true;
}

/** Included in every plan. */
export const COMMON_PERKS = [
  "Your own room with a shareable invite link",
  "Unlimited members and real-time chat",
  "Animated notification banners, sent now or scheduled",
  "Delivery, open and tap analytics",
];

export const PLAN_OFFERS: PlanOffer[] = [
  {
    id: "1m",
    label: "1 Month",
    price: 499,
    days: 30,
    description: "Try CounterCircle for a month",
    perks: ["1 notification a day, to your room members", "50+ ready-made templates", "Quick edit: your words and photos"],
  },
  {
    id: "2m",
    label: "2 Months",
    price: 899,
    days: 60,
    description: "Most popular choice",
    perks: ["2 notifications a day", "Reach customers within 5 km", "150+ templates", "Custom templates and the full editor"],
    recommended: true,
  },
  {
    id: "3m",
    label: "3 Months",
    price: 1199,
    days: 90,
    description: "Best value for money",
    perks: ["4 notifications a day", "Reach customers within 10 km", "All 1,400+ templates", "Custom templates and the full editor", "Custom animations"],
  },
];

/** One row of the plan comparison: what each plan gets (true / false, or a short value). */
export interface PlanFeature {
  label: string;
  /** Shown under the label in the comparison table. */
  hint?: string;
  values: Record<PlanId, string | boolean>;
}

/**
 * What each plan includes, as enforced by the API (notificationPlan.service.ts
 * and the template catalog's plan tiers). The billing page's plan cards and
 * comparison table read this.
 */
export const PLAN_FEATURES: PlanFeature[] = [
  { label: "Notifications a day", values: { "1m": "1", "2m": "2", "3m": "4" } },
  {
    label: "Who you can reach",
    hint: "Nearby customers are those sharing their location in the app",
    values: { "1m": "Room members", "2m": "Room + within 5 km", "3m": "Room + within 10 km" },
  },
  { label: "Ready-made templates", values: { "1m": "50+", "2m": "150+", "3m": "All 1,400+" } },
  {
    label: "Editing",
    values: { "1m": "Quick edit: your words and photos", "2m": "Full editor", "3m": "Full editor" },
  },
  { label: "Design from a blank canvas", values: { "1m": false, "2m": true, "3m": true } },
  { label: "Custom animations", values: { "1m": false, "2m": false, "3m": true } },
  { label: "Scheduled and repeating sends", values: { "1m": true, "2m": true, "3m": true } },
  { label: "Your room, members and chat", values: { "1m": true, "2m": true, "3m": true } },
  { label: "Delivery, open and tap analytics", values: { "1m": true, "2m": true, "3m": true } },
];

/** What a plan works out to per month, rounded to the rupee. */
export function pricePerMonth(offer: PlanOffer): number {
  return Math.round(offer.price / (offer.days / 30));
}

/** How much a longer plan saves against buying 1 Month repeatedly for the same time. */
export function savingVersusMonthly(offer: PlanOffer): number {
  const monthly = PLAN_OFFERS.find((p) => p.id === "1m");
  if (!monthly || offer.id === "1m") return 0;
  return Math.max(0, Math.round(monthly.price * (offer.days / monthly.days)) - offer.price);
}
