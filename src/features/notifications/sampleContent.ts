/**
 * features/notifications/sampleContent.ts — Spotting a banner that still carries a template's
 * placeholder photo, so a shop is warned before it sends someone else's product to its customers.
 *
 * Template photos are stock images tagged with `cc=sample` in their URL (ShopRoom-Backend
 * prisma/templates/kit.ts). The CDN ignores the tag; a photo the shop uploads or picks has a
 * different URL, so replacing the photo removes the marker.
 */

import type { CompositionNode, NotificationDesign } from "./types";

export const SAMPLE_PHOTO_MARKER = "cc=sample";

export const SAMPLE_PHOTO_WARNING =
  "This banner still shows the sample photo from the template. Replace it with a photo of your own product in the Notification Studio, so customers see what you actually sell.";

function hasSamplePhoto(nodes: CompositionNode[]): boolean {
  return nodes.some((node) => {
    const url = node.asset?.type === "IMAGE" ? node.asset.url : undefined;
    return (!!url && url.includes(SAMPLE_PHOTO_MARKER)) || hasSamplePhoto(node.children ?? []);
  });
}

/** True when any photo in the design is still a template's placeholder. */
export function usesSamplePhoto(design: NotificationDesign | null | undefined): boolean {
  return !!design && hasSamplePhoto(design.elements ?? []);
}
