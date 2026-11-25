/**
 * The most important sentence in the payment flow: money has already left the buyer's account
 * when we ask the server to confirm. So a confirmation that fails because of a dropped
 * connection or a server hiccup is retried (it is safe: the server grants a payment once), and
 * if it still fails the buyer is told the payment WAS received, never invited to pay again.
 */

/** The payment was made but we could not confirm it. Razorpay's webhook will complete it. */
export class PaymentUnconfirmedError extends Error {
  paymentId: string;

  constructor(paymentId: string) {
    super("Payment received, but we could not confirm it yet.");
    this.name = "PaymentUnconfirmedError";
    this.paymentId = paymentId;
  }
}

/** Network failures and server-side errors can pass on a retry; a definite answer (400, 409) cannot. */
export function isTransientError(err: unknown): boolean {
  const response = (err as { response?: { status?: number } } | null)?.response;
  if (!response) return true;
  const status = response.status ?? 0;
  return status >= 500 || status === 429 || status === 408;
}

/** Waits before each retry; the first attempt is immediate. */
export const RETRY_DELAYS_MS = [1500, 4000, 9000] as const;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function confirmWithRetry<T>(
  confirm: () => Promise<T>,
  paymentId: string,
  wait: (ms: number) => Promise<void> = sleep,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await confirm();
    } catch (err) {
      if (!isTransientError(err)) throw err;
      const delay = RETRY_DELAYS_MS[attempt];
      if (delay === undefined) throw new PaymentUnconfirmedError(paymentId);
      await wait(delay);
    }
  }
}
