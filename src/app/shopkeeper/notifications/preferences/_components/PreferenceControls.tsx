"use client";

import type { ElementType, ReactNode } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Dropdown from "@/components/ui/Dropdown";

/** Card shell: icon, title, and a stack of rows. */
export function PreferenceCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ElementType;
  title: string;
  children: ReactNode;
}) {
  return (
    // Deliberately no overflow-hidden: it would clip a Dropdown opened in a row.
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface)">
      <header className="flex items-center gap-2.5 px-5 pt-4 pb-1.5">
        <span className="w-8 h-8 shrink-0 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center text-(--color-brand-primary)">
          <Icon sx={{ fontSize: 17 }} />
        </span>
        <h2 className="text-[14px] font-bold text-(--color-text-primary)">
          {title}
        </h2>
      </header>
      <div className="px-5 pb-3">{children}</div>
    </section>
  );
}

/**
 * One setting: label and description on the left, control on the right.
 *
 * The control sits in a fixed 16rem track rather than being sized by its own
 * content, so a long dropdown label or a wide segmented control cannot push its
 * row out of line with the rest. `min-h-9` matches the control height, keeping
 * a toggle row exactly as tall as a dropdown row. Below `sm` the track would
 * leave nothing for the label, so the row stacks instead.
 *
 * `stack` puts the control on its own full-width line (channel pickers).
 */
export function PreferenceRow({
  label,
  description,
  htmlFor,
  stack,
  children,
}: {
  label: string;
  description: string;
  htmlFor?: string;
  stack?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-2 py-3 border-b border-(--color-border-default) last:border-b-0 ${
        stack ? "" : "sm:flex-row sm:items-center sm:gap-4"
      }`}
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor={htmlFor}
          className="block text-[12.5px] font-semibold text-(--color-text-primary)"
        >
          {label}
        </label>
        <p className="text-[11px] text-(--color-text-hint) mt-0.5">
          {description}
        </p>
      </div>
      <div
        className={
          stack
            ? ""
            : "w-full sm:w-64 shrink-0 flex items-center justify-start sm:justify-end min-h-9"
        }
      >
        {children}
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        checked ? "bg-(--color-brand-primary)" : "bg-(--color-border-strong)"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-(--shadow-xs) transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex w-full rounded-lg border border-(--color-border-default) overflow-hidden">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-auto h-9 px-3 text-[12px] font-semibold truncate transition-colors cursor-pointer ${
            value === o.value
              ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
              : "bg-(--color-bg-surface) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RadioRow<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-5">
      {options.map((o) => (
        <label
          key={o.value}
          className="flex items-center gap-1.5 text-[12px] text-(--color-text-secondary) cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="w-3.5 h-3.5 accent-(--color-brand-primary) cursor-pointer"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export function CheckboxChips<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T[];
  options: { value: T; label: string }[];
  onChange: (v: T[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() =>
              onChange(
                on ? value.filter((v) => v !== o.value) : [...value, o.value],
              )
            }
            className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer ${
              on
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 shrink-0 rounded-sm border flex items-center justify-center ${
                on
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary) text-white"
                  : "border-(--color-border-strong)"
              }`}
            >
              {on && <CheckOutlinedIcon sx={{ fontSize: 11 }} />}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function SelectField<T extends string | number>({
  id,
  value,
  options,
  label,
  onChange,
}: {
  id: string;
  value: T;
  options: { value: T; label: string }[];
  label: string;
  onChange: (v: T) => void;
}) {
  return (
    <Dropdown
      id={id}
      value={value}
      options={options}
      ariaLabel={label}
      onChange={onChange}
      className="w-full"
    />
  );
}

export function SliderField({
  id,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 accent-(--color-brand-primary) cursor-pointer"
      />
      <span className="flex shrink-0 items-center gap-1 h-9 px-2.5 rounded-lg border border-(--color-border-default)">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className="w-10 bg-transparent border-0 outline-none text-[12.5px] text-(--color-text-primary)"
        />
        <span className="text-[11px] text-(--color-text-hint)">{unit}</span>
      </span>
    </div>
  );
}

export function ColorField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <span className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg border border-(--color-border-default)">
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="w-7 h-6 rounded-md border-0 bg-transparent cursor-pointer"
      />
      <span className="text-[12px] font-medium text-(--color-text-primary) tabular-nums">
        {value.toUpperCase()}
      </span>
    </span>
  );
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const btn =
    "w-9 h-9 flex items-center justify-center text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center rounded-lg border border-(--color-border-default) overflow-hidden">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={btn}
      >
        <RemoveOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
      <span className="w-10 text-center text-[12.5px] font-semibold text-(--color-text-primary) tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={btn}
      >
        <AddOutlinedIcon sx={{ fontSize: 15 }} />
      </button>
    </div>
  );
}

export function TimeField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      id={id}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 min-w-0 h-9 px-2.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) text-[12.5px] text-(--color-text-primary) cursor-pointer focus:border-(--color-brand-primary) outline-none transition-colors"
    />
  );
}
