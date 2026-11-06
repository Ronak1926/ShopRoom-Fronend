import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPaise } from "./formatPaise.ts";

describe("formatPaise", () => {
  it("prints rupees with two decimals and Indian digit grouping", () => {
    assert.equal(formatPaise(33_814), "₹338.14");
    assert.equal(formatPaise(39_900), "₹399.00");
    assert.equal(formatPaise(5), "₹0.05");
    assert.equal(formatPaise(0), "₹0.00");
    assert.equal(formatPaise(123_456_789), "₹12,34,567.89");
  });
});
