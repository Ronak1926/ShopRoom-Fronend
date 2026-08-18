"use client";

import type { ElementType, ReactNode } from "react";

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

/** Compact on/off switch — used for optional effect toggles (Shadow, Glow, …). */
export function Toggle({ checked, onChange, title }: { checked: boolean; onChange: (v: boolean) => void; title?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      title={title}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 shrink-0 rounded-full transition-colors cursor-pointer ${
        checked ? "bg-(--color-brand-primary)" : "bg-(--color-border-strong)"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-(--shadow-sm) transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

/** A row of mutually-exclusive pill buttons (alignment, overflow mode, …). */
export function SegmentedGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; icon?: ElementType<{ sx?: object }> }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const Icon = o.icon;
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            title={o.label}
            onClick={() => onChange(o.value)}
            className={`flex items-center justify-center gap-1 h-8 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
              active
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            {Icon ? <Icon sx={{ fontSize: 15 }} /> : o.label}
          </button>
        );
      })}
    </div>
  );
}
