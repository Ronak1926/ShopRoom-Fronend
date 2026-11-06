import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fileNameFrom } from "./fileName.ts";

describe("fileNameFrom", () => {
  it("reads the name the server chose", () => {
    assert.equal(fileNameFrom('attachment; filename="shoproom-customer-data-2026-11-07.json"', "x.json"), "shoproom-customer-data-2026-11-07.json");
  });

  it("falls back when there is no header or no name in it", () => {
    assert.equal(fileNameFrom(undefined, "fallback.json"), "fallback.json");
    assert.equal(fileNameFrom("attachment", "fallback.json"), "fallback.json");
    assert.equal(fileNameFrom('attachment; filename=""', "fallback.json"), "fallback.json");
  });

  it("never lets a header choose a path outside the downloads folder", () => {
    assert.equal(fileNameFrom('attachment; filename="../../evil.json"', "fallback.json"), "fallback.json");
    assert.equal(fileNameFrom('attachment; filename="a\\b.json"', "fallback.json"), "fallback.json");
  });
});
