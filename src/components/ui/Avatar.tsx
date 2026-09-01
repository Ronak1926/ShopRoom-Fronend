"use client";

import { useState } from "react";
import StatusDot from "./StatusDot";

const AVATAR_COLORS = [
  "var(--color-avatar-1)",
  "var(--color-avatar-2)",
  "var(--color-avatar-3)",
  "var(--color-avatar-4)",
  "var(--color-avatar-5)",
  "var(--color-avatar-6)",
  "var(--color-avatar-7)",
  "var(--color-avatar-8)",
];

function hashToIndex(input: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % mod;
}

/** Deterministic `var(--color-avatar-N)` string for a given name — reusable
 * outside React (e.g. Leaflet marker HTML strings) so every avatar in the
 * app, React-rendered or not, hashes to the same color for the same name. */
export function getAvatarColor(name: string): string {
  return AVATAR_COLORS[hashToIndex(name || "?", AVATAR_COLORS.length)];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZE_MAP = {
  xs: { box: "w-6 h-6", text: "text-[9px]", dot: 6 },
  sm: { box: "w-8 h-8", text: "text-[11px]", dot: 8 },
  md: { box: "w-9 h-9", text: "text-xs", dot: 9 },
  lg: { box: "w-12 h-12", text: "text-base", dot: 11 },
  xl: { box: "w-20 h-20", text: "text-2xl", dot: 16 },
  "2xl": { box: "w-24 h-24", text: "text-3xl", dot: 18 },
} as const;

type AvatarSize = keyof typeof SIZE_MAP;

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  status?: "online" | "offline" | "away";
  shape?: "circle" | "square";
  className?: string;
}

export default function Avatar({
  name,
  src,
  size = "md",
  status,
  shape = "circle",
  className = "",
}: AvatarProps) {
  const { box, text, dot } = SIZE_MAP[size];
  const radius = shape === "circle" ? "rounded-full" : "rounded-xl";
  const color = getAvatarColor(name);

  // A dead or unrenderable URL — an expired upload, a host that is down —
  // falls back to the initials rather than a broken image. The failure is
  // remembered per URL, so a new src is always given its own chance.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div className={`relative inline-flex shrink-0 ${box} ${radius} ${className}`}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? undefined}
          alt={name}
          onError={() => setFailedSrc(src ?? null)}
          className={`w-full h-full object-cover ${radius}`}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold text-white ${radius} ${text}`}
          style={{ backgroundColor: color }}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <StatusDot
          status={status}
          size={dot}
          ring
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
}
