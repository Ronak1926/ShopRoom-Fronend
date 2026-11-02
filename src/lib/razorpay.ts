// Razorpay Checkout: the script is loaded on demand and attaches window.Razorpay.
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

/** What the API returns when it creates an order. `mock` is only ever true outside production. */
export interface CheckoutOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  mock?: boolean;
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const BRAND_COLOR = "#4329bb";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay Checkout for an order the server created. Resolves with the
 * signed payment details to send back for verification, or null when the person
 * closes the window without paying.
 */
export async function payWithRazorpay(
  order: CheckoutOrder,
  details: { description: string; email?: string },
): Promise<RazorpaySuccessResponse | null> {
  if (!(await loadRazorpayScript()) || !window.Razorpay) {
    throw new Error("Could not load the payment window. Check your connection and try again.");
  }
  const Razorpay = window.Razorpay;
  return new Promise((resolve) => {
    new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "ShopRoom",
      description: details.description,
      order_id: order.orderId,
      prefill: { email: details.email },
      theme: { color: BRAND_COLOR },
      handler: resolve,
      modal: { ondismiss: () => resolve(null) },
    }).open();
  });
}
