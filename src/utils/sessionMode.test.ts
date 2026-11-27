import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { roleForPath, sessionFromResponse, tokenForRequest } from "./sessionMode.ts";

describe("roleForPath", () => {
  it("maps each area to its account and leaves shared pages alone", () => {
    assert.equal(roleForPath("/shopkeeper/dashboard"), "shopkeeper");
    assert.equal(roleForPath("/shopkeeper"), "shopkeeper");
    assert.equal(roleForPath("/customer/home"), "customer");
    assert.equal(roleForPath("/help"), null);
    assert.equal(roleForPath("/shopkeeperish"), null);
    assert.equal(roleForPath("/"), null);
  });
});

describe("tokenForRequest", () => {
  const stored: Record<string, string | null> = { customer: "cust-token", shopkeeper: "shop-token" };
  const read = (role: string) => stored[role];

  it("uses the token for the area the person is in", () => {
    assert.equal(tokenForRequest("/shopkeeper/billing", read), "shop-token");
    assert.equal(tokenForRequest("/customer/home", read), "cust-token");
  });

  it("falls back to whichever exists on shared pages, customer first", () => {
    assert.equal(tokenForRequest("/join/ABC", read), "cust-token");
    assert.equal(tokenForRequest("/join/ABC", (role) => (role === "shopkeeper" ? "shop-token" : null)), "shop-token");
    assert.equal(tokenForRequest("/help", () => null), null);
  });

  it("does not hand a customer token to a shopkeeper page", () => {
    assert.equal(tokenForRequest("/shopkeeper/members", (role) => (role === "customer" ? "cust-token" : null)), null);
  });
});

describe("sessionFromResponse", () => {
  it("takes the token from a sign-in answer and names the account type", () => {
    assert.deepEqual(sessionFromResponse("/api/customers/login", { token: "t1", customerId: "c1" }), { role: "customer", token: "t1" });
    assert.deepEqual(sessionFromResponse("/api/shopkeeper/login", { token: "t2", shopkeeperId: "s1", shopName: "X" }), { role: "shopkeeper", token: "t2" });
  });

  it("does not sign a new customer in at registration", () => {
    assert.equal(sessionFromResponse("/api/customers/register", { token: "t0", customerId: "c9" }), null);
  });

  it("takes the fresh token after a password change", () => {
    assert.deepEqual(sessionFromResponse("/api/customers/me/password", { token: "t3", message: "ok" }), { role: "customer", token: "t3" });
    assert.deepEqual(sessionFromResponse("/api/shopkeeper/me/password?x=1", { token: "t4" }), { role: "shopkeeper", token: "t4" });
  });

  it("ignores any other token field, such as a share link", () => {
    assert.equal(sessionFromResponse("/api/shop/room/share", { token: "share-token", link: "https://x" }), null);
    assert.equal(sessionFromResponse("/api/customers/forgot-password", { token: "x" }), null);
  });

  it("ignores empty, missing and non-object answers", () => {
    assert.equal(sessionFromResponse("/api/customers/login", { token: "", customerId: "c1" }), null);
    assert.equal(sessionFromResponse("/api/customers/login", { customerId: "c1" }), null);
    assert.equal(sessionFromResponse("/api/customers/login", null), null);
    assert.equal(sessionFromResponse("/api/customers/login", "text"), null);
    assert.equal(sessionFromResponse(undefined, { token: 5, customerId: "c1" }), null);
  });
});
