"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../dashboard/_components/Sidebar";
import StudioTopBar from "./_components/StudioTopBar";
import StudioToolbar from "./_components/StudioToolbar";
import AddElementsPanel from "./_components/AddElementsPanel";
import BackgroundScenesPanel from "./_components/BackgroundScenesPanel";
import AssetLibraryPanel from "./_components/AssetLibraryPanel";
import {
  DECORATION_GROUPS,
  EFFECT_GROUPS,
  SHAPE_GROUPS,
  type LibraryItem,
} from "@/features/notifications/sceneLibrary";
import { createDecoration } from "@/features/notifications/elementFactory";
import StudioCanvas from "./_components/StudioCanvas";
import PropertiesPanel from "./_components/PropertiesPanel";
import SceneBuilderPanel from "./_components/SceneBuilderPanel";
import LayersPanel from "./_components/LayersPanel";
import TimelinePanel from "./_components/TimelinePanel";
import ResizeHandle from "./_components/ResizeHandle";
import { useResizable } from "./_hooks/useResizable";
import { useNotificationDesign } from "./_hooks/useNotificationDesign";
import { createElement } from "@/features/notifications/elementFactory";
import { getCookie } from "../../../../utils/cookieUtils";

export default function NotificationStudioPage() {
  const router = useRouter();

  const [leftWidth, resizeLeft] = useResizable(240, 200, 420);
  const [rightWidth, resizeRight] = useResizable(288, 240, 460);
  const [bottomHeight, resizeBottom] = useResizable(224, 150, 440);
  const [layersWidth, resizeLayers] = useResizable(240, 180, 380);
  const [sceneBuilderWidth, resizeSceneBuilder] = useResizable(520, 420, 720);

  const studio = useNotificationDesign();
  const [activeTool, setActiveTool] = useState("add");
  // The Scene Builder is a focused workspace: opened whenever a scene is
  // applied (preset or blank), closed via its own × or the panel's Back.
  const [editingScene, setEditingScene] = useState(false);

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
  function handleAdd(tileId: string) {
    const canvas = studio.design?.canvas;
    if (!canvas) return;
    const type = tileId.toUpperCase().replace(/-/g, "_");
    studio.addElement(createElement(type, canvas.width, canvas.height));
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

  function renderLeftPanel() {
    switch (activeTool) {
      case "background":
        return (
          <BackgroundScenesPanel
            width={leftWidth}
            design={studio.design}
            appliedSceneId={studio.appliedSceneId}
            selectedId={studio.selectedId}
            editingScene={editingScene}
            onSelectElement={(id) => studio.setSelectedId(id)}
            onApplyScene={studio.applyScene}
            onDetachScene={() => {
              studio.detachScene();
              setEditingScene(false);
            }}
            onSetBackground={studio.setBackground}
            onStartEditing={() => setEditingScene(true)}
            onStopEditing={() => setEditingScene(false)}
            onInsertIntoScene={handleInsertIntoScene}
            onSetSceneStyle={studio.setSceneStyle}
            onNewBlankScene={studio.startBlankScene}
          />
        );
      case "shapes":
        return (
          <AssetLibraryPanel width={leftWidth} title="Shapes" groups={SHAPE_GROUPS} onInsert={handleInsertAsset} />
        );
      case "elements":
        return (
          <AssetLibraryPanel width={leftWidth} title="Decorations" groups={DECORATION_GROUPS} onInsert={handleInsertAsset} />
        );
      case "animation":
        return (
          <AssetLibraryPanel width={leftWidth} title="Effects" groups={EFFECT_GROUPS} onInsert={handleInsertAsset} />
        );
      default:
        return <AddElementsPanel width={leftWidth} onAdd={handleAdd} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      <Sidebar activeNav="notifications" onNavChange={handleNavChange} forceCollapsed />

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
              <TimelinePanel />
            </div>
          </div>

          {editingScene ? (
            <>
              <ResizeHandle orientation="vertical" onResize={(d) => resizeSceneBuilder(-d)} />
              <SceneBuilderPanel
                width={sceneBuilderWidth}
                design={studio.design}
                selectedId={studio.selectedId}
                onSelect={(id) => studio.setSelectedId(id)}
                updateElement={studio.updateElement}
                onBeginInteraction={studio.beginInteraction}
                onUpdateLive={studio.updateElementLive}
                onEndInteraction={studio.endInteraction}
                onDelete={studio.deleteElement}
                onDuplicate={studio.duplicateElement}
                onMoveLayer={studio.moveLayer}
                onToggleLock={studio.toggleLock}
                addToScene={studio.addToScene}
                onResetScene={() => studio.updateElement("scene", (n) => ({ ...n, children: [] }))}
                onClose={() => setEditingScene(false)}
              />
            </>
          ) : (
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
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
