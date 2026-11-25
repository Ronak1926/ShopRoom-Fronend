/**
 * features/billing/api.ts — A shopkeeper's plan: view it, pay to renew it.
 * Every call is shopkeeper-authenticated (token from the shopkeeper cookie).
 */

import { apiClient } from "@/utils/apiClient";
import { runCheckout, type CheckoutOrder } from "./checkout";

export type PlanId = "1m" | "2m" | "3m";

export interface Billing {
  planType: string;
  planExpiresAt: string;
  active: boolean;
  /** Whole days left, 0 once expired. */
  daysLeft: number;
  plans: { id: PlanId; label: string; priceInr: number; days: number }[];
  /** The GSTIN printed as the buyer's on new invoices. */
  gstin: string | null;
  /** True when the business has set up GST invoicing. */
  invoicesEnabled: boolean;
  payments: { id: string; purpose: "REGISTRATION" | "RENEWAL"; planType: string; amountInr: number; paidAt: string; refunded: boolean }[];
}

export async function fetchBilling(): Promise<Billing> {
  const { data } = await apiClient.get<{ data: Billing }>("/api/shopkeeper/billing");
  return data.data;
}

/**
 * Takes payment for a renewal and confirms it with the server. Resolves with the updated billing,
 * or null when the shopkeeper closed the payment window.
 */
export async function renewPlan(planId: PlanId, description: string): Promise<Billing | null> {
  const order = (await apiClient.post<{ data: CheckoutOrder }>("/api/shopkeeper/billing/order", { planType: planId })).data.data;

  return runCheckout({
    order,
    description,
    confirm: async (payment) => {
      const { data } = await apiClient.post<{ data: Billing }>("/api/shopkeeper/billing/verify", {
        razorpayOrderId: payment.orderId,
        razorpayPaymentId: payment.paymentId,
        razorpaySignature: payment.signature,
      });
      return data.data;
    },
  });
}
