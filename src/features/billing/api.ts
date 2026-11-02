/**
 * features/billing/api.ts — A shopkeeper's plan: view it, pay to renew it.
 * Every call is shopkeeper-authenticated (token from the shopkeeper cookie).
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import { payWithRazorpay, type CheckoutOrder } from "@/lib/razorpay";

function authConfig() {
  return { headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` } };
}

export type PlanId = "1m" | "2m" | "3m";

export interface Billing {
  planType: string;
  planExpiresAt: string;
  active: boolean;
  /** Whole days left, 0 once expired. */
  daysLeft: number;
  plans: { id: PlanId; label: string; priceInr: number; days: number }[];
  payments: { id: string; purpose: "REGISTRATION" | "RENEWAL"; planType: string; amountInr: number; paidAt: string }[];
}

export async function fetchBilling(): Promise<Billing> {
  const { data } = await apiClient.get<{ data: Billing }>("/api/shopkeeper/billing", authConfig());
  return data.data;
}

/**
 * Takes payment for a renewal and confirms it with the server. Resolves with the
 * updated billing, or null when the shopkeeper closed the payment window.
 */
export async function renewPlan(planId: PlanId, description: string): Promise<Billing | null> {
  const order = (await apiClient.post<{ data: CheckoutOrder }>("/api/shopkeeper/billing/order", { planType: planId }, authConfig())).data.data;

  // Without Razorpay credentials the server hands out a development order: confirm it without a payment window.
  const payment = order.mock
    ? { razorpay_order_id: order.orderId, razorpay_payment_id: `pay_dev_${Date.now()}`, razorpay_signature: "dev_signature" }
    : await payWithRazorpay(order, { description });
  if (!payment) return null;

  const { data } = await apiClient.post<{ data: Billing }>(
    "/api/shopkeeper/billing/verify",
    {
      planType: planId,
      razorpayOrderId: payment.razorpay_order_id,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpaySignature: payment.razorpay_signature,
    },
    authConfig(),
  );
  return data.data;
}
