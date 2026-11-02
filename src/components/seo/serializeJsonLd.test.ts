import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { serializeJsonLd } from "./serializeJsonLd.ts";

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

describe("serializeJsonLd", () => {
  it("round-trips ordinary data", () => {
    const data = { "@type": "Question", name: "What is ShopRoom?", n: 3, nested: { ok: true } };
    assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
  });

  it("cannot be used to close the script tag or open a comment", () => {
    const hostile = { text: "</script><script>alert(1)</script><!-- x -->" };
    const out = serializeJsonLd(hostile);
    assert.ok(!out.includes("<"), out);
    assert.equal(JSON.parse(out).text, hostile.text, "the value itself is preserved");
  });

  it("escapes the line separators JSON allows but JavaScript string literals did not", () => {
    const text = `a${LS}b${PS}c`;
    const out = serializeJsonLd({ text });
    assert.ok(!out.includes(LS) && !out.includes(PS));
    assert.equal(JSON.parse(out).text, text);
  });
});
