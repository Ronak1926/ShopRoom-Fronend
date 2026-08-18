"use client";

import { useState } from "react";
import { THEME_TEXT_COLORS } from "@/features/notifications/textPresets";
import { toHex } from "./fields";

const RECENT_COLORS_KEY = "shoproom_studio_recent_text_colors";
const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
  backgroundSize: "6px 6px",
  backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0",
};

function useRecentColors(): [string[], (c: string) => void] {
  const [colors, setColors] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(RECENT_COLORS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const add = (c: string) => {
    setColors((prev) => {
      const next = [c, ...prev.filter((x) => x.toLowerCase() !== c.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable (private mode, quota) — recent colors just won't persist
      }
      return next;
    });
  };
  return [colors, add];
}

/** Text color control: native picker + hex input + transparent swatch + theme/recent swatches. */
export function TextColorPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [recent, addRecent] = useRecentColors();
  const isTransparent = value === "transparent";
  const hex = isTransparent ? "#000000" : toHex(value);

  function commit(v: string) {
    onChange(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) addRecent(v);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => commit(e.target.value)}
          className="w-10 h-8 shrink-0 rounded-md border border-(--color-border-default) bg-transparent cursor-pointer"
        />
        <input
          type="text"
          value={isTransparent ? "transparent" : hex}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(v)) commit(v);
          }}
          spellCheck={false}
          className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
        />
        <button
          type="button"
          title="Transparent"
          onClick={() => onChange("transparent")}
          style={CHECKERBOARD}
          className={`w-8 h-8 shrink-0 rounded-md border cursor-pointer ${
            isTransparent ? "border-(--color-brand-primary) ring-1 ring-(--color-brand-primary)" : "border-(--color-border-default)"
          }`}
        />
      </div>

      <div>
        <p className="text-[10px] font-medium text-(--color-text-hint) mb-1.5">Theme colors</p>
        <div className="flex flex-wrap gap-1.5">
          {THEME_TEXT_COLORS.map((c) => (
            <button
              key={c.label}
              type="button"
              title={c.label}
              onClick={() => commit(c.value)}
              className={`w-6 h-6 rounded-full border cursor-pointer ${
                value === c.value ? "ring-2 ring-(--color-brand-primary) ring-offset-1" : "border-(--color-border-default)"
              }`}
              style={{ background: c.value }}
            />
          ))}
        </div>
      </div>

      {!!recent.length && (
        <div>
          <p className="text-[10px] font-medium text-(--color-text-hint) mb-1.5">Recent</p>
          <div className="flex flex-wrap gap-1.5">
            {recent.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => commit(c)}
                className={`w-6 h-6 rounded-full border cursor-pointer ${
                  value === c ? "ring-2 ring-(--color-brand-primary) ring-offset-1" : "border-(--color-border-default)"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
