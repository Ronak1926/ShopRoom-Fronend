import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { timeAgo } from "./timeAgo.ts";

const NOW = Date.parse("2026-11-03T12:00:00Z");
const ago = (ms: number) => new Date(NOW - ms).toISOString();

describe("timeAgo", () => {
  it("reads naturally at each scale", () => {
    assert.equal(timeAgo(ago(10_000), NOW), "just now");
    assert.equal(timeAgo(ago(5 * 60_000), NOW), "5 min ago");
    assert.equal(timeAgo(ago(3 * 3_600_000 + 5_000), NOW), "3 h ago");
    assert.equal(timeAgo(ago(2 * 86_400_000), NOW), "2 d ago");
  });

  it("shows a date after a week", () => {
    assert.match(timeAgo(ago(10 * 86_400_000), NOW), /\d/);
    assert.ok(!timeAgo(ago(10 * 86_400_000), NOW).includes("ago"));
  });

  it("never goes negative for a timestamp slightly in the future", () => {
    assert.equal(timeAgo(new Date(NOW + 5_000).toISOString(), NOW), "just now");
  });
});
