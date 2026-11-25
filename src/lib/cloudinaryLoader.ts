/**
 * Image loader for next/image that lets Cloudinary do the resizing.
 *
 * Cloudinary's own CDN can deliver an image already cropped to the width the
 * browser asked for, in the best format it supports (f_auto: AVIF/WebP) at an
 * automatic quality (q_auto). That is cheaper than routing every image through
 * this app's /_next/image optimiser, which would download the full-size original
 * first. URLs from other hosts are returned unchanged.
 *
 *   <Image loader={cloudinaryLoader} src={url} fill sizes="…" alt="…" />
 */

const CLOUDINARY_UPLOAD_URL = /^(https:\/\/res\.cloudinary\.com\/[^/?#]+\/image\/upload\/)(.+)$/;

export interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export function cloudinaryLoader({ src, width, quality }: ImageLoaderParams): string {
  const match = CLOUDINARY_UPLOAD_URL.exec(src);
  if (!match) return src;
  const [, base, rest] = match;
  // c_limit only ever shrinks: a small original is never upscaled.
  return `${base}f_auto,q_${quality ?? "auto"},c_limit,w_${Math.round(width)}/${rest}`;
}
