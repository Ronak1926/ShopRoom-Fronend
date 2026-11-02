import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_AFTER_AUTH, safeNextPath } from "./safeRedirect.ts";

describe("safeNextPath", () => {
  it("honours an invite link and the customer pages", () => {
    assert.equal(safeNextPath("/join/AB12CD34"), "/join/AB12CD34");
    assert.equal(safeNextPath("/customer/myrooms"), "/customer/myrooms");
    assert.equal(safeNextPath("/customer/room/cmabc123def456"), "/customer/room/cmabc123def456");
  });

  it("falls back for anything missing", () => {
    assert.equal(safeNextPath(null), DEFAULT_AFTER_AUTH);
    assert.equal(safeNextPath(undefined), DEFAULT_AFTER_AUTH);
    assert.equal(safeNextPath(""), DEFAULT_AFTER_AUTH);
  });

  it("never sends anyone off-site", () => {
    for (const evil of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "javascript:alert(1)",
      "/join/ABCD1234/../../evil",
      "/join/ABCD1234?x=1",
      "/join/ABCD1234#x",
      "/join/ABC",
      "/shopkeeper/dashboard",
      "/customer/home/../../x",
      " /customer/home",
    ]) {
      assert.equal(safeNextPath(evil), DEFAULT_AFTER_AUTH, evil);
    }
  });

  it("uses the given fallback", () => {
    assert.equal(safeNextPath("https://evil.example", "/customer/myrooms"), "/customer/myrooms");
  });
});
