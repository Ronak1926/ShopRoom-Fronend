"use client";

import { useState } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LibraryGrid, { AssetThumb } from "./LibraryGrid";
import { DECORATION_GROUPS, EFFECT_GROUPS, SHAPE_GROUPS, type LibraryItem } from "@/features/notifications/sceneLibrary";
import type { CompositionNode, NodeStyle } from "@/features/notifications/types";

const ELEMENT_GROUP_IDS = ["nature", "landscape", "atmosphere"];
const DECORATION_GROUP_IDS = ["particles", "sale", "product"];
const ELEMENT_GROUPS = DECORATION_GROUPS.filter((g) => ELEMENT_GROUP_IDS.includes(g.id));
const DECOR_GROUPS = DECORATION_GROUPS.filter((g) => DECORATION_GROUP_IDS.includes(g.id));

const TABS = [
  { id: "elements", label: "Elements", groups: ELEMENT_GROUPS },
  { id: "shapes", label: "Shapes", groups: SHAPE_GROUPS },
  { id: "decorations", label: "Decorations", groups: DECOR_GROUPS },
  { id: "effects", label: "Effects", groups: EFFECT_GROUPS },
] as const;
type TabId = (typeof TABS)[number]["id"];

interface Props {
  sceneName: string;
  sceneChildren: CompositionNode[];
  sceneStyle?: NodeStyle;
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onInsert: (item: LibraryItem) => void;
  onSetSceneStyle: (patch: Partial<NodeStyle>) => void;
  onNewBlankScene: () => void;
  onBack: () => void;
}

/** "Build Your Own Scene" — the scene-editing sub-view of the left panel. */
export default function BuildYourOwnScenePanel({
  sceneName,
  sceneChildren,
  sceneStyle,
  selectedId,
  onSelectElement,
  onInsert,
  onSetSceneStyle,
  onNewBlankScene,
  onBack,
}: Props) {
  const [tab, setTab] = useState<TabId>("elements");
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  const tint = tintHex(sceneStyle?.backgroundColor);
  const opacityPct = Math.round((sceneStyle?.opacity ?? 1) * 100);
  const blurPx = sceneStyle?.blur ?? 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Build Your Own Scene</h2>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-0.5 text-[12px] font-semibold text-(--color-brand-primary) hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />
          Back
        </button>
      </div>

      <div className="px-4 flex items-center gap-3 border-b border-(--color-border-default)">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`pb-2.5 text-[12.5px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              tab === t.id
                ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 border-b border-(--color-border-default)">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
            Drag elements to canvas
          </p>
          <LibraryGrid groups={active.groups} onInsert={onInsert} searchPlaceholder={`Search ${active.label.toLowerCase()}...`} />
        </div>

        <div className="p-4 border-b border-(--color-border-default) flex flex-col gap-3">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
            Scene Settings
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-(--color-text-secondary)">Canvas Tint</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={tint ?? "#5B47D4"}
                onChange={(e) => onSetSceneStyle({ backgroundColor: `${e.target.value}33` })}
                className="w-8 h-7 rounded-md border border-(--color-border-default) bg-transparent cursor-pointer"
              />
              {tint && (
                <button
                  type="button"
                  title="Clear tint"
                  onClick={() => onSetSceneStyle({ backgroundColor: undefined })}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-hint) hover:text-(--color-danger) cursor-pointer"
                >
                  <CloseOutlinedIcon sx={{ fontSize: 13 }} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-(--color-text-secondary)">
              Scene Opacity <span className="text-(--color-text-hint)">({opacityPct}%)</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={opacityPct}
              onChange={(e) => onSetSceneStyle({ opacity: Number(e.target.value) / 100 })}
              className="w-28 accent-(--color-brand-primary)"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-(--color-text-secondary)">
              Scene Blur <span className="text-(--color-text-hint)">({blurPx}px)</span>
            </span>
            <input
              type="range"
              min={0}
              max={20}
              value={blurPx}
              onChange={(e) => onSetSceneStyle({ blur: Number(e.target.value) })}
              className="w-28 accent-(--color-brand-primary)"
            />
          </div>
        </div>

        <div className="p-4 border-b border-(--color-border-default)">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
            Create Your Own Scene
          </p>
          <button
            type="button"
            onClick={onNewBlankScene}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-dashed border-(--color-brand-primary) text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
              <AddOutlinedIcon sx={{ fontSize: 18 }} />
            </span>
            <span className="text-left">
              <span className="block text-[12px] font-semibold">New Blank Scene</span>
              <span className="block text-[10px] text-(--color-text-hint)">Build from scratch with our scene builder</span>
            </span>
          </button>
        </div>

        <div className="p-4">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
            Scene Elements ({sceneName})
          </p>
          {sceneChildren.length ? (
            <div className="grid grid-cols-4 gap-2">
              {sceneChildren.map((n) => {
                const item: LibraryItem = {
                  assetId: n.asset?.assetId ?? "",
                  name: n.name ?? "Layer",
                  width: n.frame.width,
                  height: n.frame.height,
                  color: n.style?.color,
                  opacity: n.style?.opacity,
                };
                const active = selectedId === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onSelectElement(n.id)}
                    title={n.name}
                    className={`flex items-center justify-center aspect-square rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? "border-(--color-brand-primary) ring-1 ring-(--color-brand-primary) bg-(--color-brand-primary-light)"
                        : "border-(--color-border-default) hover:border-(--color-brand-primary)"
                    }`}
                  >
                    <AssetThumb item={item} />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[12px] text-(--color-text-hint)">
              No layers yet — add elements above or in the Scene Builder.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Extracts the base #rrggbb from a possibly-alpha-suffixed tint colour. */
function tintHex(c?: string): string | null {
  if (!c) return null;
  const m = /^#([0-9a-fA-F]{6})/.exec(c);
  return m ? `#${m[1]}` : null;
}
