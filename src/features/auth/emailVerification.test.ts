import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { clearVerification, readVerification, saveVerification } from "./emailVerification.ts";

describe("emailVerification", () => {
  beforeEach(() => {
    const data = new Map<string, string>();
    (globalThis as unknown as { window: unknown }).window = {
      sessionStorage: {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => void data.set(k, v),
        removeItem: (k: string) => void data.delete(k),
      },
    };
  });

  it("returns the token saved for the same address, ignoring case and spaces", () => {
    saveVerification("  Asha@Example.com ", "tok-1");
    assert.equal(readVerification("asha@example.com"), "tok-1");
  });

  it("never hands one address's token to another", () => {
    saveVerification("asha@example.com", "tok-1");
    assert.equal(readVerification("someone.else@example.com"), null);
  });

  it("forgets the token once cleared, and when nothing was saved", () => {
    assert.equal(readVerification("asha@example.com"), null);
    saveVerification("asha@example.com", "tok-1");
    clearVerification();
    assert.equal(readVerification("asha@example.com"), null);
  });

  it("ignores damaged storage", () => {
    (globalThis as unknown as { window: { sessionStorage: { getItem: () => string } } }).window.sessionStorage.getItem = () => "{not json";
    assert.equal(readVerification("asha@example.com"), null);
  });
});
