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
