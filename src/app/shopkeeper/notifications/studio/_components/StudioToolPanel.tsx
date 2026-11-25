"use client";

import type { AnimSlot } from "@/features/notifications/animationPresets";
import type { BadgeLabelKind, BadgeLabelPreset } from "@/features/notifications/badgeLabelPresets";
import type { ButtonPreset } from "@/features/notifications/buttonPresets";
import { DECORATION_GROUPS, EFFECT_GROUPS, type LibraryItem } from "@/features/notifications/sceneLibrary";
import type { TextStylePreset } from "@/features/notifications/textPresets";
import { findNode, nodeLabel } from "@/features/notifications/tree";
import type { useNotificationDesign } from "../_hooks/useNotificationDesign";
import AddElementsPanel from "./AddElementsPanel";
import AnimationPanel from "./AnimationPanel";
import AssetLibraryPanel from "./AssetLibraryPanel";
import BackgroundScenesPanel from "./BackgroundScenesPanel";
import BadgesLabelsPanel from "./BadgesLabelsPanel";
import ButtonsPanel from "./ButtonsPanel";
import IconsPanel from "./IconsPanel";
import ImagesPanel from "./ImagesPanel";
import type { ImageTile } from "./images/ImageGrid";
import LockedAnimationPanel from "./LockedAnimationPanel";
import ShapesPanel from "./ShapesPanel";
import TextPanel from "./TextPanel";

type Studio = ReturnType<typeof useNotificationDesign>;

/** What choosing something in a tool panel does; the page owns these because they edit the design. */
export interface ToolActions {
  add: (tileId: string) => void;
  insertAsset: (item: LibraryItem) => void;
  insertIntoScene: (item: LibraryItem) => void;
  addTextPreset: (presetId: string) => void;
  applyTextStyle: (preset: TextStylePreset) => void;
  addImage: (tile: ImageTile) => void;
  cancelImageReplace: () => void;
  pickButton: (preset: ButtonPreset) => void;
  pickIcon: (iconName: string) => void;
  pickBadgeLabel: (preset: BadgeLabelPreset) => void;
  backFromBadgesLabels: () => void;
  applyAnimation: (slot: AnimSlot, type: string) => void;
  openBackgroundBuilder: () => void;
  openImages: () => void;
}

interface Props {
  width: number;
  /** The tool picked in the toolbar. */
  tool: string;
  studio: Studio;
  canAnimate: boolean;
  /** "Add" tool sub-view: Badges & Labels lives inside Add Elements. */
  addView: "root" | "badges-labels";
  badgeLabelKind: BadgeLabelKind;
  onBadgeLabelKindChange: (kind: BadgeLabelKind) => void;
  /** Set while an inspector's "Change…" is swapping an existing element, so the panel shows its change mode. */
  changing: { badgeLabel: boolean; button: boolean; icon: boolean; imageTargetId: string | null };
  actions: ToolActions;
}

/** The panel beside the canvas for whichever tool is active. */
export default function StudioToolPanel({
  width,
  tool,
  studio,
  canAnimate,
  addView,
  badgeLabelKind,
  onBadgeLabelKindChange,
  changing,
  actions,
}: Props) {
  switch (tool) {
    case "background":
      return (
        <BackgroundScenesPanel
          width={width}
          design={studio.design}
          appliedSceneId={studio.appliedSceneId}
          selectedId={studio.selectedId}
          onSelectElement={(id) => studio.setSelectedId(id)}
          onApplyScene={studio.applyScene}
          onDetachScene={studio.detachScene}
          onSetBackground={studio.setBackground}
          onInsertIntoScene={actions.insertIntoScene}
          onSetSceneStyle={studio.setSceneStyle}
          onNewBlankScene={studio.startBlankScene}
          onOpenBackgroundBuilder={actions.openBackgroundBuilder}
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
          width={width}
          design={studio.design}
          selectedId={studio.selectedId}
          onAddPreset={actions.addTextPreset}
          onApplyStyle={actions.applyTextStyle}
        />
      );
    case "images": {
      const replaceTarget = changing.imageTargetId && studio.design ? findNode(studio.design.elements, changing.imageTargetId) : null;
      return (
        <ImagesPanel
          width={width}
          replaceTargetName={replaceTarget ? nodeLabel(replaceTarget) : null}
          onAdd={actions.addImage}
          onCancelReplace={actions.cancelImageReplace}
        />
      );
    }
    case "buttons":
      return (
        <ButtonsPanel width={width} design={studio.design} selectedId={studio.selectedId} onPick={actions.pickButton} changeMode={changing.button} />
      );
    case "icons":
      return (
        <IconsPanel width={width} design={studio.design} selectedId={studio.selectedId} onPick={actions.pickIcon} changeMode={changing.icon} />
      );
    case "shapes":
      return <ShapesPanel width={width} onInsert={actions.insertAsset} />;
    case "elements":
      return <AssetLibraryPanel width={width} title="Decorations" groups={DECORATION_GROUPS} onInsert={actions.insertAsset} />;
    case "animation":
      if (!canAnimate) return <LockedAnimationPanel width={width} />;
      return <AnimationPanel width={width} design={studio.design} selectedId={studio.selectedId} onApply={actions.applyAnimation} />;
    case "effects":
      return <AssetLibraryPanel width={width} title="Effects" groups={EFFECT_GROUPS} onInsert={actions.insertAsset} />;
    default:
      if (addView === "badges-labels") {
        return (
          <BadgesLabelsPanel
            width={width}
            kind={badgeLabelKind}
            onKindChange={onBadgeLabelKindChange}
            onBack={actions.backFromBadgesLabels}
            onPick={actions.pickBadgeLabel}
            changeMode={changing.badgeLabel}
          />
        );
      }
      return <AddElementsPanel width={width} onAdd={actions.add} onUploadImage={actions.openImages} />;
  }
}
