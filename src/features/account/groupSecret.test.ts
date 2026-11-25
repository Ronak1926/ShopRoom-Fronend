import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { groupSecret } from "./groupSecret.ts";

describe("groupSecret", () => {
  it("groups a secret in fours so it can be typed into an app", () => {
    assert.equal(groupSecret("JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"), "JBSW Y3DP EHPK 3PXP JBSW Y3DP EHPK 3PXP");
    assert.equal(groupSecret("ABCDE"), "ABCD E");
    assert.equal(groupSecret(""), "");
  });
});
