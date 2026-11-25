"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/shopkeeper/Sidebar";
import StudioTopBar from "./_components/StudioTopBar";
import StudioToolbar from "./_components/StudioToolbar";
import StudioPreviewModal from "./_components/StudioPreviewModal";
import { animationLengthMs, compactStep, type AnimSlot } from "@/features/notifications/animationPresets";
import type { ButtonPreset } from "@/features/notifications/buttonPresets";
import { iconLabel } from "@/features/notifications/iconLibrary";
import type { ImageTile } from "./_components/images/ImageGrid";
import type { LibraryItem } from "@/features/notifications/sceneLibrary";
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
import { findNode, flattenNodes } from "@/features/notifications/tree";
import { pushRecentlyUsedImage } from "@/features/notifications/recentlyUsedImages";
import { TEXT_CONTENT_PRESETS, TEXT_PRESET_LINKS, type TextStylePreset } from "@/features/notifications/textPresets";
import type { BadgeLabelKind, BadgeLabelPreset } from "@/features/notifications/badgeLabelPresets";
import StudioCanvas from "./_components/StudioCanvas";
import PropertiesPanel from "./_components/PropertiesPanel";
import BackgroundBuilderPanel from "./_components/BackgroundBuilderPanel";
import LayersPanel from "./_components/LayersPanel";
import TimelinePanel from "./_components/TimelinePanel";
import { useNotificationDesign } from "./_hooks/useNotificationDesign";
import { usePlaybackClock } from "./_hooks/usePlaybackClock";
import QuickEditor from "./_components/QuickEditor";
import { useCompactLayout } from "./_hooks/useCompactLayout";
import { StudioPlanProvider } from "./_components/StudioPlanContext";
import StudioDesktopLayout from "./_components/StudioDesktopLayout";
import StudioCompactLayout, { type MobileSheet } from "./_components/StudioCompactLayout";
import StudioSkeleton from "./_components/StudioSkeleton";
import StudioToolPanel from "./_components/StudioToolPanel";
import { usePlanCapabilities } from "@/hooks/usePlanCapabilities";
import { createElement } from "@/features/notifications/elementFactory";
import { getCookie } from "../../../../utils/cookieUtils";

