import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NotificationDesign } from "../../../../../features/notifications/types.ts";
import { quickEditFields } from "./quickEditFields.ts";

const frame = { x: 0, y: 0, width: 10, height: 10 };

const design = {
  schemaVersion: 2, id: "d", name: "D", category: "OFFER", status: "DRAFT",
  canvas: { width: 400, height: 200, background: { type: "SOLID", color: "#000" } },
  metadata: { createdAt: "", updatedAt: "", source: "SHOPROOM_TEMPLATE" },
  elements: [
    { id: "backdrop", type: "RECTANGLE", frame },
    { id: "product-photo", type: "IMAGE", frame, asset: { type: "IMAGE", url: "https://images.unsplash.com/a" } },
    {
      id: "shop", type: "CONTAINER", frame,
      children: [
        { id: "shop-initial", type: "LABEL", frame, content: { text: "R" } },
        { id: "shop-name", type: "TEXT", frame, content: { text: "Riya Boutique" } },
      ],
    },
    { id: "name", type: "TEXT", frame, content: { text: "Silk Saree" } },
    { id: "stars", type: "TEXT", frame, content: { text: "★★★★★" } },
    { id: "row-1-item", type: "TEXT", frame, content: { text: "Tomato" } },
    { id: "cta", type: "BUTTON", frame, children: [{ id: "cta-label", type: "TEXT", frame, content: { label: "Shop now" } }] },
    { id: "bg-glow", type: "DECORATION", frame, asset: { type: "SVG", assetId: "glow" } },
  ],
} as unknown as NotificationDesign;

describe("quickEditFields", () => {
  it("lists every photo first, then every piece of text, with friendly names", () => {
    assert.deepEqual(quickEditFields(design), [
      { id: "product-photo", kind: "photo", label: "Product photo", value: "https://images.unsplash.com/a" },
      { id: "shop-name", kind: "text", label: "Shop name", value: "Riya Boutique" },
      { id: "name", kind: "text", label: "Product name", value: "Silk Saree" },
      { id: "row-1-item", kind: "text", label: "Row 1 item", value: "Tomato" },
      { id: "cta-label", kind: "label", label: "Button", value: "Shop now" },
    ]);
  });

  it("leaves out decorations, shapes and the shop initial (it follows the shop name)", () => {
    const ids = quickEditFields(design).map((f) => f.id);
    for (const id of ["backdrop", "bg-glow", "shop-initial", "stars", "shop", "cta"]) assert.ok(!ids.includes(id), id);
  });
});
