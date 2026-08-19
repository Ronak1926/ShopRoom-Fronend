"use client";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { buildNodeStyle } from "@/components/notifications/nodeStyle";
import { getIcon } from "@/features/notifications/icons";
import { nodeLabel, type LayerMove } from "@/features/notifications/tree";
import { BADGE_LABEL_ICON_OPTIONS } from "@/features/notifications/badgeLabelPresets";
import { FONT_WEIGHT_OPTIONS } from "@/features/notifications/textPresets";
import type { CompositionNode, NodeStyle } from "@/features/notifications/types";
import { ColorField, NumberField, Row, Section, SegmentedGroup, Select, Slider, Toggle } from "./fields";
import type { ElementContent } from "@/features/notifications/types";
import type { ReactNode } from "react";

const ENTRY = ["NONE", "FADE_IN", "SLIDE_UP", "SLIDE_DOWN", "ZOOM_IN", "POP", "BOUNCE"] as const;

/** Plain helper (not a component) so the dynamically-resolved icon renders safely — mirrors NotificationRenderer's renderLeaf. */
function renderPreviewIcon(content: ElementContent): ReactNode {
  if (content.iconPosition === "right") return null;
  const Icon = getIcon(content.icon);
  return Icon ? <Icon style={{ fontSize: 13 }} /> : null;
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
  onChangePreset: () => void;
}