export default function NotificationStudioPage() {
  const router = useRouter();

  // Phones and tablets get one full-width panel at a time under the canvas.
  const { ready: layoutReady, compact, width: screenWidth } = useCompactLayout();
  const [sheet, setSheet] = useState<MobileSheet>("tool");

  const studio = useNotificationDesign();
  const { plan, loading: planLoading } = usePlanCapabilities();
  // Read only once the plan is known (a skeleton shows until then). If the plan could not be loaded
  // the full editor shows, and the API still refuses any change outside the plan.
  const quickEditOnly = plan ? !plan.capabilities.ADVANCED_TEMPLATE_EDITING : false;
  const canAnimate = plan ? plan.capabilities.CUSTOM_ANIMATION : true;
  const { setCanAnimate } = studio;
  useEffect(() => setCanAnimate(canAnimate), [canAnimate, setCanAnimate]);
  const [activeTool, setActiveTool] = useState("add");
  const [previewOpen, setPreviewOpen] = useState(false);
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

  function renderLeftPanel(width: number) {
    return (
      <StudioToolPanel
        width={width}
        tool={activeTool}
        studio={studio}
        canAnimate={canAnimate}
        addView={addView}
        badgeLabelKind={blKind}
        onBadgeLabelKindChange={setBlKind}
        changing={{ badgeLabel: !!blChangeTargetId, button: !!buttonChangeTargetId, icon: !!iconChangeTargetId, imageTargetId: imageReplaceTargetId }}
        actions={{
          add: handleAdd,
          insertAsset: handleInsertAsset,
          insertIntoScene: handleInsertIntoScene,
          addTextPreset: handleAddTextPreset,
          applyTextStyle: handleApplyTextStyle,
          addImage: handleAddImage,
          cancelImageReplace: () => setImageReplaceTargetId(null),
          pickButton: handlePickButton,
          pickIcon: handlePickIcon,
          pickBadgeLabel: handlePickBadgeLabel,
          backFromBadgesLabels: handleBackFromBadgesLabels,
          applyAnimation: handleApplyAnimation,
          openBackgroundBuilder: () => {
            setRightPanel("background");
            setSheet("edit");
          },
          openImages: () => setActiveTool("images"),
        }}
      />
    );
  }

  const topBar = (
    <StudioTopBar
      designName={studio.design?.name ?? "Untitled"}
      saveState={studio.saveState}
      savedAt={studio.savedAt}
      onUndo={studio.undo}
      onRedo={studio.redo}
      canUndo={studio.canUndo}
      canRedo={studio.canRedo}
      onSave={studio.saveVersionNow}
      onPreview={() => setPreviewOpen(true)}
    />
  );
  const previewModal = previewOpen && studio.design && (
    <StudioPreviewModal design={studio.design} name={studio.design.name ?? "Untitled"} onClose={() => setPreviewOpen(false)} />
  );
  const sidebar = <Sidebar />;

  // The screen size and the plan decide which editor opens, so wait for both rather than showing
  // one editor and swapping to another.
  if (!layoutReady || planLoading) return <StudioSkeleton sidebar={sidebar} />;

  if (quickEditOnly) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) text-(--color-text-primary) lg:flex-row">
        {sidebar}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {topBar}
          <QuickEditor studio={studio} />
        </div>
        {previewModal}
      </div>
    );
  }

  const design = studio.design;
  const propertiesPanel = (width: number) => (
    <PropertiesPanel
      width={width}
      design={design}
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
  );
  // Shown in the right rail (desktop) or the Edit tab (phone) instead of the inspector.
  const backgroundBuilder =
    rightPanel === "background" && design
      ? (width: number) => (
          <BackgroundBuilderPanel
            width={width}
            background={design.canvas.background}
            onSet={studio.setBackground}
            onClose={() => setRightPanel("properties")}
          />
        )
      : null;
  const layersPanel = (width: number) => (
    <LayersPanel
      width={width}
      design={design}
      selectedId={studio.selectedId}
      onSelect={(id) => studio.setSelectedId(id)}
      onToggleVisible={(id) => studio.updateElement(id, (n) => ({ ...n, visible: n.visible === false }))}
      onToggleLock={studio.toggleLock}
    />
  );
  const timelinePanel = (
    <TimelinePanel design={design} playbackTime={playbackTime} isPlaying={isPlaying} onPlay={handlePlay} />
  );
  const canvas = (
    <StudioCanvas
      design={design}
      loading={studio.loading}
      error={studio.error}
      selectedId={studio.selectedId}
      onSelect={(id) => {
        studio.setSelectedId(id || null);
        // On a phone, tapping an element opens its settings below the canvas.
        if (compact && id) setSheet("edit");
      }}
      onBeginInteraction={studio.beginInteraction}
      onUpdateLive={studio.updateElementLive}
      onEndInteraction={studio.endInteraction}
      isPlaying={isPlaying}
      previewId={previewId}
    />
  );

  return (
    <StudioPlanProvider value={{ canAnimate }}>
      {compact ? (
        <StudioCompactLayout
          sidebar={sidebar}
          topBar={topBar}
          canvas={canvas}
          timeline={timelinePanel}
          overlay={previewModal}
          screenWidth={screenWidth}
          toolbar={
            <StudioToolbar
              orientation="horizontal"
              active={sheet === "tool" ? activeTool : ""}
              onChange={(id) => {
                setActiveTool(id);
                setRightPanel("properties");
                setSheet(id === "layers" ? "layers" : "tool");
              }}
            />
          }
          sheet={sheet}
          onSheetChange={setSheet}
          toolPanel={renderLeftPanel}
          editPanel={(width) => (backgroundBuilder ? backgroundBuilder(width) : propertiesPanel(width))}
          layersPanel={layersPanel}
        />
      ) : (
        <StudioDesktopLayout
          sidebar={sidebar}
          topBar={topBar}
          toolbar={<StudioToolbar active={activeTool} onChange={setActiveTool} />}
          canvas={canvas}
          timeline={timelinePanel}
          overlay={previewModal}
          leftPanel={renderLeftPanel}
          layersPanel={layersPanel}
          propertiesPanel={propertiesPanel}
          backgroundBuilder={backgroundBuilder}
        />
      )}
    </StudioPlanProvider>
  );
}
