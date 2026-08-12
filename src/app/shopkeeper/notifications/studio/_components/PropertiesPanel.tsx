"use client";

import type { ReactNode } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatAlignJustifyOutlinedIcon from "@mui/icons-material/FormatAlignJustifyOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatSizeOutlinedIcon from "@mui/icons-material/FormatSizeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// ── Small building blocks ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-4 py-4 border-t border-(--color-border-default)">
      <h4 className="text-[13px] font-bold text-(--color-text-primary) mb-3">
        {title}
      </h4>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex items-center gap-2 h-9 px-2.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-input)">
      <span className="text-[11px] font-medium text-(--color-text-hint)">
        {label}
      </span>
      <input
        defaultValue={value}
        className="w-full min-w-0 bg-transparent border-0 outline-none text-[13px] font-medium text-(--color-text-primary) text-right"
      />
    </label>
  );
}

function SelectBox({ value }: { value: string }) {
  return (
    <div className="flex items-center h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[13px] font-medium text-(--color-text-primary) cursor-pointer">
      {value}
      <KeyboardArrowDownOutlinedIcon
        sx={{ fontSize: 16, color: "var(--color-text-hint)" }}
        className="ml-auto"
      />
    </div>
  );
}

function IconToggleRow({
  icons,
  activeIndex,
}: {
  icons: React.ElementType[];
  activeIndex: number;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {icons.map((Icon, i) => (
        <button
          key={i}
          type="button"
          className={`h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
            i === activeIndex
              ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
              : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
          }`}
        >
          <Icon sx={{ fontSize: 18 }} />
        </button>
      ))}
    </div>
  );
}

function StyleRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-(--color-text-secondary)">{label}</span>
      {children}
    </div>
  );
}

// ── Panel ───────────────────────────────────────────────────────────────────────

export default function PropertiesPanel({ width }: { width: number }) {
  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center px-4 py-4">
        <h3 className="text-[15px] font-bold text-(--color-text-primary)">Text</h3>
        <button
          type="button"
          title="Delete element"
          className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-(--color-danger) hover:bg-(--color-danger-light) transition-colors cursor-pointer"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Alignment */}
      <div className="px-4 pb-4">
        <IconToggleRow
          activeIndex={1}
          icons={[
            FormatAlignLeftOutlinedIcon,
            FormatAlignCenterOutlinedIcon,
            FormatAlignRightOutlinedIcon,
            FormatAlignJustifyOutlinedIcon,
          ]}
        />

        {/* Text content */}
        <textarea
          defaultValue="New Arrival"
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 py-2 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
        />

        {/* Font / size / color */}
        <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
          <SelectBox value="Poppins" />
          <SelectBox value="28" />
          <button
            type="button"
            title="Text colour"
            className="w-9 h-9 rounded-lg border border-(--color-border-default) bg-(--color-brand-primary) cursor-pointer"
          />
        </div>

        {/* Style toggles */}
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {[FormatBoldIcon, FormatItalicIcon, FormatUnderlinedIcon, FormatSizeOutlinedIcon, TuneOutlinedIcon].map(
            (Icon, i) => (
              <button
                key={i}
                type="button"
                className="h-9 flex items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
              >
                <Icon sx={{ fontSize: 18 }} />
              </button>
            ),
          )}
        </div>
      </div>

      {/* Position & Size */}
      <Section title="Position & Size">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Field label="X" value="24" />
          <Field label="Y" value="48" />
          <button
            type="button"
            title="Lock aspect ratio"
            className="row-span-2 w-9 h-9 flex items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <LinkOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
          <Field label="W" value="327" />
          <Field label="H" value="72" />
        </div>
      </Section>

      {/* Style */}
      <Section title="Style">
        <div className="flex flex-col gap-3">
          <StyleRow label="Color">
            <div className="flex items-center gap-2 h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input)">
              <span className="w-4 h-4 rounded bg-(--color-text-primary)" />
              <span className="text-[12px] font-medium text-(--color-text-primary)">
                #1A1A1A
              </span>
            </div>
          </StyleRow>
          <StyleRow label="Background">
            <div className="flex items-center gap-2 h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input)">
              <span className="w-4 h-4 rounded border border-(--color-border-default)" />
              <span className="text-[12px] font-medium text-(--color-text-secondary)">
                Transparent
              </span>
            </div>
          </StyleRow>
          <StyleRow label="Padding">
            <input
              defaultValue="16"
              className="w-20 h-8 px-2.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) text-right outline-none"
            />
          </StyleRow>
          <StyleRow label="Border Radius">
            <input
              defaultValue="12"
              className="w-20 h-8 px-2.5 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) text-right outline-none"
            />
          </StyleRow>
        </div>
      </Section>

      {/* Animation */}
      <Section title="Animation">
        <div className="flex flex-col gap-3">
          <StyleRow label="Entry Animation">
            <div className="w-36">
              <SelectBox value="Fade In" />
            </div>
          </StyleRow>
          <StyleRow label="Duration">
            <div className="w-36">
              <SelectBox value="0.6s" />
            </div>
          </StyleRow>
          <StyleRow label="Delay">
            <div className="w-36">
              <SelectBox value="0s" />
            </div>
          </StyleRow>
        </div>
      </Section>

      {/* On Click Action */}
      <Section title="On Click Action">
        <p className="text-[11px] font-medium text-(--color-text-hint) mb-1.5">
          Action Type
        </p>
        <SelectBox value="Open Product" />

        <p className="text-[11px] font-medium text-(--color-text-hint) mt-3 mb-1.5">
          Select Product
        </p>
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-(--color-border-default)">
          <span className="w-10 h-10 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center text-(--color-brand-primary) shrink-0">
            <FormatSizeOutlinedIcon sx={{ fontSize: 18 }} />
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-(--color-text-primary) truncate">
              Air Max Purple
            </div>
            <div className="text-[11px] text-(--color-text-hint)">
              ID: #P12345
            </div>
          </div>
          <button
            type="button"
            title="Remove product"
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-md text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <CloseOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </Section>
    </aside>
  );
}
