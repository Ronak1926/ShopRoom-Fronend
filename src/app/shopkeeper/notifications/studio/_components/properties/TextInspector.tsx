"use client";

import { useRef } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import VerticalAlignTopOutlinedIcon from "@mui/icons-material/VerticalAlignTopOutlined";
import VerticalAlignCenterOutlinedIcon from "@mui/icons-material/VerticalAlignCenterOutlined";
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import DataObjectOutlinedIcon from "@mui/icons-material/DataObjectOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { nodeLabel, type LayerMove } from "@/features/notifications/tree";
import type { CompositionNode, NodeStyle } from "@/features/notifications/types";
import { TEXT_FONT_OPTIONS } from "@/features/notifications/fonts";
import { FONT_WEIGHT_OPTIONS, TEXT_VARIABLES } from "@/features/notifications/textPresets";
import { NumberField, Row, Section, SegmentedGroup, Select, Slider } from "./fields";
import { TextColorPicker } from "./TextColorPicker";
import TextEffectsSection from "./TextEffectsSection";
import { ENTRY, ATTENTION, EXIT, EASINGS } from "./animationOptions";

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
}

/** Rich TEXT-specific inspector shown in the right rail when a TEXT node is selected. */
export default function TextInspector({ node, update, onDelete, onDuplicate, onMoveLayer, onToggleLock }: Props) {
  const f = node.frame;
  const style = node.style ?? {};
  const hidden = node.visible === false;
  const locked = !!node.locked;
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) =>
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  const setStyle = (patch: Partial<NodeStyle>) => update((n) => ({ ...n, style: { ...n.style, ...patch } }));
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

  function insertVariable(token: string) {
    const ta = contentRef.current;
    const current = ta ? ta.value : (node.content?.text ?? "");
    const start = ta?.selectionStart ?? current.length;
    const end = ta?.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);
    if (ta) {
      ta.value = next;
      const pos = start + token.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    }
    update((n) => ({ ...n, content: { ...n.content, text: next } }));
  }

  return (
    <>
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

      <Section title="Content">
        <textarea
          ref={contentRef}
          defaultValue={node.content?.text ?? ""}
          onChange={(e) => update((n) => ({ ...n, content: { ...n.content, text: e.target.value } }))}
          rows={3}
          className="w-full resize-none rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 py-2 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
        />
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mt-3 mb-2">
          Insert Variable
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TEXT_VARIABLES.map((v) => (
            <button
              key={v.token}
              type="button"
              title={`Insert ${v.label}`}
              onClick={() => insertVariable(v.token)}
              className="flex items-center gap-1 h-6 px-2 rounded-md border border-(--color-border-default) text-[10px] font-medium text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
            >
              <DataObjectOutlinedIcon sx={{ fontSize: 11 }} />
              {v.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Text Alignment">
        <SegmentedGroup
          value={style.textAlign === "left" || style.textAlign === "right" ? style.textAlign : "center"}
          onChange={(v) => setStyle({ textAlign: v })}
          options={[
            { value: "left", label: "Left", icon: FormatAlignLeftOutlinedIcon },
            { value: "center", label: "Center", icon: FormatAlignCenterOutlinedIcon },
            { value: "right", label: "Right", icon: FormatAlignRightOutlinedIcon },
          ]}
        />
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-2.5">
          <Row label="Font family">
            <select
              value={style.fontFamily ?? "Inter"}
              onChange={(e) => setStyle({ fontFamily: e.target.value })}
              className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
            >
              {TEXT_FONT_OPTIONS.map((f2) => (
                <option key={f2.value} value={f2.value}>
                  {f2.label}
                </option>
              ))}
            </select>
          </Row>
          <Row label="Font size">
            <div className="flex items-center gap-2">
              <Slider value={style.fontSize ?? 16} min={8} max={96} step={1} onChange={(v) => setStyle({ fontSize: v })} />
              <NumberField label="" value={style.fontSize ?? 16} suffix="px" onChange={(v) => setStyle({ fontSize: v })} />
            </div>
          </Row>
          <Row label="Font weight">
            <select
              value={String(style.fontWeight ?? 400)}
              onChange={(e) => setStyle({ fontWeight: Number(e.target.value) })}
              className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
            >
              {FONT_WEIGHT_OPTIONS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </Row>
          <Row label="Line height">
            <Slider value={style.lineHeight ?? 1.4} min={0.8} max={3} step={0.05} onChange={(v) => setStyle({ lineHeight: v })} />
          </Row>
          <Row label="Letter spacing">
            <NumberField label="" value={style.letterSpacing ?? 0} suffix="px" onChange={(v) => setStyle({ letterSpacing: v })} />
          </Row>
          <Row label="Text transform">
            <Select
              value={style.textTransform ?? "none"}
              options={["none", "uppercase", "lowercase", "capitalize"]}
              onChange={(v) => setStyle({ textTransform: v as NodeStyle["textTransform"] })}
            />
          </Row>
        </div>
      </Section>

      <Section title="Text Color">
        <TextColorPicker value={style.color} onChange={(v) => setStyle({ color: v })} />
      </Section>

      <Section title="Effects">
        <TextEffectsSection style={style} setStyle={setStyle} />
      </Section>

      <Section title="Text Box">
        <div className="flex flex-col gap-3">
          <Row label="Padding">
            <NumberField label="" value={typeof style.padding === "number" ? style.padding : 0} suffix="px" onChange={(v) => setStyle({ padding: v })} />
          </Row>
          <div>
            <p className="text-[11px] text-(--color-text-hint) mb-1.5">Overflow</p>
            <SegmentedGroup
              value={style.overflow === "visible" || style.overflow === "clip" ? style.overflow : "hidden"}
              onChange={(v) => setStyle({ overflow: v })}
              options={[
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
                { value: "clip", label: "Clip" },
              ]}
            />
          </div>
          <div>
            <p className="text-[11px] text-(--color-text-hint) mb-1.5">Wrapping</p>
            <SegmentedGroup
              value={style.whiteSpace === "nowrap" ? "nowrap" : "normal"}
              onChange={(v) => setStyle({ whiteSpace: v })}
              options={[
                { value: "normal", label: "Wrap" },
                { value: "nowrap", label: "No Wrap" },
              ]}
            />
          </div>
          <div>
            <p className="text-[11px] text-(--color-text-hint) mb-1.5">Vertical Align</p>
            <SegmentedGroup
              value={style.verticalAlign === "top" || style.verticalAlign === "bottom" ? style.verticalAlign : "center"}
              onChange={(v) => setStyle({ verticalAlign: v })}
              options={[
                { value: "top", label: "Top", icon: VerticalAlignTopOutlinedIcon },
                { value: "center", label: "Center", icon: VerticalAlignCenterOutlinedIcon },
                { value: "bottom", label: "Bottom", icon: VerticalAlignBottomOutlinedIcon },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Position & Transform">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={f.x} onChange={(v) => setFrame("x", v)} />
          <NumberField label="Y" value={f.y} onChange={(v) => setFrame("y", v)} />
          <NumberField label="W" value={f.width} onChange={(v) => setFrame("width", v)} />
          <NumberField label="H" value={f.height} onChange={(v) => setFrame("height", v)} />
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <Slider value={f.rotation ?? 0} min={-180} max={180} step={1} onChange={(v) => setFrame("rotation", v)} />
          <NumberField label="" value={f.rotation ?? 0} suffix="deg" onChange={(v) => setFrame("rotation", v)} />
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
              <Row label="Easing">
                <Select
                  value={node.animation.entry.easing ?? "easeOut"}
                  options={EASINGS}
                  onChange={(v) => update((n) => ({ ...n, animation: { ...n.animation, entry: { ...n.animation!.entry!, easing: v } } }))}
                />
              </Row>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
