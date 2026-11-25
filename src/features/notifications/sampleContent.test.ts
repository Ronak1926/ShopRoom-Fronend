import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NotificationDesign } from "./types.ts";
import { usesSamplePhoto } from "./sampleContent.ts";

const frame = { x: 0, y: 0, width: 10, height: 10 };
const SAMPLE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=75&auto=format&fit=crop&cc=sample";
const OWN = "https://res.cloudinary.com/demo/image/upload/v1/shop/photo.jpg";

const design = (elements: unknown[]) => ({ elements }) as unknown as NotificationDesign;
const photo = (url: string) => ({ id: "p", type: "IMAGE", frame, asset: { type: "IMAGE", url } });

describe("usesSamplePhoto", () => {
  it("is true while a template's placeholder photo is still in the design, wherever it sits", () => {
    assert.equal(usesSamplePhoto(design([photo(SAMPLE)])), true);
    assert.equal(usesSamplePhoto(design([{ id: "c", type: "CONTAINER", frame, children: [photo(SAMPLE)] }])), true);
    assert.equal(usesSamplePhoto(design([photo(OWN), photo(SAMPLE)])), true, "one placeholder among the shop's own photos still counts");
  });

  it("is false once every photo is the shop's own, or there is none", () => {
    assert.equal(usesSamplePhoto(design([photo(OWN)])), false);
    assert.equal(usesSamplePhoto(design([{ id: "t", type: "TEXT", frame, content: { text: "cc=sample" } }])), false, "words are not photos");
    assert.equal(usesSamplePhoto(design([])), false);
    assert.equal(usesSamplePhoto(null), false);
  });

  it("ignores decorations that merely carry the marker text in an id", () => {
    assert.equal(usesSamplePhoto(design([{ id: "d", type: "DECORATION", frame, asset: { type: "SVG", assetId: "cc=sample" } }])), false);
  });
});
