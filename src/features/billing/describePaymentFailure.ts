interface FailureShape {
  name?: string;
  message?: string;
  isAxiosError?: boolean;
  response?: { data?: { message?: unknown } };
}

/**
 * What to tell the person when starting or confirming a payment fails. The server's own wording
 * wins (it already says things like "refunded" or "log in"); raw library messages such as
 * "Request failed with status code 400" are never shown.
 */
export function describePaymentFailure(err: unknown, fallback = "The payment could not be completed. Please try again."): string {
  const failure = (err ?? {}) as FailureShape;
  const fromServer = failure.response?.data?.message;
  if (typeof fromServer === "string" && fromServer) return fromServer;
  // Checkout was closed after a failed attempt: the bank's or Razorpay's reason is the useful part.
  if (failure.name === "CheckoutFailedError" && failure.message) return `The payment didn't go through: ${failure.message}`;
  if (failure.isAxiosError) return "We couldn't reach the server. Check your connection and try again.";
  return failure.message || fallback;
}
