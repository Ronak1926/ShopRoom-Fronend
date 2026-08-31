"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../dashboard/_components/Sidebar";
import StudioTopBar from "./_components/StudioTopBar";
import StudioToolbar from "./_components/StudioToolbar";
import AddElementsPanel from "./_components/AddElementsPanel";
import BackgroundScenesPanel from "./_components/BackgroundScenesPanel";
import AssetLibraryPanel from "./_components/AssetLibraryPanel";
import TextPanel from "./_components/TextPanel";
import BadgesLabelsPanel from "./_components/BadgesLabelsPanel";
import ImagesPanel from "./_components/ImagesPanel";
import ButtonsPanel from "./_components/ButtonsPanel";
import IconsPanel from "./_components/IconsPanel";
import ShapesPanel from "./_components/ShapesPanel";
import AnimationPanel from "./_components/AnimationPanel";
import { animationLengthMs, compactStep, type AnimSlot } from "@/features/notifications/animationPresets";
import type { ButtonPreset } from "@/features/notifications/buttonPresets";
import { iconLabel } from "@/features/notifications/iconLibrary";
import type { ImageTile } from "./_components/images/ImageGrid";
import {
  DECORATION_GROUPS,
  EFFECT_GROUPS,
  type LibraryItem,
} from "@/features/notifications/sceneLibrary";
import {
  createDecoration,
  createImageElement,
  createTextFromPreset,
  createTextWithStyle,
  createBadgeOrLabelFromPreset,
  applyBadgeLabelPreset,
  createButtonFromPreset,
  applyButtonPreset,
  createIconElement,
} from "@/features/notifications/elementFactory";
import { findNode, flattenNodes, nodeLabel } from "@/features/notifications/tree";
import { pushRecentlyUsedImage } from "@/features/notifications/recentlyUsedImages";
import { TEXT_CONTENT_PRESETS, TEXT_PRESET_LINKS, type TextStylePreset } from "@/features/notifications/textPresets";
import type { BadgeLabelKind, BadgeLabelPreset } from "@/features/notifications/badgeLabelPresets";
import StudioCanvas from "./_components/StudioCanvas";
import PropertiesPanel from "./_components/PropertiesPanel";
import BackgroundBuilderPanel from "./_components/BackgroundBuilderPanel";
import LayersPanel from "./_components/LayersPanel";
import TimelinePanel from "./_components/TimelinePanel";
import ResizeHandle from "./_components/ResizeHandle";
import { useResizable } from "./_hooks/useResizable";
import { useNotificationDesign } from "./_hooks/useNotificationDesign";
import { usePlaybackClock } from "./_hooks/usePlaybackClock";
import { createElement } from "@/features/notifications/elementFactory";
import { getCookie } from "../../../../utils/cookieUtils";

