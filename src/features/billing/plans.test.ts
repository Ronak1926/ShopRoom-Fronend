import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMMON_PERKS, PLAN_OFFERS } from "./plans.ts";

// These are the amounts the API charges (ShopRoom-Backend services/plans.ts), in rupees.
// If the backend prices change, this test and the catalogue must change with them.
const CHARGED = { "1m": 399, "2m": 599, "3m": 899 } as const;
const DAYS = { "1m": 30, "2m": 60, "3m": 90 } as const;

describe("plan catalogue", () => {
  it("advertises exactly what checkout charges and for how long", () => {
    assert.deepEqual(PLAN_OFFERS.map((p) => p.id), ["1m", "2m", "3m"]);
    for (const plan of PLAN_OFFERS) {
      assert.equal(plan.price, CHARGED[plan.id], `${plan.id} price`);
      assert.equal(plan.days, DAYS[plan.id], `${plan.id} days`);
    }
  });

  it("gets more expensive as the plan gets longer, and exactly one is recommended", () => {
    const prices = PLAN_OFFERS.map((p) => p.price);
    assert.deepEqual([...prices].sort((a, b) => a - b), prices);
    assert.equal(PLAN_OFFERS.filter((p) => p.recommended).length, 1);
  });

  it("gives every plan something to say, and never promises a free trial or a free shopkeeper plan", () => {
    for (const plan of PLAN_OFFERS) assert.ok(plan.perks.length > 0 && plan.label && plan.description);
    const everything = JSON.stringify([PLAN_OFFERS, COMMON_PERKS]).toLowerCase();
    assert.ok(!/free trial|7-day|free plan|auto-?renew(?!al)/.test(everything.replace("no auto-renewal", "")));
  });
});
