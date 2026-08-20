"use client";

import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { findNode, nodeLabel, type LayerMove } from "@/features/notifications/tree";
import type { CompositionNode, NotificationDesign } from "@/features/notifications/types";
import { ColorField, NumberField, Row, Section, Select, Slider } from "./properties/fields";
import TextInspector from "./properties/TextInspector";
import BadgeLabelInspector from "./properties/BadgeLabelInspector";
import ImageInspector from "./properties/ImageInspector";
import { ENTRY, ATTENTION, EXIT, EASINGS } from "./properties/animationOptions";

const LAYER_BUTTONS: { move: LayerMove; label: string; icon: typeof ArrowUpwardOutlinedIcon }[] = [
  { move: "forward", label: "Forward", icon: ArrowUpwardOutlinedIcon },
  { move: "front", label: "To front", icon: FlipToFrontOutlinedIcon },
  { move: "backward", label: "Backward", icon: ArrowDownwardOutlinedIcon },
  { move: "back", label: "To back", icon: FlipToBackOutlinedIcon },
];

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  updateElement: (id: string, patch: (n: CompositionNode) => CompositionNode) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveLayer: (id: string, move: LayerMove) => void;
  onToggleLock: (id: string) => void;
  onChangeBadgeLabelPreset?: () => void;
  onReplaceImage?: (id: string) => void;
}

export default function PropertiesPanel({
  width,
  design,
  selectedId,
  updateElement,
  onDelete,
  onDuplicate,
  onMoveLayer,
  onToggleLock,
  onChangeBadgeLabelPreset,
  onReplaceImage,
}: Props) {
  const node = design && selectedId ? findNode(design.elements, selectedId) : null;

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      {!node ? (
        <div className="flex flex-col items-center justify-center text-center gap-2 px-6 py-16 text-(--color-text-hint)">
          <TouchAppOutlinedIcon sx={{ fontSize: 30 }} />
          <p className="text-[13px]">Select an element on the canvas or in Layers to edit it.</p>
        </div>
      ) : node.type === "TEXT" ? (
        <TextInspector
          key={node.id}
          node={node}
          update={(p) => updateElement(node.id, p)}
          onDelete={() => onDelete(node.id)}
          onDuplicate={() => onDuplicate(node.id)}
          onMoveLayer={(m) => onMoveLayer(node.id, m)}
          onToggleLock={() => onToggleLock(node.id)}
        />
      ) : node.type === "BADGE" || node.type === "LABEL" ? (
        <BadgeLabelInspector
          key={node.id}
          node={node}
          update={(p) => updateElement(node.id, p)}
          onDelete={() => onDelete(node.id)}
          onDuplicate={() => onDuplicate(node.id)}
          onMoveLayer={(m) => onMoveLayer(node.id, m)}
          onToggleLock={() => onToggleLock(node.id)}
          onChangePreset={() => onChangeBadgeLabelPreset?.()}
        />
      ) : node.type === "IMAGE" || (node.type === "PRODUCT_IMAGE" && !!node.asset?.url) ? (
        <ImageInspector
          key={node.id}
          node={node}
          update={(p) => updateElement(node.id, p)}
          onDelete={() => onDelete(node.id)}
          onDuplicate={() => onDuplicate(node.id)}
          onMoveLayer={(m) => onMoveLayer(node.id, m)}
          onToggleLock={() => onToggleLock(node.id)}
          onReplace={() => onReplaceImage?.(node.id)}
        />
      ) : (
        <Inspector
          key={node.id}
          node={node}
          update={(p) => updateElement(node.id, p)}
          onDelete={() => onDelete(node.id)}
          onDuplicate={() => onDuplicate(node.id)}
          onMoveLayer={(m) => onMoveLayer(node.id, m)}
          onToggleLock={() => onToggleLock(node.id)}
        />
      )}
    </aside>
  );
}

interface InspectorProps {
  node: CompositionNode;
  update: (patch: (n: CompositionNode) => CompositionNode) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLayer: (m: LayerMove) => void;
  onToggleLock: () => void;
}

function Inspector({ node, update, onDelete, onDuplicate, onMoveLayer, onToggleLock }: InspectorProps) {
  const f = node.frame;
  const style = node.style ?? {};
  const hasText = typeof node.content?.text === "string";
  const hidden = node.visible === false;
  const locked = !!node.locked;

  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) =>
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  const setStyle = (patch: Partial<NonNullable<CompositionNode["style"]>>) =>
    update((n) => ({ ...n, style: { ...n.style, ...patch } }));
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
      {/* Element */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-(--color-border-default)">
        <div className="min-w-0">
          <input
            value={nodeLabel(node)}
            onChange={(e) => update((n) => ({ ...n, name: e.target.value }))}
            className="w-full bg-transparent border-0 outline-none text-[14px] font-bold text-(--color-text-primary)"
          />
          <p className="text-[10px] uppercase tracking-wide text-(--color-text-hint)">{node.type}</p>
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

      {hasText && (
        <Section title="Content">
          <textarea
            defaultValue={node.content?.text ?? ""}
            onChange={(e) => update((n) => ({ ...n, content: { ...n.content, text: e.target.value } }))}
            rows={2}
            className="w-full resize-none rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 py-2 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
          />
        </Section>
      )}

      <Section title="Transform">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={f.x} onChange={(v) => setFrame("x", v)} />
          <NumberField label="Y" value={f.y} onChange={(v) => setFrame("y", v)} />
          <NumberField label="W" value={f.width} onChange={(v) => setFrame("width", v)} />
          <NumberField label="H" value={f.height} onChange={(v) => setFrame("height", v)} />
        </div>
        <div className="mt-2">
          <NumberField label="Rotation" value={f.rotation ?? 0} onChange={(v) => setFrame("rotation", v)} suffix="deg" />
        </div>
      </Section>

      <Section title="Style">
        <div className="flex flex-col gap-2.5">
          <Row label="Color / tint">
            <ColorField value={style.color} onChange={(v) => setStyle({ color: v })} />
          </Row>
          {style.fontSize != null && (
            <Row label="Font size">
              <NumberField label="" value={style.fontSize} onChange={(v) => setStyle({ fontSize: v })} />
            </Row>
          )}
          <Row label="Opacity">
            <Slider value={style.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setStyle({ opacity: v })} />
          </Row>
          <Row label="Blur">
            <Slider value={style.blur ?? 0} min={0} max={40} step={1} onChange={(v) => setStyle({ blur: v })} />
          </Row>
          <Row label="Radius">
            <Slider value={style.borderRadius ?? 0} min={0} max={100} step={1} onChange={(v) => setStyle({ borderRadius: v })} />
          </Row>
        </div>
      </Section>

      <Section title="Layer">
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
                <NumberField label="" value={node.animation.entry.durationMs ?? 500} suffix="ms" onChange={(v) =>
                  update((n) => ({ ...n, animation: { ...n.animation, entry: { ...n.animation!.entry!, durationMs: v } } }))
                } />
              </Row>
              <Row label="Delay">
                <NumberField label="" value={node.animation.entry.delayMs ?? 0} suffix="ms" onChange={(v) =>
                  update((n) => ({ ...n, animation: { ...n.animation, entry: { ...n.animation!.entry!, delayMs: v } } }))
                } />
              </Row>
              <Row label="Easing">
                <Select value={node.animation.entry.easing ?? "easeOut"} options={EASINGS} onChange={(v) =>
                  update((n) => ({ ...n, animation: { ...n.animation, entry: { ...n.animation!.entry!, easing: v } } }))
                } />
              </Row>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
