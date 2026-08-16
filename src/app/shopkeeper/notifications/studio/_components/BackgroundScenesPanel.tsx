"use client";

import { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import {
  SCENE_CATEGORIES,
  blankScene,
  filterScenes,
  SCENES,
  type Scene,
  type SceneCategory,
} from "@/features/notifications/scenes";
import ScenePreview from "./ScenePreview";
import type { Background } from "@/features/notifications/types";

type Tab = "background" | "scenes" | "uploads";

interface Props {
  width: number;
  appliedSceneId: string | null;
  onApplyScene: (scene: Scene) => void;
  onDetachScene: () => void;
  onSetBackground: (bg: Background) => void;
}

export default function BackgroundScenesPanel({
  width,
  appliedSceneId,
  onApplyScene,
  onDetachScene,
  onSetBackground,
}: Props) {
  const [tab, setTab] = useState<Tab>("scenes");

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
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
        {tab === "scenes" && (
          <ScenesTab appliedSceneId={appliedSceneId} onApply={onApplyScene} onDetach={onDetachScene} />
        )}
        {tab === "background" && (
          <BackgroundTab appliedSceneId={appliedSceneId} onSet={onSetBackground} onDetach={onDetachScene} />
        )}
        {tab === "uploads" && <UploadsTab />}
      </div>
    </aside>
  );
}

// ── Scenes ───────────────────────────────────────────────────────────────────

function ScenesTab({
  appliedSceneId,
  onApply,
  onDetach,
}: {
  appliedSceneId: string | null;
  onApply: (s: Scene) => void;
  onDetach: () => void;
}) {
  const [category, setCategory] = useState<SceneCategory>("All");
  const [query, setQuery] = useState("");
  const scenes = filterScenes(category, query);
  const applied = SCENES.find((s) => s.id === appliedSceneId) ?? null;

  return (
    <>
      {applied && (
        <div className="mb-4 rounded-xl border border-(--color-brand-primary) bg-(--color-brand-primary-light) p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-(--color-brand-primary) mb-1.5">
            Selected scene
          </p>
          <div className="flex items-center gap-2.5">
            <span className="w-12 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
              <ScenePreview scene={applied} height={40} />
            </span>
            <span className="text-[12px] font-semibold text-(--color-text-primary) truncate">
              {applied.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onDetach}
            className="mt-2 w-full h-7 rounded-lg bg-(--color-bg-surface) text-[11px] font-semibold text-(--color-text-secondary) hover:text-(--color-danger) transition-colors cursor-pointer"
          >
            Detach scene
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

      <div className="flex flex-wrap gap-1.5 mb-3">
        {SCENE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`h-7 px-2.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
              category === c
                ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onApply(blankScene())}
        className="w-full flex items-center gap-2.5 p-2.5 mb-3 rounded-xl border border-dashed border-(--color-brand-primary) text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center">
          <AddOutlinedIcon sx={{ fontSize: 18 }} />
        </span>
        <span className="text-left">
          <span className="block text-[12px] font-semibold">New Blank Scene</span>
          <span className="block text-[10px] text-(--color-text-hint)">Build from scratch</span>
        </span>
      </button>

      <div className="grid grid-cols-2 gap-2.5">
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
              <ScenePreview scene={scene} height={78} />
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
    </>
  );
}

// ── Background ─────────────────────────────────────────────────────────────────

function BackgroundTab({
  appliedSceneId,
  onSet,
  onDetach,
}: {
  appliedSceneId: string | null;
  onSet: (bg: Background) => void;
  onDetach: () => void;
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
      <div className="grid grid-cols-4 gap-1.5">
        {(["SOLID", "GRADIENT", "IMAGE", "SCENE"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              if (t === "SOLID") onSet({ type: "SOLID", color: solid });
              else if (t === "GRADIENT") applyGradient();
            }}
            className={`h-8 rounded-lg border text-[11px] font-medium capitalize transition-colors cursor-pointer ${
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
        <div className="rounded-xl border-2 border-dashed border-(--color-border-strong) py-8 px-4 text-center text-(--color-text-hint)">
          <UploadFileOutlinedIcon sx={{ fontSize: 24 }} />
          <p className="text-[12px] mt-1.5">
            Background images upload via Cloudinary — see the Uploads tab.
          </p>
        </div>
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

// ── Uploads (Cloudinary pipeline lands in the next increment) ────────────────────

function UploadsTab() {
  return (
    <div className="flex flex-col items-center text-center gap-2 rounded-xl border-2 border-dashed border-(--color-border-strong) py-10 px-4 text-(--color-text-hint)">
      <UploadFileOutlinedIcon sx={{ fontSize: 26 }} />
      <p className="text-[12px]">
        Custom uploads (PNG · JPG · WEBP) route through Cloudinary and drop in as editable scene
        layers — wiring up next.
      </p>
    </div>
  );
}
