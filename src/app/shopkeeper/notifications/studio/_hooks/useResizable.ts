"use client";

import { useCallback, useState } from "react";

/**
 * Tracks a clamped pixel dimension for a resizable editor panel.
 * `resizeBy` accepts a signed delta (from a drag handle) and keeps the value
 * within [min, max].
 */
export function useResizable(initial: number, min: number, max: number) {
  const [size, setSize] = useState(initial);

  const resizeBy = useCallback(
    (delta: number) => {
      setSize((s) => Math.min(max, Math.max(min, s + delta)));
    },
    [min, max],
  );

  return [size, resizeBy] as const;
}
