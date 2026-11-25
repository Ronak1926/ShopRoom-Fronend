import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeSecurityEvent } from "./describeSecurityEvent.ts";

describe("describeSecurityEvent", () => {
  it("says how someone signed in", () => {
    assert.equal(describeSecurityEvent({ type: "LOGIN_SUCCESS", detail: { method: "google" } }).label, "Signed in with Google");
    assert.equal(describeSecurityEvent({ type: "LOGIN_SUCCESS", detail: { method: "password" } }).label, "Signed in");
    assert.equal(describeSecurityEvent({ type: "LOGIN_SUCCESS", detail: null }).warning, false);
  });

  it("flags the events a person should look at twice", () => {
    for (const type of ["LOGIN_FAILED", "REAUTH_FAILED", "MFA_FAILED", "MFA_DISABLED", "MFA_RECOVERY_USED"]) {
      assert.equal(describeSecurityEvent({ type, detail: null }).warning, true, type);
    }
    for (const type of ["PASSWORD_CHANGED", "SESSIONS_REVOKED", "DATA_EXPORTED", "MFA_ENABLED"]) {
      assert.equal(describeSecurityEvent({ type, detail: null }).warning, false, type);
    }
  });

  it("names what a wrong password was for, and copes with a detail it does not know", () => {
    assert.equal(describeSecurityEvent({ type: "REAUTH_FAILED", detail: { action: "export_data" } }).label, "Wrong password when downloading data");
    assert.equal(describeSecurityEvent({ type: "REAUTH_FAILED", detail: { action: "something_new" } }).label, "Wrong password when confirming an action");
    assert.equal(describeSecurityEvent({ type: "FROM_THE_FUTURE", detail: null }).label, "Account activity");
  });
});
