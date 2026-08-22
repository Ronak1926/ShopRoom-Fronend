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
import { nodeLabel, type LayerMove } from "@/features/notifications/tree";
import { BUTTON_ACTIONS, BUTTON_ICON_OPTIONS } from "@/features/notifications/buttonPresets";
import type { CompositionNode, NodeStyle } from "@/features/notifications/types";
import { ColorField, NumberField, Row, Section, SegmentedGroup, Select, Slider, Toggle } from "./fields";
import AnimationSection from "./AnimationSection";

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
  /** Plays just this element's animation on the canvas. */
  onPreview?: (id: string) => void;
  onChangePreset: () => void;
}

/** Inspector for a BUTTON node — edits the label/icon children in place. */
export default function ButtonInspector({
  node,
  update,
  onDelete,
  onDuplicate,
  onMoveLayer,
  onToggleLock,
  onPreview,
  onChangePreset,
}: Props) {
  const f = node.frame;
  const style = node.style ?? {};
  const hidden = node.visible === false;
  const locked = !!node.locked;

  const children = node.children ?? [];
  const labelNode = children.find((c) => c.type === "TEXT");
  const iconNode = children.find((c) => c.type === "ICON");
  const label = labelNode?.content?.label ?? labelNode?.content?.text ?? "";
  const iconName = iconNode?.content?.icon;
  const iconFirst = children[0]?.type === "ICON";
  const iconPosition = !iconNode ? "none" : !labelNode ? "only" : iconFirst ? "left" : "right";
  const action = node.interaction?.onClick?.type ?? "NONE";

  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) =>
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  const setStyle = (patch: Partial<NodeStyle>) => update((n) => ({ ...n, style: { ...n.style, ...patch } }));

  /** Patches every child of a given type (label or icon). */
  const patchChild = (type: string, patch: (c: CompositionNode) => CompositionNode) =>
    update((n) => ({ ...n, children: (n.children ?? []).map((c) => (c.type === type ? patch(c) : c)) }));

  const setLabel = (text: string) =>
    patchChild("TEXT", (c) => ({ ...c, content: { ...c.content, label: text, text: undefined } }));

  /** Label colour drives the icon too, so a button never has mismatched parts. */
  const setForeground = (color: string) => {
    patchChild("TEXT", (c) => ({ ...c, style: { ...c.style, color } }));
    patchChild("ICON", (c) => ({ ...c, style: { ...c.style, color } }));
  };
  const setFontSize = (v: number) => patchChild("TEXT", (c) => ({ ...c, style: { ...c.style, fontSize: v } }));

  const setIconName = (icon: string) => patchChild("ICON", (c) => ({ ...c, content: { ...c.content, icon } }));

  /** Rebuilds the children array so the icon lands on the requested side. */
  const setIconPosition = (pos: "left" | "right" | "only" | "none") =>
    update((n) => {
      const kids = n.children ?? [];
      const text = kids.find((c) => c.type === "TEXT");
      const icon = kids.find((c) => c.type === "ICON");
      if (pos === "none") return { ...n, children: text ? [text] : [] };
      if (!icon) return n;
      if (pos === "only") return { ...n, children: [icon] };
      if (!text) return { ...n, children: [icon] };
      return { ...n, children: pos === "left" ? [icon, text] : [text, icon] };
    });

  const setAction = (type: string) =>
    update((n) => ({ ...n, interaction: { ...n.interaction, onClick: { ...n.interaction?.onClick, type } } }));
  const setActionUrl = (url: string) =>
    update((n) => ({
      ...n,
      interaction: { ...n.interaction, onClick: { type: n.interaction?.onClick?.type ?? "OPEN_URL", url } },
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
          <p className="text-[10px] uppercase tracking-wide text-(--color-text-hint)">Button</p>
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

      <Section title="Label">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Button text"
          className="w-full h-9 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
        />
        <button
          type="button"
          onClick={onChangePreset}
          className="mt-2 flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-(--color-border-default) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
        >
          <TuneOutlinedIcon sx={{ fontSize: 13 }} />
          Change style
        </button>
      </Section>

      <Section title="Tap Action">
        <div className="flex flex-col gap-2.5">
          <Row label="On tap">
            <Select value={action} options={BUTTON_ACTIONS} onChange={setAction} />
          </Row>
          {action === "OPEN_URL" && (
            <input
              value={node.interaction?.onClick?.url ?? ""}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full h-9 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 text-[12px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
            />
          )}
          <p className="text-[10px] leading-relaxed text-(--color-text-hint)">
            What happens when a customer taps this button in the notification.
          </p>
        </div>
      </Section>

      <Section title="Style">
        <div className="flex flex-col gap-2.5">
          <Row label="Fill">
            <ColorField
              value={style.backgroundColor ?? style.backgroundGradient?.stops[0]?.color}
              onChange={(v) => setStyle({ backgroundColor: v, backgroundGradient: undefined })}
            />
          </Row>
          <Row label="Text &amp; icon">
            <ColorField value={labelNode?.style?.color} onChange={setForeground} />
          </Row>
          <Row label="Border color">
            <ColorField
              value={style.border?.color}
              onChange={(v) => setStyle({ border: { ...style.border, color: v, width: style.border?.width ?? 1.5 } })}
            />
          </Row>
          <Row label="Font size">
            <NumberField label="" value={labelNode?.style?.fontSize ?? 14} suffix="px" onChange={setFontSize} />
          </Row>
          <Row label="Corner radius">
            <Slider
              value={style.borderRadius ?? 0}
              min={0}
              max={9999}
              step={1}
              onChange={(v) => setStyle({ borderRadius: v })}
            />
          </Row>
          <Row label="Opacity">
            <Slider value={style.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setStyle({ opacity: v })} />
          </Row>
          <Row label="Shadow">
            <Toggle
              checked={!!style.shadow?.enabled}
              onChange={(v) =>
                setStyle({
                  shadow: v
                    ? { enabled: true, x: 0, y: 6, blur: 16, spread: -4, color: "rgba(15,23,42,0.28)" }
                    : { ...style.shadow, enabled: false },
                })
              }
            />
          </Row>
        </div>
      </Section>

      <Section title="Icon">
        <div className="flex flex-col gap-2.5">
          <Row label="Enabled">
            <Toggle
              checked={!!iconNode}
              onChange={(v) =>
                v
                  ? update((n) => ({
                      ...n,
                      children: [
                        ...(n.children ?? []),
                        {
                          id: `btnic-${Math.random().toString(36).slice(2, 8)}`,
                          type: "ICON",
                          frame: { x: 0, y: 0, width: 18, height: 18 },
                          style: { color: labelNode?.style?.color ?? "#FFFFFF" },
                          content: { icon: "ArrowForward" },
                          visible: true,
                          locked: false,
                        },
                      ],
                    }))
                  : setIconPosition("none")
              }
            />
          </Row>
          {iconNode && (
            <>
              <Row label="Icon">
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
                >
                  {BUTTON_ICON_OPTIONS.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </Row>
              <div>
                <p className="text-[11px] text-(--color-text-hint) mb-1.5">Icon position</p>
                <SegmentedGroup
                  value={iconPosition === "none" ? "right" : iconPosition}
                  onChange={setIconPosition}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                    { value: "only", label: "Only" },
                  ]}
                />
              </div>
            </>
          )}
        </div>
      </Section>

      <Section title="Position &amp; Size">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={f.x} onChange={(v) => setFrame("x", v)} />
          <NumberField label="Y" value={f.y} onChange={(v) => setFrame("y", v)} />
          <NumberField label="W" value={f.width} onChange={(v) => setFrame("width", v)} />
          <NumberField label="H" value={f.height} onChange={(v) => setFrame("height", v)} />
        </div>
      </Section>

      <AnimationSection node={node} update={update} onPreview={onPreview} />

      <Section title="Layering">
        <div className="grid grid-cols-2 gap-1.5">
          {LAYER_BUTTONS.map(({ move, label: l, icon: Icon }) => (
            <button
              key={move}
              type="button"
              onClick={() => onMoveLayer(move)}
              className="flex items-center gap-1.5 h-8 px-2 rounded-lg border border-(--color-border-default) text-[11px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            >
              <Icon sx={{ fontSize: 14 }} />
              {l}
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
