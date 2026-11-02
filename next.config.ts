import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const API_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
).origin;
const API_WS_ORIGIN = API_ORIGIN.replace(/^http/, "ws");

const IMAGE_HOSTS = [
  "https://res.cloudinary.com",
  "https://images.pexels.com",
  "https://images.unsplash.com",
  "https://plus.unsplash.com",
  "https://api.dicebear.com",
  "https://*.tile.openstreetmap.org",
  "https://unpkg.com",
];

/**
 * Content Security Policy.
 *
 * Inline scripts are allowed because Next.js emits inline bootstrap scripts;
 * removing 'unsafe-inline' needs per-request nonces, which forces every page to
 * render dynamically. Everything else is pinned: scripts load from our own
 * origin plus Razorpay Checkout and Firebase, connections go to our API and
 * Google, and the page can't be framed, re-based or posted to another origin.
 * In development React's refresh runtime also needs 'unsafe-eval'.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://www.gstatic.com https://apis.google.com`,
  "style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com",
  `img-src 'self' data: blob: ${IMAGE_HOSTS.join(" ")}`,
  "font-src 'self' data: https://fonts.gstatic.com",
  [
    "connect-src 'self'",
    API_ORIGIN,
    API_WS_ORIGIN,
    "https://*.googleapis.com",
    "https://*.firebaseio.com",
    "https://www.gstatic.com",
    "https://lumberjack.razorpay.com",
    "https://api.razorpay.com",
  ].join(" "),
  "frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.firebaseapp.com https://accounts.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // Geolocation stays available to our own pages: radius notifications and the map use it.
  { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=(self)" },
  // Firebase's Google sign-in popup needs to talk back to the opener.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
