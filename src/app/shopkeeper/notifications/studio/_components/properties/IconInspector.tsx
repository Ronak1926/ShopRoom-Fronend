"use client";

import { useState } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import FlipOutlinedIcon from "@mui/icons-material/FlipOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { getIcon } from "@/features/notifications/icons";
import { iconLabel } from "@/features/notifications/iconLibrary";
import { nodeLabel, type LayerMove } from "@/features/notifications/tree";
import type { CompositionNode, NodeStyle } from "@/features/notifications/types";
import { NumberField, Row, Section, Select, Slider } from "./fields";
import { TextColorPicker } from "./TextColorPicker";
import { ENTRY, ATTENTION, EXIT } from "./animationOptions";

/** Plain helper (not a component) so the dynamically-resolved icon renders safely — mirrors BadgeLabelInspector's renderPreviewIcon. */
function renderSelectedIcon(name: string | undefined, fontSize: number) {
  const Resolved = getIcon(name);
  return Resolved ? <Resolved sx={{ fontSize }} /> : null;
}

const LAYER_BUTTONS: { move: LayerMove; label: string; icon: typeof ArrowUpwardOutlinedIcon }[] = [
  { move: "forward", label: "Forward", icon: ArrowUpwardOutlinedIcon },
  { move: "front", label: "To front", icon: FlipToFrontOutlinedIcon },
  { move: "backward", label: "Backward", icon: ArrowDownwardOutlinedIcon },
  { move: "back", label: "To back", icon: FlipToBackOutlinedIcon },
];

interface Props {
  node: CompositionNode;
  update: (patch: (n: CompositionNode) => CompositionNode) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLayer: (m: LayerMove) => void;
  onToggleLock: () => void;
  onChangeIcon: () => void;
}

