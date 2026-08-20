"use client";

/**
 * components/notifications/StaticImageNode.tsx — Renders a literal, uploaded
 * or stock image (node.asset.url), as opposed to the dynamic per-send
 * product-photo binding renderLeaf resolves via resolveProductImage. Handles
 * non-destructive crop, CSS filters and a colour/gradient overlay. Masking
 * (clipShape) and border-radius are applied by the caller's outer wrapper via
 * buildNodeStyle, same mechanism badges already use.
 */

import type { CSSProperties } from "react";
import type { CompositionNode } from "@/features/notifications/types";
import { imageCropStyle, imageFilterCss, imageOverlayStyle } from "./nodeStyle";

export default function StaticImageNode({ node }: { node: CompositionNode }) {
  const asset = node.asset!;
  const image = node.image ?? {};

  const imgStyle: CSSProperties = image.crop
    ? imageCropStyle(image.crop)
    : { width: "100%", height: "100%", objectFit: image.fit ?? "cover", objectPosition: image.position ?? "center" };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded/stock URL, not a static asset */}
      <img
        src={asset.url}
        alt={asset.attribution?.photographer ? `Photo by ${asset.attribution.photographer}` : ""}
        style={{ ...imgStyle, opacity: image.opacity ?? 1, filter: imageFilterCss(image.filters) }}
      />
      {image.overlay && <div style={imageOverlayStyle(image.overlay)} />}
    </div>
  );
}
