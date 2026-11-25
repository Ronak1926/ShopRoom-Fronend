/**
 * What quick edit (1 Month plan) lets a shopkeeper change in a design: every
 * piece of text and every product photo, nothing else. Mirrors the API rule in
 * ShopRoom-Backend utils/designEditRules.ts, which refuses any other change.
 */

import type { CompositionNode, NotificationDesign } from "@/features/notifications/types";

export interface QuickField {
  /** The element's id. */
  id: string;
  kind: "text" | "label" | "photo";
  label: string;
  /** The text, or the photo URL. */
  value: string;
}

/** Friendly names for the element ids the templates use. */
const LABELS: Record<string, string> = {
  "shop-name": "Shop name",
  "product-photo": "Product photo",
  "product-photo-2": "Second product photo",
  label: "Small heading",
  name: "Product name",
  headline: "Headline",
  product: "Product name",
  price: "Price",
  mrp: "Old price (struck through)",
  unit: "Unit",
  discount: "Discount",
  "discount-label": "Discount word",
  spec: "Detail line",
  info: "Info line",
  detail: "Detail line",
  stock: "Stock line",
  saving: "Saving",
  tag: "Tag",
  badge: "Badge",
  rating: "Rating",
  ends: "Offer ends",
  quote: "Customer quote",
  author: "Customer name",
  caption: "Photo caption",
  "cta-label": "Button",
  "stamp-text": "Stamp",
  "sticker-label": "Sticker word",
  "price-label": "Price heading",
  "order-code": "Order code",
  "best-value": "Best value tag",
  link: "Link text",
  ribbon: "Ribbon",
};

/** Elements that follow another field rather than being edited on their own. */
const SKIP = new Set(["shop-initial", "plus", "stars"]);

function humanise(id: string): string {
  const words = id.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function quickEditFields(design: NotificationDesign): QuickField[] {
  const photos: QuickField[] = [];
  const texts: QuickField[] = [];
  const visit = (node: CompositionNode) => {
    const label = node.name && !/^(TEXT|IMAGE|LABEL)$/i.test(node.name) ? node.name : LABELS[node.id] ?? humanise(node.id);
    if (node.asset?.type === "IMAGE" && node.asset.url) {
      photos.push({ id: node.id, kind: "photo", label, value: node.asset.url });
    } else if (!SKIP.has(node.id) && typeof node.content?.text === "string") {
      texts.push({ id: node.id, kind: "text", label, value: node.content.text });
    } else if (!SKIP.has(node.id) && typeof node.content?.label === "string") {
      texts.push({ id: node.id, kind: "label", label, value: node.content.label });
    }
    node.children?.forEach(visit);
  };
  design.elements.forEach(visit);
  return [...photos, ...texts];
}
