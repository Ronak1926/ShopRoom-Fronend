"use client";

import { useRef, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import NotificationRenderer from "@/components/notifications/NotificationRenderer";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import { absoluteOffset, findPath, flattenNodes, nodeLabel, type LayerMove } from "@/features/notifications/tree";
import { createDecoration } from "@/features/notifications/elementFactory";
import { DECORATION_GROUPS, EFFECT_GROUPS, SHAPE_GROUPS, LIBRARY_INDEX } from "@/features/notifications/sceneLibrary";
import { AssetThumb } from "./LibraryGrid";
import { NumberField, ColorField, Slider } from "./properties/fields";
import SelectionOverlay, { type ResizeHandleId } from "./SelectionOverlay";
import type { CompositionNode, Frame, NodeStyle, NotificationDesign } from "@/features/notifications/types";

const ASSET_GROUPS = [...DECORATION_GROUPS, ...SHAPE_GROUPS, ...EFFECT_GROUPS];

const LAYER_BUTTONS: { move: LayerMove; label: string; icon: typeof ArrowUpwardOutlinedIcon }[] = [
  { move: "forward", label: "Bring Forward", icon: ArrowUpwardOutlinedIcon },
  { move: "front", label: "Bring to Front", icon: FlipToFrontOutlinedIcon },
  { move: "backward", label: "Send Backward", icon: ArrowDownwardOutlinedIcon },
  { move: "back", label: "Send to Back", icon: FlipToBackOutlinedIcon },
];

function applyResize(o: Frame, h: ResizeHandleId, dx: number, dy: number): Partial<Frame> {
  let { x, y, width, height } = o;
  if (h.includes("e")) width = Math.max(8, o.width + dx);
  if (h.includes("s")) height = Math.max(8, o.height + dy);
  if (h.includes("w")) {
    width = Math.max(8, o.width - dx);
    x = o.x + (o.width - width);
  }
  if (h.includes("n")) {
    height = Math.max(8, o.height - dy);
    y = o.y + (o.height - height);
  }
  return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
}

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  updateElement: (id: string, patch: (n: CompositionNode) => CompositionNode) => void;
  onBeginInteraction: () => void;
  onUpdateLive: (id: string, patch: (n: CompositionNode) => CompositionNode) => void;
  onEndInteraction: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveLayer: (id: string, move: LayerMove) => void;
  onToggleLock: (id: string) => void;
  addToScene: (node: CompositionNode) => void;
  onResetScene: () => void;
  onClose: () => void;
}

/**
 * The dedicated Scene Builder workspace: a scene-only mini canvas plus a
 * compact toolbar, properties, layers and layering block — everything a
 * shopkeeper needs to focus purely on the background composition without the
 * rest of the notification's content getting in the way.
 */
