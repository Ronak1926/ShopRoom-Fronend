"use client";

import { useState } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import FlipOutlinedIcon from "@mui/icons-material/FlipOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { shapeCss } from "@/components/notifications/nodeStyle";
import { nodeLabel, type LayerMove } from "@/features/notifications/tree";
import type { CompositionNode, NodeStyle, ImageConfig } from "@/features/notifications/types";
import { ColorField, NumberField, Row, Section, SegmentedGroup, Select, Slider, Toggle } from "./fields";
import { TextColorPicker } from "./TextColorPicker";
import ImageCropModal from "./ImageCropModal";
import AnimationSection from "./AnimationSection";

const LAYER_BUTTONS: { move: LayerMove; label: string; icon: typeof ArrowUpwardOutlinedIcon }[] = [
  { move: "forward", label: "Forward", icon: ArrowUpwardOutlinedIcon },
  { move: "front", label: "To front", icon: FlipToFrontOutlinedIcon },
  { move: "backward", label: "Backward", icon: ArrowDownwardOutlinedIcon },
  { move: "back", label: "To back", icon: FlipToBackOutlinedIcon },
];

const FIT_OPTIONS = [
  { value: "cover" as const, label: "Cover" },
  { value: "contain" as const, label: "Contain" },
  { value: "fill" as const, label: "Fill" },
  { value: "none" as const, label: "Original" },
];

const SHADOW_PRESETS: Record<string, { x: number; y: number; blur: number; spread: number; color: string }> = {
  Soft: { x: 0, y: 4, blur: 12, spread: 0, color: "rgba(15,23,42,0.14)" },
  Medium: { x: 0, y: 8, blur: 20, spread: 0, color: "rgba(15,23,42,0.22)" },
  Strong: { x: 0, y: 14, blur: 32, spread: 0, color: "rgba(15,23,42,0.32)" },
};

