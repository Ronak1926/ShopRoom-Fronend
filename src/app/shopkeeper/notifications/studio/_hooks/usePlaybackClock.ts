"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drives the Timeline's playhead via requestAnimationFrame while `isPlaying`
 * is true, auto-stopping (calling onDone) once it reaches durationMs — so
 * exit animations, which only fire during an explicit preview, have a
 * natural end.
 */
export function usePlaybackClock(durationMs: number, isPlaying: boolean, onDone: () => void): number {
  const [time, setTime] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setTime(0);
      startRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      if (elapsed >= durationMs) {
        setTime(durationMs);
        onDone();
        return;
      }
      setTime(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onDone is re-created each render; only isPlaying/durationMs should restart the clock
  }, [isPlaying, durationMs]);

  return time;
}