export default function IconInspector({
  node,
  update,
  onDelete,
  onDuplicate,
  onMoveLayer,
  onToggleLock,
  onChangeIcon,
}: Props) {
  const f = node.frame;
  const style = node.style ?? {};
  const hidden = node.visible === false;
  const locked = !!node.locked;
  const [aspectLocked, setAspectLocked] = useState(true);

  const iconName = node.content?.icon;
  // The renderer sizes an ICON from min(frame.width, frame.height), so "Size"
  // is the frame itself — not a separate field that would silently do nothing.
  const size = Math.min(f.width, f.height);

  const setStyle = (patch: Partial<NodeStyle>) => update((n) => ({ ...n, style: { ...n.style, ...patch } }));
  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) => {
    if (aspectLocked && (k === "width" || k === "height")) {
      update((n) => ({ ...n, frame: { ...n.frame, width: v, height: v } }));
      return;
    }
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  };
  const setSize = (v: number) => update((n) => ({ ...n, frame: { ...n.frame, width: v, height: v } }));
  const flipH = () => update((n) => ({ ...n, frame: { ...n.frame, scaleX: (n.frame.scaleX ?? 1) * -1 } }));
  const flipV = () => update((n) => ({ ...n, frame: { ...n.frame, scaleY: (n.frame.scaleY ?? 1) * -1 } }));

  const setAnim = (slot: "entry" | "attention" | "exit", type: string) =>
    update((n) => ({
      ...n,
      animation: {
        ...n.animation,
        [slot]:
          type === "NONE"
            ? undefined
            : { type, durationMs: n.animation?.[slot]?.durationMs ?? 500, delayMs: n.animation?.[slot]?.delayMs ?? 0, easing: n.animation?.[slot]?.easing ?? "easeOut" },
      },
    }));

  return (
    <>
      <div className="flex items-center gap-1 px-4 py-3 border-b border-(--color-border-default)">
        <div className="min-w-0">
          <input
            value={nodeLabel(node)}
            onChange={(e) => update((n) => ({ ...n, name: e.target.value }))}
            className="w-full bg-transparent border-0 outline-none text-[14px] font-bold text-(--color-text-primary)"
          />
          <p className="text-[10px] uppercase tracking-wide text-(--color-text-hint)">Icon</p>
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

      <Section title="Icon">
        <p className="text-[11px] text-(--color-text-hint) mb-2">Selected icon</p>
        <div className="flex items-center gap-2.5 p-2 rounded-xl border border-(--color-border-default)">
          <span
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-(--color-brand-primary-light)"
            style={{ color: style.color ?? "#5B47D4" }}
          >
            {renderSelectedIcon(iconName, 20)}
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-(--color-text-primary) truncate">{iconLabel(iconName)}</p>
            <p className="text-[10px] text-(--color-text-hint) truncate">{iconName ?? "None"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeIcon}
          className="mt-2 w-full flex items-center justify-center gap-1.5 h-8 rounded-lg border border-(--color-border-default) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
        >
          <SwapHorizOutlinedIcon sx={{ fontSize: 15 }} />
          Change Icon
        </button>
      </Section>

      <Section title="Icon Style">
        <div className="flex flex-col gap-2.5">
          <Row label="Color">
            <TextColorPicker value={style.color} onChange={(v) => setStyle({ color: v })} />
          </Row>
          <Row label="Size">
            <div className="flex items-center gap-2">
              <Slider value={size} min={8} max={200} step={1} onChange={setSize} />
              <span className="w-10 text-right text-[11px] font-medium text-(--color-text-primary)">{size}px</span>
            </div>
          </Row>
          <Row label="Opacity">
            <div className="flex items-center gap-2">
              <Slider value={style.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setStyle({ opacity: v })} />
              <span className="w-10 text-right text-[11px] font-medium text-(--color-text-primary)">
                {Math.round((style.opacity ?? 1) * 100)}%
              </span>
            </div>
          </Row>
        </div>
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
            aspectLocked
              ? "text-(--color-brand-primary) bg-(--color-brand-primary-light)"
              : "text-(--color-text-hint) hover:bg-(--color-bg-surface-hover)"
          }`}
        >
          {aspectLocked ? <LinkOutlinedIcon sx={{ fontSize: 13 }} /> : <LinkOffOutlinedIcon sx={{ fontSize: 13 }} />}
          Maintain aspect ratio
        </button>
      </Section>

      <Section title="Rotation">
        <div className="flex flex-col gap-2.5">
          <Row label="Rotation">
            <div className="flex items-center gap-2">
              <Slider value={f.rotation ?? 0} min={-180} max={180} step={1} onChange={(v) => setFrame("rotation", v)} />
              <span className="w-10 text-right text-[11px] font-medium text-(--color-text-primary)">
                {Math.round(f.rotation ?? 0)}°
              </span>
              <button
                type="button"
                title="Reset rotation"
                onClick={() => setFrame("rotation", 0)}
                className="w-6 h-6 shrink-0 flex items-center justify-center rounded-md text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
              >
                <RestartAltOutlinedIcon sx={{ fontSize: 14 }} />
              </button>
            </div>
          </Row>
          <Row label="Flip">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                title="Flip horizontal"
                onClick={flipH}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  (f.scaleX ?? 1) < 0
                    ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
                    : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
                }`}
              >
                <FlipOutlinedIcon sx={{ fontSize: 15 }} />
              </button>
              <button
                type="button"
                title="Flip vertical"
                onClick={flipV}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  (f.scaleY ?? 1) < 0
                    ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
                    : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
                }`}
              >
                <FlipOutlinedIcon sx={{ fontSize: 15, transform: "rotate(90deg)" }} />
              </button>
            </div>
          </Row>
        </div>
      </Section>

      <Section title="Animation">
        <div className="flex flex-col gap-2.5">
          <Row label="Entry">
            <Select value={node.animation?.entry?.type ?? "NONE"} options={ENTRY} onChange={(v) => setAnim("entry", v)} />
          </Row>
          <Row label="Attention">
            <Select value={node.animation?.attention?.type ?? "NONE"} options={ATTENTION} onChange={(v) => setAnim("attention", v)} />
          </Row>
          <Row label="Exit">
            <Select value={node.animation?.exit?.type ?? "NONE"} options={EXIT} onChange={(v) => setAnim("exit", v)} />
          </Row>
          {node.animation?.entry && (
            <>
              <Row label="Duration">
                <NumberField
                  label=""
                  value={node.animation.entry.durationMs ?? 500}
                  suffix="ms"
                  onChange={(v) => update((n) => ({ ...n, animation: { ...n.animation, entry: { ...n.animation!.entry!, durationMs: v } } }))}
                />
              </Row>
              <Row label="Delay">
                <NumberField
                  label=""
                  value={node.animation.entry.delayMs ?? 0}
                  suffix="ms"
                  onChange={(v) => update((n) => ({ ...n, animation: { ...n.animation, entry: { ...n.animation!.entry!, delayMs: v } } }))}
                />
              </Row>
            </>
          )}
        </div>
      </Section>

      <Section title="Layers">
        <div className="grid grid-cols-2 gap-1.5">
          {LAYER_BUTTONS.map(({ move, label, icon: LIcon }) => (
            <button
              key={move}
              type="button"
              onClick={() => onMoveLayer(move)}
              className="flex items-center gap-1.5 h-8 px-2 rounded-lg border border-(--color-border-default) text-[11px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            >
              <LIcon sx={{ fontSize: 14 }} />
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
    </>
  );
}
