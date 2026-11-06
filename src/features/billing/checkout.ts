/**
 * features/billing/checkout.ts — Taking a payment, from the opened order to the server's
 * confirmation. Sign-up and renewal both use it, so they behave identically: the same
 * mock handling in development, the same Checkout window, the same retry rules.
 */

import { openCheckout, type CheckoutOrder, type PaidPayment } from "@/lib/razorpay";
import { confirmWithRetry } from "./confirmWithRetry";

export { PaymentUnconfirmedError } from "./confirmWithRetry";
export { CheckoutFailedError } from "@/lib/razorpay";
export type { CheckoutOrder, PaidPayment };

/** Without Razorpay credentials the server issues a development order: no payment window, nothing charged. */
const developmentPayment = (order: CheckoutOrder): PaidPayment => ({
  orderId: order.orderId,
  paymentId: `pay_dev_${Date.now()}`,
  signature: "dev_signature",
});

/**
 * Opens Checkout for `order`, then asks `confirm` to settle the payment with the server.
 * Resolves with what `confirm` returns, or null when the person closed Checkout without paying.
 * Throws CheckoutFailedError if they closed it after a failed attempt, and PaymentUnconfirmedError
 * if they paid but the server could not be reached to confirm (it will complete by itself).
 */
export async function runCheckout<T>(options: {
  order: CheckoutOrder;
  description: string;
  email?: string;
  confirm: (payment: PaidPayment) => Promise<T>;
}): Promise<T | null> {
  const { order, description, email, confirm } = options;
  const payment = order.mock ? developmentPayment(order) : await openCheckout(order, { description, email });
  if (!payment) return null;
  return confirmWithRetry(() => confirm(payment), payment.paymentId);
}
