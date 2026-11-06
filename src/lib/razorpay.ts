// Razorpay Checkout: the script is loaded on demand and attaches window.Razorpay.

interface RazorpayFailure {
  error: { code?: string; description?: string; reason?: string };
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayFailure) => void): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { email?: string };
  theme?: { color?: string };
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void; confirm_close?: boolean };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/** What the API returns when it creates an order. `mock` is only ever true outside production. */
export interface CheckoutOrder {
  orderId: string;
  /** Paise. */
  amount: number;
  currency: string;
  /** The public key; the secret never leaves the server. */
  keyId: string;
  mock?: boolean;
}

/** A payment Razorpay reports as made, with the signature the server checks before granting anything. */
export interface PaidPayment {
  orderId: string;
  paymentId: string;
  signature: string;
}

/** Checkout was closed after a payment attempt failed; `message` is the bank's or Razorpay's reason. */
export class CheckoutFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutFailedError";
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const SCRIPT_TIMEOUT_MS = 15_000;
const BRAND_COLOR = "#4329bb";

function loadCheckoutScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    const fail = () => {
      clearTimeout(timer);
      // Leave nothing behind, so the next attempt starts clean.
      script.remove();
      resolve(false);
    };
    const timer = setTimeout(fail, SCRIPT_TIMEOUT_MS);
    script.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };
    script.onerror = fail;
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay Checkout for an order the server created. Resolves with the payment to confirm,
 * or null when the person closes the window without paying. Rejects with a CheckoutFailedError
 * when they close it after a failed attempt, so the reason is not lost.
 */
export async function openCheckout(order: CheckoutOrder, details: { description: string; email?: string }): Promise<PaidPayment | null> {
  if (!(await loadCheckoutScript()) || !window.Razorpay) {
    throw new Error("Could not load the payment window. Check your connection and try again.");
  }
  const Razorpay = window.Razorpay;

  return new Promise((resolve, reject) => {
    let lastFailure: string | null = null;
    const checkout = new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "ShopRoom",
      description: details.description,
      order_id: order.orderId,
      prefill: { email: details.email },
      theme: { color: BRAND_COLOR },
      handler: (response) =>
        resolve({ orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature }),
      // Closing by accident in the middle of a payment is easy; ask first.
      modal: {
        confirm_close: true,
        ondismiss: () => (lastFailure ? reject(new CheckoutFailedError(lastFailure)) : resolve(null)),
      },
    });
    // A failed attempt does not close Checkout (the person can retry inside it), so only remember why.
    checkout.on("payment.failed", (response) => {
      lastFailure = response.error.description ?? response.error.reason ?? "The payment did not go through.";
    });
    checkout.open();
  });
}
