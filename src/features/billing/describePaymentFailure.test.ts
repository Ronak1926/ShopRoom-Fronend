import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describePaymentFailure } from "./describePaymentFailure.ts";

describe("describePaymentFailure", () => {
  it("prefers the server's own wording", () => {
    const err = { isAxiosError: true, message: "Request failed with status code 409", response: { data: { message: "Your payment has been refunded." } } };
    assert.equal(describePaymentFailure(err), "Your payment has been refunded.");
  });

  it("explains a closed Checkout with the reason it gave", () => {
    assert.equal(describePaymentFailure({ name: "CheckoutFailedError", message: "Card declined by the bank" }), "The payment didn't go through: Card declined by the bank");
  });

  it("never shows a raw library message for a connection problem", () => {
    const text = describePaymentFailure({ isAxiosError: true, message: "Network Error" });
    assert.match(text, /couldn't reach the server/);
    assert.ok(!text.includes("Network Error"));
  });

  it("keeps a plain error's message (like the payment window failing to load)", () => {
    assert.equal(describePaymentFailure(new Error("Could not load the payment window.")), "Could not load the payment window.");
  });

  it("falls back for anything else, including nothing at all", () => {
    assert.match(describePaymentFailure(undefined), /could not be completed/);
    assert.match(describePaymentFailure({}), /could not be completed/);
    assert.equal(describePaymentFailure(null, "Custom fallback"), "Custom fallback");
    assert.equal(describePaymentFailure({ response: { data: { message: 42 } }, name: "X" }, "Custom fallback"), "Custom fallback", "a non-text server message is ignored");
  });
});