export default function SceneBuilderPanel({
  width,
  design,
  selectedId,
  onSelect,
  updateElement,
  onBeginInteraction,
  onUpdateLive,
  onEndInteraction,
  onDelete,
  onDuplicate,
  onMoveLayer,
  onToggleLock,
  addToScene,
  onResetScene,
  onClose,
}: Props) {
  const [tool, setTool] = useState<"select" | "pan">("select");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panOrigin = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const dragOrigin = useRef<Frame | null>(null);

  const sceneGroup = design?.elements.find((n) => n.id === "scene");
  const sceneChildren = sceneGroup?.children ?? [];
  const canvasW = design?.canvas.width ?? 320;
  const canvasH = design?.canvas.height ?? 560;

  const path = selectedId ? findPath(sceneChildren, selectedId) : null;
  const offset = path ? absoluteOffset(path.parents) : null;
  const selected = path && offset ? path.node : null;

  const fitScale = Math.min(220 / canvasW, 300 / canvasH);
  const scale = fitScale * zoom;

  const startDrag = () => {
    if (selected) {
      dragOrigin.current = { ...selected.frame };
      onBeginInteraction();
    }
  };
  const move = (dx: number, dy: number) => {
    const o = dragOrigin.current;
    if (!o || !selectedId) return;
    onUpdateLive(selectedId, (n) => ({ ...n, frame: { ...n.frame, x: Math.round(o.x + dx), y: Math.round(o.y + dy) } }));
  };
  const resize = (h: ResizeHandleId, dx: number, dy: number) => {
    const o = dragOrigin.current;
    if (!o || !selectedId) return;
    onUpdateLive(selectedId, (n) => ({ ...n, frame: { ...n.frame, ...applyResize(o, h, dx, dy) } }));
  };
  const rotate = (deg: number) => {
    if (!selectedId) return;
    onUpdateLive(selectedId, (n) => ({ ...n, frame: { ...n.frame, rotation: deg } }));
  };
  const endDrag = () => {
    dragOrigin.current = null;
    onEndInteraction();
  };

  const beginPan = (e: React.PointerEvent) => {
    if (tool !== "pan") return;
    panOrigin.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    const onMove = (ev: PointerEvent) => {
      const o = panOrigin.current;
      if (!o) return;
      setPan({ x: o.px + (ev.clientX - o.x), y: o.py + (ev.clientY - o.y) });
    };
    const onUp = () => {
      panOrigin.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const quickAdd = (assetId: string) => {
    const item = LIBRARY_INDEX[assetId];
    if (item) addToScene(createDecoration(item, canvasW, canvasH, 200));
    setMenuOpen(false);
  };

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex overflow-hidden bg-(--color-bg-surface)"
    >
      {/* Mini vertical toolbar */}
      <div className="w-12 shrink-0 flex flex-col items-center gap-1 py-3 border-r border-(--color-border-default)">
        <ToolButton title="Select" active={tool === "select"} onClick={() => setTool("select")}>
          <NearMeOutlinedIcon sx={{ fontSize: 17 }} />
        </ToolButton>
        <ToolButton title="Pan" active={tool === "pan"} onClick={() => setTool("pan")}>
          <PanToolOutlinedIcon sx={{ fontSize: 16 }} />
        </ToolButton>
        <div className="w-6 h-px bg-(--color-border-default) my-1" />
        <ToolButton title="Add circle" onClick={() => quickAdd("shape-circle")}>
          <AddCircleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
        </ToolButton>
        <div className="relative">
          <ToolButton title="More tools" active={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            <MoreVertOutlinedIcon sx={{ fontSize: 17 }} />
          </ToolButton>
          {menuOpen && (
            <div className="absolute left-11 top-0 z-50 w-44 rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-(--shadow-lg) py-1.5">
              <MenuAction icon={AddCircleOutlineOutlinedIcon} label="Add sparkle" onClick={() => quickAdd("sparkle")} />
              <MenuAction icon={AddCircleOutlineOutlinedIcon} label="Add glow" onClick={() => quickAdd("glow")} />
              <MenuAction
                icon={ContentCopyOutlinedIcon}
                label="Duplicate selected"
                disabled={!selected}
                onClick={() => {
                  if (selectedId) onDuplicate(selectedId);
                  setMenuOpen(false);
                }}
              />
              <MenuAction
                icon={RestartAltOutlinedIcon}
                label="Reset scene"
                onClick={() => {
                  onResetScene();
                  setMenuOpen(false);
                }}
              />
            </div>
          )}
        </div>
        <div className="w-6 h-px bg-(--color-border-default) my-1" />
        <ToolButton title="Zoom in" onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}>
          <ZoomInOutlinedIcon sx={{ fontSize: 17 }} />
        </ToolButton>
        <ToolButton title="Zoom out" onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(2)))}>
          <ZoomOutOutlinedIcon sx={{ fontSize: 17 }} />
        </ToolButton>
        <div className="w-6 h-px bg-(--color-border-default) my-1" />
        <ToolButton
          title="Delete selected"
          danger
          disabled={!selected}
          onClick={() => selectedId && onDelete(selectedId)}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
        </ToolButton>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-w-0 flex flex-col border-r border-(--color-border-default)">
        <div className="flex items-center justify-between px-3 h-11 shrink-0 border-b border-(--color-border-default)">
          <span className="text-[12.5px] font-bold text-(--color-text-primary)">Scene Builder</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGrid((v) => !v)}
              className={`flex items-center gap-1.5 h-6 px-1 rounded-full border transition-colors cursor-pointer ${
                showGrid ? "bg-(--color-brand-primary) border-(--color-brand-primary)" : "bg-(--color-bg-surface-hover) border-(--color-border-default)"
              }`}
              title="Toggle grid"
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform ${showGrid ? "translate-x-3" : "translate-x-0"}`}
              />
            </button>
            <span className="text-[10px] font-medium text-(--color-text-hint)">Grid</span>
            <button
              type="button"
              onClick={onClose}
              title="Close Scene Builder"
              className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) cursor-pointer"
            >
              <CloseOutlinedIcon sx={{ fontSize: 15 }} />
            </button>
          </div>
        </div>

        <div
          onPointerDown={beginPan}
          style={{ cursor: tool === "pan" ? "grab" : "default" }}
          className="flex-1 min-h-0 overflow-hidden flex items-center justify-center"
        >
          {!sceneGroup ? (
            <p className="text-[12px] text-(--color-text-hint) text-center px-6">
              Apply a scene or start a blank one to use the Scene Builder.
            </p>
          ) : (
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px)`,
                width: canvasW * scale,
                height: canvasH * scale,
                backgroundImage: showGrid
                  ? "radial-gradient(circle, var(--color-border-default) 1px, transparent 1px)"
                  : undefined,
                backgroundSize: showGrid ? `${10 * scale}px ${10 * scale}px` : undefined,
              }}
              className="relative shrink-0 rounded-lg overflow-hidden border border-(--color-border-default) bg-(--color-bg-page)"
            >
              <NotificationRenderer
                design={{ ...design!, elements: sceneChildren, canvas: { ...design!.canvas, background: design!.canvas.background } }}
                context={EDITOR_CONTEXT}
                scale={scale}
                selectedId={selectedId}
                onSelect={(id) => onSelect(id || null)}
              />
              {selected && offset && tool === "select" && (
                <SelectionOverlay
                  frame={selected.frame}
                  scale={scale}
                  offset={offset}
                  locked={!!selected.locked}
                  onStart={startDrag}
                  onMove={move}
                  onResize={resize}
                  onRotate={rotate}
                  onEnd={endDrag}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Element Properties / Layers / Layering / Delete */}
      <div className="w-56 shrink-0 overflow-y-auto">
        {selected ? (
          <ElementProperties
            key={selected.id}
            node={selected}
            update={(patch) => updateElement(selected.id, patch)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-2 px-5 py-10 text-(--color-text-hint)">
            <TuneOutlinedIcon sx={{ fontSize: 24 }} />
            <p className="text-[12px]">Select a layer in the scene to edit it.</p>
          </div>
        )}

        <div className="px-4 py-3 border-t border-(--color-border-default)">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
            Layers in Scene
          </p>
          <div className="flex flex-col gap-0.5">
            {flattenNodes(sceneChildren).map(({ node }) => {
              const active = selectedId === node.id;
              const hidden = node.visible === false;
              const locked = !!node.locked;
              return (
                <div
                  key={node.id}
                  onClick={() => onSelect(node.id)}
                  className={`group flex items-center gap-2 h-8 px-1.5 rounded-lg cursor-pointer transition-colors ${
                    active ? "bg-(--color-brand-primary-light)" : "hover:bg-(--color-bg-surface-hover)"
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center shrink-0" style={{ color: node.style?.color }}>
                    <AssetThumb item={{ assetId: node.asset?.assetId ?? "", name: "", width: 16, height: 16, color: node.style?.color }} />
                  </span>
                  <span
                    className={`text-[12px] truncate ${
                      active ? "font-semibold text-(--color-brand-primary)" : hidden ? "text-(--color-text-hint) line-through" : "text-(--color-text-secondary)"
                    }`}
                  >
                    {nodeLabel(node)}
                  </span>
                  <button
                    type="button"
                    title={locked ? "Unlock" : "Lock"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(node.id);
                    }}
                    className={`ml-auto w-5 h-5 flex items-center justify-center rounded cursor-pointer ${
                      locked ? "text-(--color-brand-primary)" : "text-(--color-text-hint) opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {locked ? <LockOutlinedIcon sx={{ fontSize: 13 }} /> : <LockOpenOutlinedIcon sx={{ fontSize: 13 }} />}
                  </button>
                  <button
                    type="button"
                    title={hidden ? "Show" : "Hide"}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(node.id, (n) => ({ ...n, visible: n.visible === false }));
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded text-(--color-text-hint) hover:text-(--color-text-primary) cursor-pointer"
                  >
                    {hidden ? <VisibilityOffOutlinedIcon sx={{ fontSize: 13 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />}
                  </button>
                </div>
              );
            })}
            {!sceneChildren.length && (
              <p className="text-[12px] text-(--color-text-hint) py-3">No layers yet.</p>
            )}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-(--color-border-default)">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
            Layering
          </p>
          <div className="flex flex-col gap-1">
            {LAYER_BUTTONS.map(({ move: m, label, icon: Icon }) => (
              <button
                key={m}
                type="button"
                disabled={!selected}
                onClick={() => selectedId && onMoveLayer(selectedId, m)}
                className="flex items-center gap-2 h-8 px-2 rounded-lg text-[12px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Icon sx={{ fontSize: 15 }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3">
          <button
            type="button"
            disabled={!selected}
            onClick={() => selectedId && onDelete(selectedId)}
            className="w-full h-9 rounded-lg bg-(--color-danger-light) text-[12px] font-semibold text-(--color-danger) hover:bg-(--color-danger) hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
            Delete Element
          </button>
        </div>
      </div>
    </aside>
  );
}

function ToolButton({
  title,
  active,
  danger,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
          : danger
            ? "text-(--color-danger) hover:bg-(--color-danger-light)"
            : "text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary)"
      }`}
    >
      {children}
    </button>
  );
}

function MenuAction({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: typeof AddCircleOutlineOutlinedIcon;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 h-8 text-[12px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      <Icon sx={{ fontSize: 15 }} />
      {label}
    </button>
  );
}

function ElementProperties({
  node,
  update,
}: {
  node: CompositionNode;
  update: (patch: (n: CompositionNode) => CompositionNode) => void;
}) {
  const f = node.frame;
  const style = node.style ?? {};
  const [changeOpen, setChangeOpen] = useState(false);

  const setFrame = (k: "x" | "y" | "width" | "height" | "rotation", v: number) =>
    update((n) => ({ ...n, frame: { ...n.frame, [k]: v } }));
  const setStyle = (patch: Partial<NodeStyle>) => update((n) => ({ ...n, style: { ...n.style, ...patch } }));

  return (
    <div className="px-4 py-3 border-b border-(--color-border-default)">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
        Element Properties
      </p>

      <div className="flex items-center justify-between gap-2 mb-3">
        <input
          value={nodeLabel(node)}
          onChange={(e) => update((n) => ({ ...n, name: e.target.value }))}
          className="min-w-0 flex-1 bg-transparent border-0 outline-none text-[13px] font-semibold text-(--color-text-primary)"
        />
        <button
          type="button"
          onClick={() => setChangeOpen((v) => !v)}
          className="shrink-0 h-6 px-2 rounded-md border border-(--color-border-default) text-[10px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) cursor-pointer"
        >
          Change
        </button>
      </div>
      {changeOpen && (
        <select
          value={node.asset?.assetId ?? ""}
          onChange={(e) => {
            const item = LIBRARY_INDEX[e.target.value];
            update((n) => ({ ...n, asset: { type: "SVG", assetId: e.target.value }, name: item?.name ?? n.name }));
            setChangeOpen(false);
          }}
          className="w-full h-8 mb-3 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] text-(--color-text-primary) cursor-pointer"
        >
          {ASSET_GROUPS.map((g) => (
            <optgroup key={g.id} label={g.label}>
              {g.items.map((i) => (
                <option key={i.assetId} value={i.assetId}>
                  {i.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}

      <p className="text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-1.5">
        Position
      </p>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <NumberField label="X" value={f.x} onChange={(v) => setFrame("x", v)} />
        <NumberField label="Y" value={f.y} onChange={(v) => setFrame("y", v)} />
      </div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-1.5">Size</p>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <NumberField label="W" value={f.width} onChange={(v) => setFrame("width", v)} />
        <NumberField label="H" value={f.height} onChange={(v) => setFrame("height", v)} />
      </div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-1.5">
        Rotation
      </p>
      <div className="flex items-center gap-2 mb-3">
        <Slider value={f.rotation ?? 0} min={-180} max={180} step={1} onChange={(v) => setFrame("rotation", v)} />
        <span className="text-[11px] text-(--color-text-hint) w-8 text-right">{f.rotation ?? 0}°</span>
      </div>

      <p className="text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-1.5">Style</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-(--color-text-secondary)">Opacity</span>
          <Slider value={style.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setStyle({ opacity: v })} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-(--color-text-secondary)">Color</span>
          <ColorField value={style.color} onChange={(v) => setStyle({ color: v })} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-(--color-text-secondary)">Blur</span>
          <Slider value={style.blur ?? 0} min={0} max={40} step={1} onChange={(v) => setStyle({ blur: v })} />
        </div>
      </div>
    </div>
  );
}
