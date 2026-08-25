"use client";

import { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {
  SCENE_CATEGORIES,
  filterScenes,
  SCENES,
  type Scene,
  type SceneCategory,
} from "@/features/notifications/scenes";
import { SCENE_CATEGORY_ICONS } from "./sceneCategoryIcons";
import ScenePreview from "./ScenePreview";
import BuildYourOwnScenePanel from "./BuildYourOwnScenePanel";
import BackgroundUploadsTab from "./BackgroundUploadsTab";
import type { LibraryItem } from "@/features/notifications/sceneLibrary";
import type { Background, NodeStyle, NotificationDesign } from "@/features/notifications/types";

type Tab = "background" | "scenes" | "uploads";

interface Props {
  width: number;
  design: NotificationDesign | null;
  appliedSceneId: string | null;
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onApplyScene: (scene: Scene) => void;
  onDetachScene: () => void;
  onSetBackground: (bg: Background) => void;
  onInsertIntoScene: (item: LibraryItem) => void;
  onSetSceneStyle: (patch: Partial<NodeStyle>) => void;
  onNewBlankScene: () => void;
  onOpenBackgroundBuilder: () => void;
  onToggleLock: (id: string) => void;
  /** Uploads tab — wipes every element for a photo-only notification. */
  onClearElements: () => void;
  /** Sets a photo background, dropping the scene/decorations in the same step. */
  onSetPhotoBackground: (url: string) => void;
}

export default function BackgroundScenesPanel({
  width,
  design,
  appliedSceneId,
  selectedId,
  onSelectElement,
  onApplyScene,
  onDetachScene,
  onSetBackground,
  onInsertIntoScene,
  onSetSceneStyle,
  onNewBlankScene,
  onOpenBackgroundBuilder,
  onToggleLock,
  onClearElements,
  onSetPhotoBackground,
}: Props) {
  const [tab, setTab] = useState<Tab>("scenes");
  // Whether the "Build Your Own Scene" editor view (Elements/Shapes/
  // Decorations/Effects tabs + scene settings) replaces the scene browser.
  // Purely a left-panel concern now — there's no separate scene canvas to
  // coordinate with.
  const [editingScene, setEditingScene] = useState(false);
  const sceneGroup = design?.elements.find((n) => n.id === "scene");
  const appliedPreset = SCENES.find((s) => s.id === appliedSceneId);
  const sceneName = appliedPreset?.name ?? sceneGroup?.name ?? "My Scene";
  // A photo background IS the whole background composition — layering a scene's
  // leaves/pedestal/glow on top of it just looks cluttered, so scenes are
  // locked out until the photo is removed. Text/badges/labels stay available.
  const bg = design?.canvas.background;
  const photoBackgroundUrl = bg?.type === "IMAGE" ? bg.imageUrl : undefined;
  const scenesLocked = !!photoBackgroundUrl;

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-hidden"
    >
      {tab === "scenes" && editingScene && sceneGroup ? (
        <BuildYourOwnScenePanel
          sceneName={sceneName}
          sceneChildren={sceneGroup.children ?? []}
          sceneStyle={sceneGroup.style}
          sceneLocked={!!sceneGroup.locked}
          selectedId={selectedId}
          onSelectElement={onSelectElement}
          onInsert={onInsertIntoScene}
          onSetSceneStyle={onSetSceneStyle}
          onToggleSceneLock={() => onToggleLock("scene")}
          onNewBlankScene={onNewBlankScene}
          onBack={() => setEditingScene(false)}
        />
      ) : (
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-[15px] font-bold text-(--color-text-primary)">Backgrounds &amp; Scenes</h2>
          </div>

          <div className="px-4 flex items-center gap-4 border-b border-(--color-border-default)">
            {(["background", "scenes", "uploads"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`pb-2.5 text-[13px] font-medium capitalize border-b-2 -mb-px transition-colors cursor-pointer ${
                  tab === t
                    ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                    : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === "scenes" && scenesLocked && (
              <ScenesLockedNotice onRemovePhoto={() => onSetBackground({ type: "SOLID", color: "#FFFFFF" })} />
            )}
            {tab === "scenes" && !scenesLocked && (
              <ScenesTab
                appliedSceneId={appliedSceneId}
                hasScene={!!sceneGroup}
                sceneLocked={!!sceneGroup?.locked}
                onApply={(s) => {
                  onApplyScene(s);
                  setEditingScene(true);
                }}
                onDetach={onDetachScene}
                onCustomize={() => setEditingScene(true)}
                onToggleLock={() => onToggleLock("scene")}
                onNewBlank={() => {
                  onNewBlankScene();
                  setEditingScene(true);
                }}
              />
            )}
            {tab === "background" && (
              <BackgroundTab
                appliedSceneId={appliedSceneId}
                hasScene={!!sceneGroup}
                onSet={onSetBackground}
                onDetach={onDetachScene}
                onOpenBackgroundBuilder={onOpenBackgroundBuilder}
                onOpenSceneEditor={() => {
                  if (!sceneGroup) onNewBlankScene();
                  setEditingScene(true);
                }}
                onOpenUploads={() => setTab("uploads")}
                scenesLocked={scenesLocked}
              />
            )}
            {tab === "uploads" && (
              <BackgroundUploadsTab
                currentImageUrl={
                  design?.canvas.background?.type === "IMAGE" ? design.canvas.background.imageUrl : undefined
                }
                hasElements={!!design?.elements.length}
                onSetImage={onSetPhotoBackground}
                onClearImage={() => onSetBackground({ type: "SOLID", color: "#FFFFFF" })}
                onClearElements={onClearElements}
              />
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

/** Shown instead of the scene browser while a photo background is in use. */
function ScenesLockedNotice({ onRemovePhoto }: { onRemovePhoto: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 rounded-xl border border-(--color-border-default) bg-(--color-bg-page) py-8 px-4">
      <ImageOutlinedIcon sx={{ fontSize: 26, color: "var(--color-brand-primary)" }} />
      <p className="text-[12px] font-semibold text-(--color-text-primary)">Photo background in use</p>
      <p className="text-[11px] leading-relaxed text-(--color-text-secondary)">
        Scenes replace the background with their own artwork, so they&apos;re unavailable while a photo is set. You can
        still add text, badges and labels on top.
      </p>
      <button
        type="button"
        onClick={onRemovePhoto}
        className="mt-1 h-8 px-3 rounded-lg border border-(--color-border-default) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        Remove photo to use scenes
      </button>
    </div>
  );
}

// ── Scenes ───────────────────────────────────────────────────────────────────

function ScenesTab({
  appliedSceneId,
  hasScene,
  sceneLocked,
  onApply,
  onDetach,
  onCustomize,
  onToggleLock,
  onNewBlank,
}: {
  appliedSceneId: string | null;
  hasScene: boolean;
  sceneLocked: boolean;
  onApply: (s: Scene) => void;
  onDetach: () => void;
  onCustomize: () => void;
  onToggleLock: () => void;
  onNewBlank: () => void;
}) {
  const [category, setCategory] = useState<SceneCategory>("All");
  const [query, setQuery] = useState("");
  const scenes = filterScenes(category, query);
  const applied = SCENES.find((s) => s.id === appliedSceneId) ?? null;

  return (
    <>
      {(applied || hasScene) && (
        <div className="mb-4 rounded-xl border border-(--color-brand-primary) bg-(--color-brand-primary-light) p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-(--color-brand-primary) mb-1.5">
            Selected scene
          </p>
          <div className="flex items-center gap-2.5">
            {applied ? (
              <span className="w-16 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
                <ScenePreview scene={applied} />
              </span>
            ) : (
              <span className="w-16 h-8 shrink-0 rounded-lg bg-(--color-bg-surface) flex items-center justify-center text-(--color-text-hint)">
                <TuneOutlinedIcon sx={{ fontSize: 18 }} />
              </span>
            )}
            <span className="text-[12px] font-semibold text-(--color-text-primary) truncate">
              {applied?.name ?? "Custom scene"}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={onCustomize}
              className="h-7 rounded-lg bg-(--color-bg-surface) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary) hover:text-white transition-colors cursor-pointer"
            >
              Customize
            </button>
            <button
              type="button"
              onClick={onDetach}
              className="h-7 rounded-lg bg-(--color-bg-surface) text-[11px] font-semibold text-(--color-text-secondary) hover:text-(--color-danger) transition-colors cursor-pointer"
            >
              Detach scene
            </button>
          </div>
          <button
            type="button"
            onClick={onToggleLock}
            title={
              sceneLocked
                ? "Unlock background — allow selecting/moving it as a whole again"
                : "Lock background — so it can't be selected or dragged while you edit individual elements"
            }
            className={`mt-1.5 w-full flex items-center justify-center gap-1.5 h-7 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              sceneLocked
                ? "bg-(--color-brand-primary) text-white"
                : "bg-(--color-bg-surface) text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {sceneLocked ? <LockOutlinedIcon sx={{ fontSize: 13 }} /> : <LockOpenOutlinedIcon sx={{ fontSize: 13 }} />}
            {sceneLocked ? "Background locked" : "Lock background"}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 h-9 px-3 mb-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
        <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search scenes..."
          className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
        />
      </div>

      <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
        Scene categories
      </p>
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {SCENE_CATEGORIES.map((c) => {
          const Icon = SCENE_CATEGORY_ICONS[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              title={c}
              className={`flex flex-col items-center justify-center gap-1 h-14 rounded-xl border text-[10px] font-medium transition-colors cursor-pointer ${
                active
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                  : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
              }`}
            >
              <Icon sx={{ fontSize: 18 }} />
              <span className="truncate w-full text-center px-0.5">{c}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
        ShopRoom scenes
      </p>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {scenes.map((scene) => {
          const isApplied = scene.id === appliedSceneId;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onApply(scene)}
              title={`Apply ${scene.name}`}
              className={`relative text-left rounded-xl border overflow-hidden transition-colors cursor-pointer ${
                isApplied
                  ? "border-(--color-brand-primary) ring-1 ring-(--color-brand-primary)"
                  : "border-(--color-border-default) hover:border-(--color-brand-primary)"
              }`}
            >
              <ScenePreview scene={scene} />
              {isApplied && (
                <CheckCircleIcon
                  sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
                  className="absolute top-1.5 right-1.5"
                />
              )}
              <span className="flex items-center justify-between px-2.5 py-1.5 gap-1">
                <span className="text-[11px] font-semibold text-(--color-text-primary) truncate">
                  {scene.name}
                </span>
                <span className="text-[9px] uppercase tracking-wide text-(--color-text-hint) shrink-0">
                  {scene.category}
                </span>
              </span>
            </button>
          );
        })}
        {!scenes.length && (
          <p className="col-span-2 text-[12px] text-(--color-text-hint) py-6 text-center">
            No scenes match.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onNewBlank}
        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-dashed border-(--color-brand-primary) text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center">
          <AddOutlinedIcon sx={{ fontSize: 18 }} />
        </span>
        <span className="text-left">
          <span className="block text-[12px] font-semibold">New Blank Scene</span>
          <span className="block text-[10px] text-(--color-text-hint)">Build from scratch</span>
        </span>
      </button>
    </>
  );
}

// ── Background ─────────────────────────────────────────────────────────────────

function BackgroundTab({
  appliedSceneId,
  hasScene,
  onSet,
  onDetach,
  onOpenBackgroundBuilder,
  onOpenSceneEditor,
  onOpenUploads,
  scenesLocked,
}: {
  appliedSceneId: string | null;
  hasScene: boolean;
  onSet: (bg: Background) => void;
  onDetach: () => void;
  onOpenBackgroundBuilder: () => void;
  onOpenSceneEditor: () => void;
  onOpenUploads: () => void;
  scenesLocked: boolean;
}) {
  const [type, setType] = useState<"SOLID" | "GRADIENT" | "IMAGE" | "SCENE">("GRADIENT");
  const [solid, setSolid] = useState("#F5F2FF");
  const [from, setFrom] = useState("#E4DCFB");
  const [to, setTo] = useState("#F7F4FF");
  const [angle, setAngle] = useState(170);

  const applyGradient = (f = from, t = to, a = angle) =>
    onSet({ type: "GRADIENT", gradient: { type: "LINEAR", angle: a, stops: [{ offset: 0, color: f }, { offset: 1, color: t }] } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenBackgroundBuilder}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
            <TuneOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
          </span>
          <span className="text-left">
            <span className="block text-[12px] font-semibold text-(--color-text-primary)">Background Builder</span>
            <span className="block text-[10px] text-(--color-text-hint)">Solid colours &amp; multi-stop gradients</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenSceneEditor}
          disabled={scenesLocked}
          title={scenesLocked ? "Remove the photo background to build a scene" : undefined}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:border-(--color-border-default) disabled:hover:bg-transparent"
        >
          <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
          </span>
          <span className="text-left">
            <span className="block text-[12px] font-semibold text-(--color-text-primary)">Build Your Own Scene</span>
            <span className="block text-[10px] text-(--color-text-hint)">
              {scenesLocked
                ? "Unavailable while a photo background is set"
                : hasScene
                  ? "Reopen the scene editor"
                  : "Layer illustrations, decorations & effects"}
            </span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {(["SOLID", "GRADIENT", "IMAGE", "SCENE"] as const).map((t) => (
          <button
            key={t}
            type="button"
            disabled={t === "SCENE" && scenesLocked}
            title={t === "SCENE" && scenesLocked ? "Remove the photo background to use scenes" : undefined}
            onClick={() => {
              setType(t);
              if (t === "SOLID") onSet({ type: "SOLID", color: solid });
              else if (t === "GRADIENT") applyGradient();
            }}
            className={`h-8 rounded-lg border text-[11px] font-medium capitalize transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              type === t
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            {t.toLowerCase()}
          </button>
        ))}
      </div>

      {type === "SOLID" && (
        <ColorRow label="Color" value={solid} onChange={(v) => { setSolid(v); onSet({ type: "SOLID", color: v }); }} />
      )}

      {type === "GRADIENT" && (
        <>
          <ColorRow label="Color 1" value={from} onChange={(v) => { setFrom(v); applyGradient(v, to, angle); }} />
          <ColorRow label="Color 2" value={to} onChange={(v) => { setTo(v); applyGradient(from, v, angle); }} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-(--color-text-secondary)">Angle</span>
            <input
              type="range" min={0} max={360} value={angle}
              onChange={(e) => { const a = Number(e.target.value); setAngle(a); applyGradient(from, to, a); }}
              className="w-36 accent-(--color-brand-primary)"
            />
          </div>
        </>
      )}

      {type === "IMAGE" && (
        <button
          type="button"
          onClick={onOpenUploads}
          className="w-full rounded-xl border-2 border-dashed border-(--color-border-strong) py-8 px-4 text-center text-(--color-text-hint) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
        >
          <UploadFileOutlinedIcon sx={{ fontSize: 24 }} />
          <span className="block text-[12px] font-semibold mt-1.5">Upload a background image</span>
          <span className="block text-[10px] mt-0.5">Opens the Uploads tab</span>
        </button>
      )}

      {type === "SCENE" && (
        <div className="rounded-xl border border-(--color-border-default) p-3 text-[12px] text-(--color-text-secondary)">
          {appliedSceneId ? (
            <>
              <p className="mb-2">
                A scene is applied. Its layers are editable in the Layers panel.
              </p>
              <button
                type="button"
                onClick={onDetach}
                className="w-full h-8 rounded-lg border border-(--color-border-default) text-[11px] font-semibold hover:text-(--color-danger) transition-colors cursor-pointer"
              >
                Detach scene
              </button>
            </>
          ) : (
            <p>No scene applied yet — pick one from the Scenes tab.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-(--color-text-secondary)">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-8 rounded-md border border-(--color-border-default) bg-transparent cursor-pointer"
      />
    </div>
  );
}