export default function NotificationStudioPage() {
  const router = useRouter();

  const [leftWidth, resizeLeft] = useResizable(240, 200, 420);
  const [rightWidth, resizeRight] = useResizable(288, 240, 460);
  const [bottomHeight, resizeBottom] = useResizable(224, 150, 440);
  const [layersWidth, resizeLayers] = useResizable(240, 180, 380);
  const [bgBuilderWidth, resizeBgBuilder] = useResizable(320, 280, 440);

  const studio = useNotificationDesign();
  const [activeTool, setActiveTool] = useState("add");
  // The right rail is either the normal element inspector or the Background
  // Builder. There's no separate Scene Builder workspace — the Mobile
  // Preview canvas, the Layers panel and the Animation timeline already
  // cover everything a dedicated scene canvas would duplicate.
  const [rightPanel, setRightPanel] = useState<"properties" | "background">("properties");
  // "Add" tool sub-view: the Badges & Labels editor lives inside Add Elements
  // (breadcrumb "Add Elements > Badges & Labels"), not a new toolbar rail item.
  const [addView, setAddView] = useState<"root" | "badges-labels">("root");
  const [blKind, setBlKind] = useState<BadgeLabelKind>("BADGE");
  // Set while the inspector's "Change" is swapping an existing badge/label's
  // preset — the next pick patches this node instead of adding a new one.
  const [blChangeTargetId, setBlChangeTargetId] = useState<string | null>(null);
  // Set while ImageInspector's "Replace" is swapping an existing image's
  // source — the next Add-to-Canvas patches this node's asset instead of
  // inserting a new one (same precedent as blChangeTargetId above).
  const [imageReplaceTargetId, setImageReplaceTargetId] = useState<string | null>(null);
  // Set while ButtonInspector's "Change style" is restyling an existing button
  // — the next preset pick patches that node instead of adding a new one.
  const [buttonChangeTargetId, setButtonChangeTargetId] = useState<string | null>(null);
  // Set while IconInspector's "Change Icon" is swapping an existing icon —
  // the next pick patches that node instead of adding a new one.
  const [iconChangeTargetId, setIconChangeTargetId] = useState<string | null>(null);
  // Timeline playback — drives real entry/attention/exit animation on the
  // canvas and the Timeline's playhead. Auto-stops when it reaches the end.
  const [isPlaying, setIsPlaying] = useState(false);
  // Single-element animation preview (Animation panel / inspector Play button),
  // independent of the Timeline's play-everything.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Never leave an element parked mid-animation if the studio unmounts.
  useEffect(() => () => { if (previewTimer.current) clearTimeout(previewTimer.current); }, []);
  const playbackTime = usePlaybackClock(studio.design?.timeline?.durationMs ?? 4000, isPlaying, () => setIsPlaying(false));

  useEffect(() => {
    if (!getCookie("shopkeeper_token")) {
      router.replace("/customer/login?tab=shopkeeper");
    }
  }, [router]);

  // Delete the selected element with Delete/Backspace (unless typing in a field).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const el = document.activeElement;
      const typing = el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (typing || !studio.selectedId) return;
      e.preventDefault();
      studio.deleteElement(studio.selectedId);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [studio]);

  function handleNavChange(id: string) {
    if (id === "profile") router.push("/shopkeeper/profile");
    else if (id !== "notifications") router.push("/shopkeeper/dashboard");
  }

  // Add a new element of the toolbar tile's type, centred on the canvas.
  // The "Badge" tile opens the dedicated Badges & Labels editor instead of
  // inserting a generic placeholder (see openBadgesLabels below).
  function handleAdd(tileId: string) {
    if (tileId === "badge") {
      openBadgesLabels("BADGE");
      return;
    }
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    const type = tileId.toUpperCase().replace(/-/g, "_");
    studio.addElement(createElement(type, canvas.width, canvas.height));
  }

  // Switches the left panel into Badges & Labels. Passing a changeTargetId
  // makes the next preset pick replace that element instead of adding a new one.
  function openBadgesLabels(kind: BadgeLabelKind, changeTargetId: string | null = null) {
    setActiveTool("add");
    setAddView("badges-labels");
    setBlKind(kind);
    setBlChangeTargetId(changeTargetId);
    setRightPanel("properties");
  }

  function handleBackFromBadgesLabels() {
    setAddView("root");
    setBlChangeTargetId(null);
  }

  // Clicking a Badges & Labels preset: either replaces the element currently
  // being "Changed", or inserts a brand-new real BADGE/LABEL node.
  function handlePickBadgeLabel(preset: BadgeLabelPreset) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    if (blChangeTargetId) {
      studio.updateElement(blChangeTargetId, (n) => applyBadgeLabelPreset(n, preset));
      setBlChangeTargetId(null);
      return;
    }
    studio.addElement(createBadgeOrLabelFromPreset(preset, canvas.width, canvas.height));
  }

  // Inspector's "Change" button: reopen the preset browser scoped to
  // replacing the currently selected badge/label.
  function handleChangeBadgeLabelPreset() {
    const node = studio.selectedId && studio.design ? findNode(studio.design.elements, studio.selectedId) : null;
    if (!node || (node.type !== "BADGE" && node.type !== "LABEL")) return;
    openBadgesLabels(node.type, node.id);
  }

  // Play/replay the animation preview. Restarting mid-playback needs the flag
  // to drop to false first, otherwise nothing re-triggers.
  function handlePlay() {
    setIsPlaying(false);
    requestAnimationFrame(() => setIsPlaying(true));
  }

  /**
   * Animation panel: applies a preset to the selected element's slot. Written
   * through compactStep so only non-default fields land in the design JSON —
   * a plain Fade In persists as { type: "FADE_IN" }.
   */
  function handleApplyAnimation(slot: AnimSlot, type: string) {
    const id = studio.selectedId;
    if (!id) return;
    studio.updateElement(id, (n) => ({
      ...n,
      animation: {
        ...n.animation,
        [slot]: type === "NONE" ? undefined : compactStep({ ...n.animation?.[slot], type }),
      },
    }));
    previewElement(id);
  }

  /**
   * Plays one element's animation on the canvas, then returns it to rest.
   * The reset is essential: without it a looping emphasis runs forever and an
   * exit animation leaves the element parked in its exit position, both of
   * which look like the element's position permanently changed.
   */
  function previewElement(id: string) {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    const node = studio.design ? findNode(studio.design.elements, id) : null;
    const length = animationLengthMs(node?.animation);
    if (!length) {
      setPreviewId(null);
      return;
    }
    setPreviewId(null);
    requestAnimationFrame(() => setPreviewId(id));
    // +120ms so the final frame is visible before snapping back to rest.
    previewTimer.current = setTimeout(() => setPreviewId(null), Math.min(length, 8000) + 120);
  }

  /**
   * Images panel "Add to Canvas". Three cases, in priority order:
   *  1. Replace flow active → swap that node's photo in place.
   *  2. An empty PRODUCT_IMAGE placeholder exists → drop the photo into that
   *     slot so it lands on the pedestal at the template's intended position,
   *     size, z-order and animation instead of floating mid-canvas.
   *  3. Otherwise → insert a new free-floating IMAGE element.
   */
  function handleAddImage(tile: ImageTile) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;

    const assetPatch = {
      type: "IMAGE" as const,
      url: tile.fullUrl,
      naturalWidth: tile.width,
      naturalHeight: tile.height,
      attribution: tile.attribution,
    };

    if (imageReplaceTargetId) {
      studio.updateElement(imageReplaceTargetId, (n) => ({
        ...n,
        asset: assetPatch,
        image: { ...n.image, crop: undefined },
      }));
      setImageReplaceTargetId(null);
    } else {
      const slot = studio.design
        ? flattenNodes(studio.design.elements)
            .map((f) => f.node)
            .find((n) => n.type === "PRODUCT_IMAGE" && !n.asset?.url)
        : undefined;

      if (slot) {
        studio.updateElement(slot.id, (n) => ({
          ...n,
          asset: assetPatch,
          // "contain" keeps the whole product visible inside the slot; a cover
          // crop would clip a shoe/bag against the pedestal.
          image: { ...n.image, fit: n.image?.fit ?? "contain", crop: undefined },
        }));
        studio.setSelectedId(slot.id);
      } else {
        studio.addElement(
          createImageElement(tile.fullUrl, canvas.width, canvas.height, {
            naturalWidth: tile.width,
            naturalHeight: tile.height,
            attribution: tile.attribution,
          }),
        );
      }
    }
    pushRecentlyUsedImage({ url: tile.fullUrl, name: tile.credit, attribution: tile.attribution });
  }

  // ImageInspector's "Replace" button: reopen the Images panel scoped to
  // replacing the currently selected image.
  function openImagesForReplace(nodeId: string) {
    setActiveTool("images");
    setImageReplaceTargetId(nodeId);
  }

  // Buttons panel: either restyles the button currently being "Changed", or
  // inserts a brand-new real BUTTON node.
  function handlePickButton(preset: ButtonPreset) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    if (buttonChangeTargetId) {
      studio.updateElement(buttonChangeTargetId, (n) => applyButtonPreset(n, preset));
      setButtonChangeTargetId(null);
      return;
    }
    studio.addElement(createButtonFromPreset(preset, canvas.width, canvas.height));
  }

  // ButtonInspector's "Change style": reopen the Buttons panel scoped to
  // restyling the currently selected button.
  function handleChangeButtonPreset() {
    const node = studio.selectedId && studio.design ? findNode(studio.design.elements, studio.selectedId) : null;
    if (!node || node.type !== "BUTTON") return;
    setActiveTool("buttons");
    setButtonChangeTargetId(node.id);
  }

  // Icons panel: either swaps the icon currently being "Changed", or inserts a
  // brand-new real ICON node.
  function handlePickIcon(iconName: string) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    if (iconChangeTargetId) {
      studio.updateElement(iconChangeTargetId, (n) => ({
        ...n,
        content: { ...n.content, icon: iconName },
      }));
      setIconChangeTargetId(null);
      return;
    }
    studio.addElement(createIconElement(iconName, iconLabel(iconName), canvas.width, canvas.height));
  }

  // IconInspector's "Change Icon": reopen the Icons panel scoped to swapping
  // the currently selected icon.
  function handleChangeIcon(nodeId: string) {
    setActiveTool("icons");
    setIconChangeTargetId(nodeId);
  }

  // Insert a decoration / shape / effect from an asset library.
  function handleInsertAsset(item: LibraryItem) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    studio.addElement(createDecoration(item, canvas.width, canvas.height));
  }

  // Insert a decoration into the "scene" group specifically (Build Your Own Scene tabs).
  function handleInsertIntoScene(item: LibraryItem) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    studio.addToScene(createDecoration(item, canvas.width, canvas.height, 200));
  }

  // Text tool: add a real TEXT element from a content preset (Heading, Price, …).
  function handleAddTextPreset(presetId: string) {
    // "Label" / "Badge Text" are legacy styled-text presets, superseded by
    // the real Badges & Labels editor — route there instead of inserting text.
    const link = TEXT_PRESET_LINKS[presetId];
    if (link) {
      openBadgesLabels(link);
      return;
    }
    const canvas = studio.design?.canvas;
    const preset = TEXT_CONTENT_PRESETS.find((p) => p.id === presetId);
    if (!canvas || !preset) return;
    studio.addElement(createTextFromPreset(preset, canvas.width, canvas.height));
  }

  // Text tool: a style preset restyles the selected TEXT element, or — with
  // nothing selected — adds a new one carrying that look.
  function handleApplyTextStyle(preset: TextStylePreset) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    const selected = studio.selectedId && studio.design ? findNode(studio.design.elements, studio.selectedId) : null;
    if (selected && selected.type === "TEXT") {
      studio.updateElement(selected.id, (n) => ({ ...n, style: { ...n.style, ...preset.style } }));
    } else {
      studio.addElement(createTextWithStyle(preset.style, preset.label, canvas.width, canvas.height));
    }
  }

  function renderLeftPanel() {
    switch (activeTool) {
      case "background":
        return (
          <BackgroundScenesPanel
            width={leftWidth}
            design={studio.design}
            appliedSceneId={studio.appliedSceneId}
            selectedId={studio.selectedId}
            onSelectElement={(id) => studio.setSelectedId(id)}
            onApplyScene={studio.applyScene}
            onDetachScene={studio.detachScene}
            onSetBackground={studio.setBackground}
            onInsertIntoScene={handleInsertIntoScene}
            onSetSceneStyle={studio.setSceneStyle}
            onNewBlankScene={studio.startBlankScene}
            onOpenBackgroundBuilder={() => setRightPanel("background")}
            onToggleLock={studio.toggleLock}
            copyTone={studio.copyTone}
            onSetCopyTone={studio.setCopyTone}
            onClearElements={studio.clearElements}
            onSetPhotoBackground={studio.setPhotoBackground}
          />
        );
      case "text":
        return (
          <TextPanel
            width={leftWidth}
            design={studio.design}
            selectedId={studio.selectedId}
            onAddPreset={handleAddTextPreset}
            onApplyStyle={handleApplyTextStyle}
          />
        );
      case "images": {
        const replaceTarget = imageReplaceTargetId && studio.design ? findNode(studio.design.elements, imageReplaceTargetId) : null;
        return (
          <ImagesPanel
            width={leftWidth}
            replaceTargetName={replaceTarget ? nodeLabel(replaceTarget) : null}
            onAdd={handleAddImage}
            onCancelReplace={() => setImageReplaceTargetId(null)}
          />
        );
      }
      case "buttons":
        return (
          <ButtonsPanel
            width={leftWidth}
            design={studio.design}
            selectedId={studio.selectedId}
            onPick={handlePickButton}
            changeMode={!!buttonChangeTargetId}
          />
        );
      case "icons":
        return (
          <IconsPanel
            width={leftWidth}
            design={studio.design}
            selectedId={studio.selectedId}
            onPick={handlePickIcon}
            changeMode={!!iconChangeTargetId}
          />
        );
      case "shapes":
        return <ShapesPanel width={leftWidth} onInsert={handleInsertAsset} />;
      case "elements":
        return (
          <AssetLibraryPanel width={leftWidth} title="Decorations" groups={DECORATION_GROUPS} onInsert={handleInsertAsset} />
        );
      case "animation":
        return (
          <AnimationPanel
            width={leftWidth}
            design={studio.design}
            selectedId={studio.selectedId}
            onApply={handleApplyAnimation}
          />
        );
      case "effects":
        return (
          <AssetLibraryPanel width={leftWidth} title="Effects" groups={EFFECT_GROUPS} onInsert={handleInsertAsset} />
        );
      default:
        if (addView === "badges-labels") {
          return (
            <BadgesLabelsPanel
              width={leftWidth}
              kind={blKind}
              onKindChange={setBlKind}
              onBack={handleBackFromBadgesLabels}
              onPick={handlePickBadgeLabel}
              changeMode={!!blChangeTargetId}
            />
          );
        }
        return <AddElementsPanel width={leftWidth} onAdd={handleAdd} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav="notifications" onNavChange={handleNavChange} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <StudioTopBar
          designName={studio.design?.name ?? "Untitled"}
          saveState={studio.saveState}
          savedAt={studio.savedAt}
          onUndo={studio.undo}
          onRedo={studio.redo}
          canUndo={studio.canUndo}
          canRedo={studio.canRedo}
          onSave={studio.saveVersionNow}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <StudioToolbar active={activeTool} onChange={setActiveTool} />

          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex flex-1 min-h-0">
              {renderLeftPanel()}
              <ResizeHandle orientation="vertical" onResize={resizeLeft} />
              <StudioCanvas
                design={studio.design}
                loading={studio.loading}
                error={studio.error}
                selectedId={studio.selectedId}
                onSelect={(id) => studio.setSelectedId(id || null)}
                onBeginInteraction={studio.beginInteraction}
                onUpdateLive={studio.updateElementLive}
                onEndInteraction={studio.endInteraction}
                isPlaying={isPlaying}
                previewId={previewId}
              />
            </div>

            <ResizeHandle orientation="horizontal" onResize={(d) => resizeBottom(-d)} />

            <div className="flex shrink-0" style={{ height: bottomHeight }}>
              <LayersPanel
                width={layersWidth}
                design={studio.design}
                selectedId={studio.selectedId}
                onSelect={(id) => studio.setSelectedId(id)}
                onToggleVisible={(id) =>
                  studio.updateElement(id, (n) => ({ ...n, visible: n.visible === false }))
                }
                onToggleLock={studio.toggleLock}
              />
              <ResizeHandle orientation="vertical" onResize={resizeLayers} />
              <TimelinePanel
                design={studio.design}
                playbackTime={playbackTime}
                isPlaying={isPlaying}
                onPlay={handlePlay}
              />
            </div>
          </div>

          {rightPanel === "background" && studio.design && (
            <>
              <ResizeHandle orientation="vertical" onResize={(d) => resizeBgBuilder(-d)} />
              <BackgroundBuilderPanel
                width={bgBuilderWidth}
                background={studio.design.canvas.background}
                onSet={studio.setBackground}
                onClose={() => setRightPanel("properties")}
              />
            </>
          )}
          {rightPanel === "properties" && (
            <>
              <ResizeHandle orientation="vertical" onResize={(d) => resizeRight(-d)} />
              <PropertiesPanel
                width={rightWidth}
                design={studio.design}
                selectedId={studio.selectedId}
                updateElement={studio.updateElement}
                onDelete={studio.deleteElement}
                onDuplicate={studio.duplicateElement}
                onMoveLayer={studio.moveLayer}
                onToggleLock={studio.toggleLock}
                onChangeBadgeLabelPreset={handleChangeBadgeLabelPreset}
                onReplaceImage={openImagesForReplace}
                onChangeButtonPreset={handleChangeButtonPreset}
                onChangeIcon={handleChangeIcon}
                onPreviewAnimation={previewElement}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
