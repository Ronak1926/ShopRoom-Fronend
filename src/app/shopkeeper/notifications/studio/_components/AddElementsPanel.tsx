"use client";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  BASIC_ELEMENTS,
  PRODUCT_ELEMENTS,
  GENERAL_ELEMENTS,
  type ToolItem,
} from "../_data/studioData";
import { STUDIO_ICONS } from "./studioIcons";

function ElementGrid({ items }: { items: ToolItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ id, label, iconKey }) => {
        const Icon = STUDIO_ICONS[iconKey];
        return (
          <button
            key={id}
            type="button"
            className="flex flex-col items-center justify-center gap-1.5 aspect-square rounded-xl border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            <Icon sx={{ fontSize: 20 }} />
            <span className="text-[11px] font-medium leading-tight text-center px-1">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
      {children}
    </p>
  );
}

export default function AddElementsPanel({ width }: { width: number }) {
  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">
          Add Elements
        </h2>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-5">
        <section>
          <GroupLabel>Basic</GroupLabel>
          <ElementGrid items={BASIC_ELEMENTS} />
        </section>

        <section>
          <GroupLabel>Product</GroupLabel>
          <ElementGrid items={PRODUCT_ELEMENTS} />
        </section>

        <section>
          <GroupLabel>General</GroupLabel>
          <ElementGrid items={GENERAL_ELEMENTS} />
        </section>

        <section>
          <GroupLabel>Uploads</GroupLabel>
          <button
            type="button"
            className="w-full flex flex-col items-center justify-center gap-2 py-7 rounded-xl border-2 border-dashed border-(--color-border-strong) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            <FileUploadOutlinedIcon sx={{ fontSize: 24 }} />
            <span className="text-[13px] font-semibold">Upload Image</span>
            <span className="text-[11px] text-(--color-text-hint)">
              JPG, PNG, WEBP
            </span>
          </button>
        </section>
      </div>
    </aside>
  );
}
