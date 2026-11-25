import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PaymentUnconfirmedError, RETRY_DELAYS_MS, confirmWithRetry, isTransientError } from "./confirmWithRetry.ts";

const http = (status: number) => ({ response: { status } });
const network = () => new Error("Network Error");

describe("isTransientError", () => {
  it("retries what can pass on its own", () => {
    for (const err of [network(), http(500), http(502), http(503), http(429), http(408)]) assert.equal(isTransientError(err), true, JSON.stringify(err));
  });

  it("does not retry a definite answer", () => {
    for (const err of [http(400), http(401), http(403), http(404), http(409), http(422)]) assert.equal(isTransientError(err), false, JSON.stringify(err));
  });

  it("treats anything that is not an HTTP response as a connection problem", () => {
    assert.equal(isTransientError(null), true);
    assert.equal(isTransientError(undefined), true);
    assert.equal(isTransientError("boom"), true);
  });
});

describe("confirmWithRetry", () => {
  const noWait = async () => undefined;

  it("returns the first success without waiting", async () => {
    const waits: number[] = [];
    const result = await confirmWithRetry(async () => "done", "pay_1", async (ms) => void waits.push(ms));
    assert.equal(result, "done");
    assert.deepEqual(waits, []);
  });

  it("recovers from a dropped connection and backs off between tries", async () => {
    let calls = 0;
    const waits: number[] = [];
    const result = await confirmWithRetry(
      async () => {
        calls += 1;
        if (calls < 3) throw network();
        return "ok";
      },
      "pay_1",
      async (ms) => void waits.push(ms),
    );
    assert.equal(result, "ok");
    assert.equal(calls, 3);
    assert.deepEqual(waits, [RETRY_DELAYS_MS[0], RETRY_DELAYS_MS[1]]);
  });

  it("says the payment was received, rather than failing, when the server stays unreachable", async () => {
    let calls = 0;
    const rejected = await confirmWithRetry(async () => { calls += 1; throw http(503); }, "pay_Lost1", noWait).catch((e: unknown) => e);
    assert.ok(rejected instanceof PaymentUnconfirmedError);
    assert.equal(rejected.paymentId, "pay_Lost1");
    assert.equal(calls, RETRY_DELAYS_MS.length + 1, "the first try plus every retry, and then it stops");
  });

  it("passes a definite refusal straight through, without retrying it", async () => {
    let calls = 0;
    const refusal = http(409);
    const rejected = await confirmWithRetry(async () => { calls += 1; throw refusal; }, "pay_1", noWait).catch((e: unknown) => e);
    assert.equal(rejected, refusal);
    assert.equal(calls, 1);
  });
});