/** Shared inspector for BADGE and LABEL nodes — same property set, per spec §8. */
export default function BadgeLabelInspector({ node, update, onDelete, onDuplicate, onMoveLayer, onToggleLock, onChangePreset }: Props) {
  const f = node.frame;
  const style = node.style ?? {};
  const content = node.content ?? {};
  const hidden = node.visible === false;
  const locked = !!node.locked;
  const isBadge = node.type === "BADGE";
  const isPolygonShape = !!style.clipShape && style.clipShape !== "pill";
  const hasIcon = !!content.icon;

  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) =>
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  const setStyle = (patch: Partial<NodeStyle>) => update((n) => ({ ...n, style: { ...n.style, ...patch } }));
  const setContent = (patch: Partial<NonNullable<CompositionNode["content"]>>) =>
    update((n) => ({ ...n, content: { ...n.content, ...patch } }));
  const setAnim = (type: string) =>
    update((n) => ({
      ...n,
      animation: {
        ...n.animation,
        entry: type === "NONE" ? undefined : { type, durationMs: n.animation?.entry?.durationMs ?? 500, delayMs: n.animation?.entry?.delayMs ?? 0, easing: n.animation?.entry?.easing ?? "easeOut" },
      },
    }));

  const previewBox = buildNodeStyle({ ...node, frame: { ...f, width: 40, height: 40 } }, true);

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
        <input
          value={content.text ?? ""}
          onChange={(e) => setContent({ text: e.target.value })}
          className="w-full h-9 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
        />
      </Section>

      <Section title="Style">
        <div className="flex flex-col gap-2.5">
          <Row label={`${isBadge ? "Badge" : "Label"} style`}>
            <div className="flex items-center gap-2">
              <div
                style={{ ...previewBox, display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, transform: "scale(0.85)" }}
              >
                {renderPreviewIcon(content)}
              </div>
              <button
                type="button"
                onClick={onChangePreset}
                className="flex items-center gap-1 h-8 px-2.5 rounded-lg border border-(--color-border-default) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
              >
                <TuneOutlinedIcon sx={{ fontSize: 13 }} />
                Change
              </button>
            </div>
          </Row>
          <Row label="Background color">
            <ColorField value={style.backgroundColor ?? style.backgroundGradient?.stops[0]?.color} onChange={(v) => setStyle({ backgroundColor: v, backgroundGradient: undefined })} />
          </Row>
          <Row label="Text color">
            <ColorField value={style.color} onChange={(v) => setStyle({ color: v })} />
          </Row>
          <Row label="Border color">
            <ColorField value={style.border?.color} onChange={(v) => setStyle({ border: { ...style.border, color: v, width: style.border?.width ?? 1.5 } })} />
          </Row>
          <Row label="Font size">
            <NumberField label="" value={style.fontSize ?? 11} suffix="px" onChange={(v) => setStyle({ fontSize: v })} />
          </Row>
          <Row label="Font weight">
            <select
              value={String(style.fontWeight ?? 700)}
              onChange={(e) => setStyle({ fontWeight: Number(e.target.value) })}
              className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
            >
              {FONT_WEIGHT_OPTIONS.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </Row>
          <Row label="Padding">
            <Slider value={typeof style.padding === "number" ? style.padding : 8} min={0} max={32} step={1} onChange={(v) => setStyle({ padding: v })} />
          </Row>
          {!isPolygonShape && (
            <Row label="Border radius">
              <Slider
                value={style.clipShape === "pill" ? 9999 : (style.borderRadius ?? 0)}
                min={0}
                max={9999}
                step={1}
                onChange={(v) => setStyle({ borderRadius: v, clipShape: v >= 9999 ? "pill" : undefined })}
              />
            </Row>
          )}
          <Row label="Rotation">
            <Slider value={f.rotation ?? 0} min={-180} max={180} step={1} onChange={(v) => setFrame("rotation", v)} />
          </Row>
          <Row label="Opacity">
            <Slider value={style.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setStyle({ opacity: v })} />
          </Row>
          <Row label="Shadow">
            <Toggle
              checked={!!style.shadow?.enabled}
              onChange={(v) =>
                setStyle({ shadow: v ? { enabled: true, x: 0, y: 4, blur: 10, spread: 0, color: "rgba(15,23,42,0.25)" } : { ...style.shadow, enabled: false } })
              }
            />
          </Row>
          {style.shadow?.enabled && (
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="X" value={style.shadow.x ?? 0} onChange={(v) => setStyle({ shadow: { ...style.shadow, x: v } })} />
              <NumberField label="Y" value={style.shadow.y ?? 4} onChange={(v) => setStyle({ shadow: { ...style.shadow, y: v } })} />
              <NumberField label="Blur" value={style.shadow.blur ?? 10} onChange={(v) => setStyle({ shadow: { ...style.shadow, blur: v } })} />
              <Row label="Color">
                <ColorField value={style.shadow.color} onChange={(v) => setStyle({ shadow: { ...style.shadow, color: v } })} />
              </Row>
            </div>
          )}
        </div>
      </Section>

      <Section title="Icon">
        <div className="flex flex-col gap-2.5">
          <Row label="Enabled">
            <Toggle
              checked={hasIcon}
              onChange={(v) => setContent(v ? { icon: content.icon ?? "Star", iconPosition: content.iconPosition && content.iconPosition !== "none" ? content.iconPosition : "left" } : { icon: undefined, iconPosition: "none" })}
            />
          </Row>
          {hasIcon && (
            <>
              <Row label="Icon">
                <select
                  value={content.icon}
                  onChange={(e) => setContent({ icon: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
                >
                  {BADGE_LABEL_ICON_OPTIONS.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </Row>
              <div>
                <p className="text-[11px] text-(--color-text-hint) mb-1.5">Icon position</p>
                <SegmentedGroup
                  value={content.iconPosition === "right" || content.iconPosition === "only" ? content.iconPosition : "left"}
                  onChange={(v) => setContent({ iconPosition: v })}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                    { value: "only", label: "Only" },
                  ]}
                />
              </div>
              <Row label="Icon size">
                <NumberField label="" value={content.iconSize ?? (style.fontSize ?? 11) + 2} suffix="px" onChange={(v) => setContent({ iconSize: v })} />
              </Row>
            </>
          )}
        </div>
      </Section>

      <Section title="Animation">
        <div className="flex flex-col gap-2.5">
          <Row label="Entry">
            <Select value={node.animation?.entry?.type ?? "NONE"} options={ENTRY} onChange={setAnim} />
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

      <Section title="Position & Size">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={f.x} onChange={(v) => setFrame("x", v)} />
          <NumberField label="Y" value={f.y} onChange={(v) => setFrame("y", v)} />
          <NumberField label="W" value={f.width} onChange={(v) => setFrame("width", v)} />
          <NumberField label="H" value={f.height} onChange={(v) => setFrame("height", v)} />
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
    </>
  );
}
