import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildTapHash, parseTapHash } from "./tapLink.ts";

const TOKEN = "3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b";

describe("tap link fragment", () => {
  it("round-trips a send reference with its receipt token", () => {
    const hash = buildTapHash("send_abc123", TOKEN);
    assert.equal(hash, `#push=send_abc123:${TOKEN}`);
    assert.deepEqual(parseTapHash(hash), { sendId: "send_abc123", receiptToken: TOKEN });
  });

  it("works without a receipt token", () => {
    assert.equal(buildTapHash("send_abc123"), "#push=send_abc123");
    assert.deepEqual(parseTapHash("#push=send_abc123"), { sendId: "send_abc123", receiptToken: undefined });
  });

  it("drops a malformed receipt token instead of embedding it", () => {
    assert.equal(buildTapHash("send_abc123", "not-a-uuid"), "#push=send_abc123");
  });

  it("builds nothing for a send id that is not an id", () => {
    for (const bad of ["", "a/b", "a b", "x".repeat(65), "<script>", "../x"]) {
      assert.equal(buildTapHash(bad, TOKEN), "", JSON.stringify(bad));
    }
  });

  it("ignores every fragment that is not a well-formed reference", () => {
    for (const hash of [
      "",
      "#",
      "#section-2",
      "#push=",
      "#push=a/b",
      "#push=has space",
      `#push=${"x".repeat(65)}`,
      "#push=send_abc123:not-a-uuid",
      `#push=send_abc123:${TOKEN}:extra`,
      "#push=<img src=x onerror=alert(1)>",
      "#push=javascript:alert(1)",
      `#other=send_abc123:${TOKEN}`,
    ]) {
      assert.equal(parseTapHash(hash), null, JSON.stringify(hash));
    }
  });
});
