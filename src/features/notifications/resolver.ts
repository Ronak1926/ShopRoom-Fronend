/**
 * features/notifications/resolver.ts — Resolves {{ns.key}} tokens in a design
 * against a runtime context. Mirrors the backend resolver so the same design
 * renders identically. Only known tokens are substituted; nothing is evaluated.
 */

import type { RenderContext } from "./types";

const TOKEN = /\{\{\s*([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*\}\}/g;

export function resolveVariables(text: string, ctx: RenderContext): string {
  return text.replace(TOKEN, (_m, ns: string, key: string) => {
    const value = ctx[ns]?.[key];
    return value == null ? "" : String(value);
  });
}

export function resolveProductImage(
  variable: string | undefined,
  ctx: RenderContext,
): string | undefined {
  if (!variable) return undefined;
  const resolved = resolveVariables(variable, ctx);
  return resolved.trim() ? resolved : undefined;
}

/** Editor preview context — product image left blank so the slot shows its
 *  placeholder until a real product is attached at send time. */
export const EDITOR_CONTEXT: RenderContext = {
  product: { name: "Your Product", price: "₹1,299", oldPrice: "₹1,699", discount: "20%", stock: "24", id: "preview", image: "" },
  shop: { name: "Your Shop" },
  customer: { name: "there" },
};
