"use client";

/**
 * useNotificationDesign — Loads or creates a working design from the API, holds
 * it in state, and persists edits with debounced autosave. Provides selection,
 * per-element updates, and undo/redo. The design JSON is the single model; no
 * separate editor state is stored server-side.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  autosaveDesign,
  cloneTemplate,
  createBlankDesign,
  getDesign,
  listTemplates,
  saveVersion,
} from "@/features/notifications/api";
import {
  cloneWithNewIds,
  findNode,
  insertAfter,
  removeNodeById,
  reorderNode,
  updateNodeById,
  type LayerMove,
} from "@/features/notifications/tree";
import { blankScene, type Scene } from "@/features/notifications/scenes";
import type { Background, CompositionNode, NodeStyle, NotificationDesign } from "@/features/notifications/types";


export type SaveState = "idle" | "saving" | "saved" | "error";
const STORAGE_KEY = "studio_design_id";

export function useNotificationDesign() {
  const [design, setDesign] = useState<NotificationDesign | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [appliedSceneId, setAppliedSceneId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [histTick, setHistTick] = useState(0);

  const designRef = useRef<NotificationDesign | null>(null);
  const idRef = useRef<string | null>(null);
  const history = useRef<{ past: NotificationDesign[]; future: NotificationDesign[] }>({ past: [], future: [] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    designRef.current = design;
  }, [design]);
  useEffect(() => {
    idRef.current = designId;
  }, [designId]);

  // ── Load or create the working design on mount ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          try {
            const rec = await getDesign(stored);
            if (cancelled) return;
            setDesign(rec.designJson);
            setDesignId(rec.id);
            return;
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
        const templates = await listTemplates();
        const tpl = templates.find((t) => t.slug === "new-arrival-classic") ?? templates[0];
        const rec = tpl
          ? await cloneTemplate(tpl.id)
          : await createBlankDesign("Untitled notification", "CUSTOM");
        if (cancelled) return;
        setDesign(rec.designJson);
        setDesignId(rec.id);
        localStorage.setItem(STORAGE_KEY, rec.id);
      } catch (e) {
        if (!cancelled) setError(readError(e, "Failed to load design"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scheduleSave = useCallback((next: NotificationDesign) => {
    const id = idRef.current;
    if (!id) return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await autosaveDesign(id, next);
        setSaveState("saved");
        setSavedAt(new Date());
      } catch {
        setSaveState("error");
      }
    }, 900);
  }, []);

  const commit = useCallback(
    (next: NotificationDesign, pushHistory = true) => {
      const prev = designRef.current;
      if (prev && pushHistory) {
        history.current.past.push(prev);
        history.current.future = [];
      }
      designRef.current = next;
      setDesign(next);
      setHistTick((n) => n + 1);
      scheduleSave(next);
    },
    [scheduleSave],
  );

  const updateElement = useCallback(
    (id: string, patch: (n: CompositionNode) => CompositionNode) => {
      const prev = designRef.current;
      if (!prev) return;
      const elements = updateNodeById(prev.elements, id, patch);
      commit({ ...prev, elements, metadata: { ...prev.metadata, updatedAt: new Date().toISOString() } });
    },
    [commit],
  );

  // ── Live interaction (drag/resize): update on the fly, one history entry + one
  //    save on release, so a drag doesn't flood history or the network. ──
  const interactionStart = useRef<NotificationDesign | null>(null);

  const beginInteraction = useCallback(() => {
    interactionStart.current = designRef.current;
  }, []);

  const updateElementLive = useCallback(
    (id: string, patch: (n: CompositionNode) => CompositionNode) => {
      const prev = designRef.current;
      if (!prev) return;
      const next = { ...prev, elements: updateNodeById(prev.elements, id, patch) };
      designRef.current = next;
      setDesign(next);
    },
    [],
  );

  const endInteraction = useCallback(() => {
    const start = interactionStart.current;
    interactionStart.current = null;
    const cur = designRef.current;
    if (start && cur && start !== cur) {
      history.current.past.push(start);
      history.current.future = [];
      setHistTick((n) => n + 1);
      scheduleSave(cur);
    }
  }, [scheduleSave]);

  const addElement = useCallback(
    (node: CompositionNode) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({ ...prev, elements: [...prev.elements, node] });
      setSelectedId(node.id);
    },
    [commit],
  );

  const deleteElement = useCallback(
    (id: string) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({ ...prev, elements: removeNodeById(prev.elements, id) });
      setSelectedId(null);
    },
    [commit],
  );

  /** Deep-copies an element (fresh ids) and drops it just after the original. */
  const duplicateElement = useCallback(
    (id: string) => {
      const prev = designRef.current;
      if (!prev) return;
      const node = findNode(prev.elements, id);
      if (!node) return;
      const copy = cloneWithNewIds(node);
      copy.name = `${copy.name ?? "Element"} copy`;
      copy.frame = { ...copy.frame, x: copy.frame.x + 12, y: copy.frame.y + 12 };
      commit({ ...prev, elements: insertAfter(prev.elements, id, copy) });
      setSelectedId(copy.id);
    },
    [commit],
  );

  /** Bring forward / to front / send backward / to back (adjusts zIndex). */
  const moveLayer = useCallback(
    (id: string, move: LayerMove) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({ ...prev, elements: reorderNode(prev.elements, id, move) });
    },
    [commit],
  );

  const toggleLock = useCallback(
    (id: string) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({
        ...prev,
        elements: updateNodeById(prev.elements, id, (n) => ({ ...n, locked: !n.locked })),
      });
    },
    [commit],
  );

  /**
   * Removes every element, keeping the canvas background — the "photo only"
   * notification (Background → Uploads). Goes through commit, so it's a
   * single undo step and autosaves like any other edit.
   */
  const clearElements = useCallback(() => {
    const prev = designRef.current;
    if (!prev) return;
    commit({ ...prev, elements: [] });
    setSelectedId(null);
  }, [commit]);

  /**
   * Sets a photo as the canvas background. A photo IS the whole background
   * composition, so the scene group and every decoration are dropped in the
   * same commit — otherwise the template's leaves/pedestal/glow would sit on
   * top of the photo and look cluttered. Text, badges, labels and buttons are
   * kept, since those still read fine over a picture.
   */
  const setPhotoBackground = useCallback(
    (imageUrl: string) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({
        ...prev,
        canvas: { ...prev.canvas, background: { type: "IMAGE", imageUrl } },
        elements: prev.elements.filter(
          (n) => n.id !== "scene" && n.type !== "DECORATION" && n.type !== "PARTICLES",
        ),
      });
      setAppliedSceneId(null);
      setSelectedId(null);
    },
    [commit],
  );

  // Sets only the canvas background (Background tab: solid / gradient / etc.).
  const setBackground = useCallback(
    (background: Background) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({ ...prev, canvas: { ...prev.canvas, background } });
    },
    [commit],
  );

  // Applies a ShopRoom scene: swaps the background + a top-level "scene" GROUP of
  // editable decoration layers. A scene ships its own full product environment
  // (glow/shadow/pedestal), so every prior DECORATION node is dropped — only
  // non-decoration template content (text, product image, CTA, ...) is kept.
  const applyScene = useCallback(
    (scene: Scene) => {
      const prev = designRef.current;
      if (!prev) return;
      // A scene owns the whole background composition — including the product
      // stage — so drop every existing decoration. Otherwise the template's
      // pedestal/glow would stack under the scene's own one.
      const kept = prev.elements.filter((n) => n.id !== "scene" && n.type !== "DECORATION");
      const sceneGroup: CompositionNode = {
        id: "scene",
        type: "GROUP",
        name: scene.name,
        frame: { x: 0, y: 0, width: prev.canvas.width, height: prev.canvas.height, zIndex: 1 },
        visible: true,
        // Locked by default: the background is one big frame spanning the
        // whole canvas, so leaving it unlocked means a stray click grabs the
        // entire scene instead of the individual layer underneath it. The
        // shopkeeper can unlock it from the Scene Builder header if they
        // genuinely want to reposition the whole composition.
        locked: true,
        children: scene.elements,
      };
      commit({
        ...prev,
        canvas: { ...prev.canvas, background: scene.background },
        elements: [sceneGroup, ...kept],
      });
      setAppliedSceneId(scene.id);
      setSelectedId(null);
    },
    [commit],
  );

  /** Removes the scene group, leaving template content untouched. */
  const detachScene = useCallback(() => {
    const prev = designRef.current;
    if (!prev) return;
    commit({ ...prev, elements: prev.elements.filter((n) => n.id !== "scene") });
    setAppliedSceneId(null);
    setSelectedId(null);
  }, [commit]);

  /**
   * "New Blank Scene": wipes the ENTIRE canvas (text, buttons, product image,
   * decorations — everything), leaving only an empty "scene" group so the Scene
   * Builder has something to add layers into. Unlike applyScene, this doesn't
   * preserve any template content — it's a true blank slate.
   */
  const startBlankScene = useCallback(() => {
    const prev = designRef.current;
    if (!prev) return;
    const scene = blankScene();
    const sceneGroup: CompositionNode = {
      id: "scene",
      type: "GROUP",
      name: "Scene",
      frame: { x: 0, y: 0, width: prev.canvas.width, height: prev.canvas.height, zIndex: 1 },
      visible: true,
      locked: true,
      children: [],
    };
    commit({
      ...prev,
      canvas: { ...prev.canvas, background: scene.background },
      elements: [sceneGroup],
    });
    setAppliedSceneId(scene.id);
    setSelectedId(null);
  }, [commit]);

  /** Inserts a decoration into the scene group's children (creating the group if missing). */
  const addToScene = useCallback(
    (node: CompositionNode) => {
      const prev = designRef.current;
      if (!prev) return;
      const hasScene = prev.elements.some((n) => n.id === "scene");
      const elements = hasScene
        ? updateNodeById(prev.elements, "scene", (s) => ({ ...s, children: [...(s.children ?? []), node] }))
        : [
            {
              id: "scene",
              type: "GROUP",
              name: "Scene",
              frame: { x: 0, y: 0, width: prev.canvas.width, height: prev.canvas.height, zIndex: 1 },
              visible: true,
              locked: true,
              children: [node],
            } satisfies CompositionNode,
            ...prev.elements,
          ];
      commit({ ...prev, elements });
      setSelectedId(node.id);
    },
    [commit],
  );

  /** Patches the scene group's own style (Canvas Tint / Scene Opacity / Scene Blur). */
  const setSceneStyle = useCallback(
    (patch: Partial<NodeStyle>) => {
      const prev = designRef.current;
      if (!prev) return;
      commit({
        ...prev,
        elements: updateNodeById(prev.elements, "scene", (s) => ({ ...s, style: { ...s.style, ...patch } })),
      });
    },
    [commit],
  );

  const undo = useCallback(() => {
    const prev = designRef.current;
    if (!prev || !history.current.past.length) return;
    const last = history.current.past.pop()!;
    history.current.future.push(prev);
    designRef.current = last;
    setDesign(last);
    setHistTick((n) => n + 1);
    scheduleSave(last);
  }, [scheduleSave]);

  const redo = useCallback(() => {
    const prev = designRef.current;
    if (!prev || !history.current.future.length) return;
    const next = history.current.future.pop()!;
    history.current.past.push(prev);
    designRef.current = next;
    setDesign(next);
    setHistTick((n) => n + 1);
    scheduleSave(next);
  }, [scheduleSave]);

  const saveVersionNow = useCallback(async () => {
    const id = idRef.current;
    if (!id) return;
    try {
      await saveVersion(id);
      setSaveState("saved");
      setSavedAt(new Date());
    } catch {
      setSaveState("error");
    }
  }, []);

  void histTick; // re-render trigger so canUndo/canRedo reflect the ref
  return {
    design,
    loading,
    error,
    selectedId,
    setSelectedId,
    saveState,
    savedAt,
    updateElement,
    updateElementLive,
    beginInteraction,
    endInteraction,
    addElement,
    deleteElement,
    duplicateElement,
    moveLayer,
    toggleLock,
    clearElements,
    setPhotoBackground,
    setBackground,
    applyScene,
    detachScene,
    startBlankScene,
    addToScene,
    setSceneStyle,
    appliedSceneId,
    undo,
    redo,
    canUndo: history.current.past.length > 0,
    canRedo: history.current.future.length > 0,
    saveVersionNow,
  };
}

function readError(e: unknown, fallback: string): string {
  const err = e as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message ?? fallback;
}