const MASK_SHAPES: { value: NonNullable<NodeStyle["clipShape"]> | "none"; label: string }[] = [
  { value: "none", label: "None" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
  { value: "ellipse", label: "Ellipse" },
  { value: "blob", label: "Blob" },
  { value: "star", label: "Star" },
  { value: "hexagon", label: "Hexagon" },
  { value: "diamond", label: "Diamond" },
];

const BLEND_MODES = ["normal", "multiply", "screen", "overlay", "darken", "lighten"] as const;

interface Props {
  node: CompositionNode;
  update: (patch: (n: CompositionNode) => CompositionNode) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLayer: (m: LayerMove) => void;
  onToggleLock: () => void;
  /** Plays just this element's animation on the canvas. */
  onPreview?: (id: string) => void;
  onReplace: () => void;
}

/** Right-panel inspector for a real IMAGE canvas element (uploaded/stock/recent). */
export default function ImageInspector({ node, update, onDelete, onDuplicate, onMoveLayer, onToggleLock, onReplace, onPreview }: Props) {
  const f = node.frame;
  const style = node.style ?? {};
  const image: ImageConfig = node.image ?? {};
  const asset = node.asset;
  const hidden = node.visible === false;
  const locked = !!node.locked;
  const [aspectLocked, setAspectLocked] = useState(true);
  const [cropOpen, setCropOpen] = useState(false);
  // A PRODUCT_IMAGE slot normally resolves {{product.image}} per send; holding a
  // fixed photo overrides that, so the inspector says so and offers a way back.
  const isProductSlot = node.type === "PRODUCT_IMAGE";

  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) => {
    if (aspectLocked && (k === "width" || k === "height") && f.width > 0 && f.height > 0) {
      const ratio = f.width / f.height;
      update((n) =>
        k === "width"
          ? { ...n, frame: { ...n.frame, width: v, height: Math.round(v / ratio) } }
          : { ...n, frame: { ...n.frame, height: v, width: Math.round(v * ratio) } },
      );
      return;
    }
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  };
  const setImage = (patch: Partial<ImageConfig>) => update((n) => ({ ...n, image: { ...n.image, ...patch } }));
  const setStyle = (patch: Partial<NodeStyle>) => update((n) => ({ ...n, style: { ...n.style, ...patch } }));
  const flipH = () => update((n) => ({ ...n, frame: { ...n.frame, scaleX: (n.frame.scaleX ?? 1) * -1 } }));
  const flipV = () => update((n) => ({ ...n, frame: { ...n.frame, scaleY: (n.frame.scaleY ?? 1) * -1 } }));

  return (
    <>
      <div className="flex items-center gap-1 px-4 py-3 border-b border-(--color-border-default)">
        <div className="min-w-0">
          <input
            value={nodeLabel(node)}
            onChange={(e) => update((n) => ({ ...n, name: e.target.value }))}
            className="w-full bg-transparent border-0 outline-none text-[14px] font-bold text-(--color-text-primary)"
          />
          <p className="text-[10px] uppercase tracking-wide text-(--color-text-hint)">
            {isProductSlot ? "Product Image" : "Image"}
          </p>
        </div>
        <button
          type="button"
          title="Duplicate"
          onClick={onDuplicate}
          className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
        >
          <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
        <button
          type="button"
          title="Delete element"
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-danger) hover:bg-(--color-danger-light) transition-colors cursor-pointer"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      </div>

      <Section title="Preview">
        <div className="flex items-center gap-3">
          <span className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default) bg-(--color-bg-page) flex items-center justify-center">
            {asset?.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- small inspector thumbnail of the node's own asset
              <img src={asset.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageOutlinedIcon sx={{ fontSize: 20, color: "var(--color-text-hint)" }} />
            )}
          </span>
          <button
            type="button"
            onClick={onReplace}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-(--color-border-default) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            <SwapHorizOutlinedIcon sx={{ fontSize: 15 }} />
            Replace Image
          </button>
          {asset?.attribution?.photographer && (
            <p className="text-[10px] text-(--color-text-hint) truncate">
              Photo by {asset.attribution.photographer}
            </p>
          )}
        </div>

        {isProductSlot && (
          <div className="mt-2.5 rounded-lg bg-(--color-brand-alert-light) p-2.5">
            <p className="text-[10px] leading-relaxed text-(--color-text-secondary)">
              This is the product image slot. With a fixed photo set, every customer sees{" "}
              <strong className="font-semibold">this</strong> image instead of the product&apos;s own.
            </p>
            <button
              type="button"
              onClick={() =>
                update((n) => ({
                  ...n,
                  asset: undefined,
                  image: { ...n.image, crop: undefined },
                  content: { ...n.content, source: "DYNAMIC", variable: "{{product.image}}" },
                }))
              }
              className="mt-1.5 h-7 px-2.5 rounded-lg bg-(--color-bg-surface) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
            >
              Use each product&apos;s own photo
            </button>
          </div>
        )}
      </Section>

      <Section title="Position &amp; Size">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={f.x} onChange={(v) => setFrame("x", v)} />
          <NumberField label="Y" value={f.y} onChange={(v) => setFrame("y", v)} />
          <NumberField label="W" value={f.width} onChange={(v) => setFrame("width", v)} />
          <NumberField label="H" value={f.height} onChange={(v) => setFrame("height", v)} />
        </div>
        <button
          type="button"
          onClick={() => setAspectLocked((v) => !v)}
          className={`mt-2 flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
            aspectLocked ? "text-(--color-brand-primary) bg-(--color-brand-primary-light)" : "text-(--color-text-hint) hover:bg-(--color-bg-surface-hover)"
          }`}
        >
          {aspectLocked ? <LinkOutlinedIcon sx={{ fontSize: 13 }} /> : <LinkOffOutlinedIcon sx={{ fontSize: 13 }} />}
          {aspectLocked ? "Aspect ratio locked" : "Aspect ratio unlocked"}
        </button>
      </Section>

      <Section title="Transform">
        <Row label="Rotation">
          <NumberField label="" value={f.rotation ?? 0} suffix="deg" onChange={(v) => setFrame("rotation", v)} />
        </Row>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={flipH}
            className={`flex items-center justify-center gap-1.5 h-8 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
              (f.scaleX ?? 1) < 0
                ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            <FlipOutlinedIcon sx={{ fontSize: 14 }} />
            Flip Horizontal
          </button>
          <button
            type="button"
            onClick={flipV}
            className={`flex items-center justify-center gap-1.5 h-8 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
              (f.scaleY ?? 1) < 0
                ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            <FlipOutlinedIcon sx={{ fontSize: 14, transform: "rotate(90deg)" }} />
            Flip Vertical
          </button>
        </div>
      </Section>

      <Section title="Crop">
        <button
          type="button"
          onClick={() => setCropOpen(true)}
          disabled={!asset?.url}
          className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-text-primary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CropOutlinedIcon sx={{ fontSize: 16 }} />
          {image.crop ? "Edit Crop" : "Add Crop"}
        </button>
        {image.crop && (
          <button
            type="button"
            onClick={() => setImage({ crop: undefined })}
            className="mt-1.5 w-full h-7 rounded-lg text-[11px] font-medium text-(--color-text-hint) hover:text-(--color-danger) transition-colors cursor-pointer"
          >
            Reset crop
          </button>
        )}
      </Section>

      <Section title="Appearance">
        <div className="flex flex-col gap-2.5">
          <div>
            <p className="text-[11px] text-(--color-text-hint) mb-1.5">Image fit</p>
            <SegmentedGroup value={image.fit ?? "cover"} options={FIT_OPTIONS} onChange={(v) => setImage({ fit: v })} />
          </div>
          <Row label="Border radius">
            <Slider value={style.borderRadius ?? 0} min={0} max={200} step={1} onChange={(v) => setStyle({ borderRadius: v })} />
          </Row>
          <Row label="Opacity">
            <Slider value={image.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setImage({ opacity: v })} />
          </Row>
          <Row label="Brightness">
            <Slider value={image.filters?.brightness ?? 1} min={0} max={2} step={0.05} onChange={(v) => setImage({ filters: { ...image.filters, brightness: v } })} />
          </Row>
          <Row label="Contrast">
            <Slider value={image.filters?.contrast ?? 1} min={0} max={2} step={0.05} onChange={(v) => setImage({ filters: { ...image.filters, contrast: v } })} />
          </Row>
          <Row label="Saturation">
            <Slider value={image.filters?.saturate ?? 1} min={0} max={2} step={0.05} onChange={(v) => setImage({ filters: { ...image.filters, saturate: v } })} />
          </Row>
          <Row label="Blur">
            <Slider value={style.blur ?? 0} min={0} max={20} step={1} onChange={(v) => setStyle({ blur: v })} />
          </Row>
        </div>
      </Section>

      <Section title="Shadow">
        <div className="flex flex-col gap-2.5">
          <Row label="Enabled">
            <Toggle
              checked={!!style.shadow?.enabled}
              onChange={(v) => setStyle({ shadow: v ? { ...SHADOW_PRESETS.Soft, enabled: true } : { ...style.shadow, enabled: false } })}
            />
          </Row>
          {style.shadow?.enabled && (
            <>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(SHADOW_PRESETS).map(([label, preset]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStyle({ shadow: { ...preset, enabled: true } })}
                    className="h-7 rounded-lg border border-(--color-border-default) text-[11px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="X" value={style.shadow.x ?? 0} onChange={(v) => setStyle({ shadow: { ...style.shadow, x: v } })} />
                <NumberField label="Y" value={style.shadow.y ?? 4} onChange={(v) => setStyle({ shadow: { ...style.shadow, y: v } })} />
                <NumberField label="Blur" value={style.shadow.blur ?? 10} onChange={(v) => setStyle({ shadow: { ...style.shadow, blur: v } })} />
                <Row label="Color">
                  <ColorField value={style.shadow.color} onChange={(v) => setStyle({ shadow: { ...style.shadow, color: v } })} />
                </Row>
              </div>
            </>
          )}
        </div>
      </Section>

      <Section title="Mask">
        <div className="grid grid-cols-4 gap-1.5">
          {MASK_SHAPES.map((m) => {
            const active = (style.clipShape ?? "none") === m.value;
            const css = m.value === "none" ? {} : shapeCss(m.value);
            return (
              <button
                key={m.value}
                type="button"
                title={m.label}
                onClick={() => setStyle({ clipShape: m.value === "none" ? undefined : m.value })}
                className={`flex flex-col items-center justify-center gap-1 h-14 rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? "border-(--color-brand-primary) bg-(--color-brand-primary-light)"
                    : "border-(--color-border-default) hover:bg-(--color-bg-surface-hover)"
                }`}
              >
                <span
                  className="w-6 h-6 bg-(--color-text-hint)"
                  style={{ borderRadius: css.borderRadius, clipPath: css.clipPath }}
                />
                <span className="text-[9px] font-medium text-(--color-text-secondary)">{m.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Overlay">
        <div className="flex flex-col gap-2.5">
          <Row label="Enabled">
            <Toggle
              checked={!!image.overlay}
              onChange={(v) => setImage({ overlay: v ? { color: "#000000", opacity: 0.3, blendMode: "normal" } : undefined })}
            />
          </Row>
          {image.overlay && (
            <>
              <Row label="Color">
                <TextColorPicker value={image.overlay.color} onChange={(v) => setImage({ overlay: { ...image.overlay, color: v } })} />
              </Row>
              <Row label="Opacity">
                <Slider value={image.overlay.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setImage({ overlay: { ...image.overlay, opacity: v } })} />
              </Row>
              <Row label="Blend">
                <Select value={image.overlay.blendMode ?? "normal"} options={BLEND_MODES} onChange={(v) => setImage({ overlay: { ...image.overlay, blendMode: v as typeof BLEND_MODES[number] } })} />
              </Row>
            </>
          )}
        </div>
      </Section>

      <Section title="Layering">
        <div className="grid grid-cols-2 gap-1.5">
          {LAYER_BUTTONS.map(({ move, label, icon: Icon }) => (
            <button
              key={move}
              type="button"
              onClick={() => onMoveLayer(move)}
              className="flex items-center gap-1.5 h-8 px-2 rounded-lg border border-(--color-border-default) text-[11px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            >
              <Icon sx={{ fontSize: 14 }} />
              {label}
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => update((n) => ({ ...n, visible: hidden }))}
            className="flex items-center gap-1.5 h-8 px-2 rounded-lg border border-(--color-border-default) text-[11px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            {hidden ? <VisibilityOffOutlinedIcon sx={{ fontSize: 14 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />}
            {hidden ? "Hidden" : "Visible"}
          </button>
          <button
            type="button"
            onClick={onToggleLock}
            className={`flex items-center gap-1.5 h-8 px-2 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
              locked
                ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            {locked ? <LockOutlinedIcon sx={{ fontSize: 14 }} /> : <LockOpenOutlinedIcon sx={{ fontSize: 14 }} />}
            {locked ? "Locked" : "Unlocked"}
          </button>
        </div>
      </Section>

      <AnimationSection node={node} update={update} onPreview={onPreview} />

      {cropOpen && asset?.url && (
        <ImageCropModal
          imageUrl={asset.url}
          aspect={f.width / f.height}
          initialCrop={image.crop}
          onApply={(crop) => {
            setImage({ crop });
            setCropOpen(false);
          }}
          onCancel={() => setCropOpen(false)}
        />
      )}
    </>
  );
}
