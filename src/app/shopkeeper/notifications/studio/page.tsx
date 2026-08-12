"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../dashboard/_components/Sidebar";
import StudioTopBar from "./_components/StudioTopBar";
import StudioToolbar from "./_components/StudioToolbar";
import AddElementsPanel from "./_components/AddElementsPanel";
import StudioCanvas from "./_components/StudioCanvas";
import PropertiesPanel from "./_components/PropertiesPanel";
import LayersPanel from "./_components/LayersPanel";
import TimelinePanel from "./_components/TimelinePanel";
import ResizeHandle from "./_components/ResizeHandle";
import { useResizable } from "./_hooks/useResizable";
import { getCookie } from "../../../../utils/cookieUtils";

export default function NotificationStudioPage() {
  const router = useRouter();

  // Drag-resizable panel dimensions.
  const [leftWidth, resizeLeft] = useResizable(240, 200, 420);
  const [rightWidth, resizeRight] = useResizable(288, 240, 460);
  const [bottomHeight, resizeBottom] = useResizable(224, 150, 440);
  const [layersWidth, resizeLayers] = useResizable(240, 180, 380);

  // Mirror the other shopkeeper pages: bounce unauthenticated visitors out.
  useEffect(() => {
    if (!getCookie("shopkeeper_token")) {
      router.replace("/customer/login?tab=shopkeeper");
    }
  }, [router]);

  function handleNavChange(id: string) {
    if (id === "profile") router.push("/shopkeeper/profile");
    else if (id !== "notifications") router.push("/shopkeeper/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      {/* Main app rail stays collapsed here — the editor owns the left space */}
      <Sidebar activeNav="notifications" onNavChange={handleNavChange} forceCollapsed />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <StudioTopBar />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <StudioToolbar />

          {/* Center column: panel + canvas on top, layers + timeline below */}
          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex flex-1 min-h-0">
              <AddElementsPanel width={leftWidth} />
              <ResizeHandle orientation="vertical" onResize={resizeLeft} />
              <StudioCanvas />
            </div>

            <ResizeHandle
              orientation="horizontal"
              onResize={(d) => resizeBottom(-d)}
            />

            <div className="flex shrink-0" style={{ height: bottomHeight }}>
              <LayersPanel width={layersWidth} />
              <ResizeHandle orientation="vertical" onResize={resizeLayers} />
              <TimelinePanel />
            </div>
          </div>

          <ResizeHandle
            orientation="vertical"
            onResize={(d) => resizeRight(-d)}
          />
          <PropertiesPanel width={rightWidth} />
        </div>
      </div>
    </div>
  );
}
