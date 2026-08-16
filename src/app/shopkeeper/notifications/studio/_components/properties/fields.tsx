"use client";

import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-4 py-3.5 border-b border-(--color-border-default)">
      <h4 className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
        {title}
      </h4>
      {children}
    </section>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-(--color-text-secondary)">{label}</span>
      {children}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-input)">
      <span className="text-[11px] font-medium text-(--color-text-hint)">{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
        className="w-full min-w-0 bg-transparent border-0 outline-none text-[13px] font-medium text-(--color-text-primary) text-right"
      />
      {suffix && <span className="text-[10px] text-(--color-text-hint)">{suffix}</span>}
    </label>
  );
}

export function ColorField({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <input
      type="color"
      value={toHex(value)}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-8 rounded-md border border-(--color-border-default) bg-transparent cursor-pointer"
    />
  );
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-32 accent-(--color-brand-primary)"
    />
  );
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {prettyLabel(o)}
        </option>
      ))}
    </select>
  );
}

export function prettyLabel(v: string): string {
  if (v === "NONE") return "None";
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/** color inputs need #rrggbb; fall back to black for tokens/rgba/undefined. */
export function toHex(c?: string): string {
  return c && /^#[0-9a-fA-F]{6}$/.test(c) ? c : "#000000";
}
