"use client";

import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import type { ElementType } from "react";
import NotificationsShell from "../_components/NotificationsShell";
import TemplatesBrowser from "./_components/TemplatesBrowser";

const HIGHLIGHTS: { icon: ElementType; title: string; note: string }[] = [
  { icon: AutoAwesomeOutlinedIcon, title: "Ready to send", note: "Copy, layout and CTA done" },
  { icon: SmartphoneOutlinedIcon, title: "Banner accurate", note: "400 × 200, the real image size" },
  { icon: BrushOutlinedIcon, title: "Fully editable", note: "Restyle with any scene" },
];

export default function NotificationTemplatesPage() {
  return (
    <NotificationsShell
      title="Templates"
      description="Start from a finished design, then make it yours in the Studio."
      icon={GridViewOutlinedIcon}
      headerAside={
        <div className="flex flex-wrap gap-2.5">
          {HIGHLIGHTS.map(({ icon: Icon, title, note }) => (
            <div
              key={title}
              className="flex items-center gap-2.5 rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) px-3 py-2"
            >
              <span className="w-8 h-8 shrink-0 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center text-(--color-brand-primary)">
                <Icon sx={{ fontSize: 17 }} />
              </span>
              <span>
                <span className="block text-[12px] font-semibold text-(--color-text-primary)">
                  {title}
                </span>
                <span className="block text-[10.5px] text-(--color-text-hint)">{note}</span>
              </span>
            </div>
          ))}
        </div>
      }
    >
      <TemplatesBrowser />
    </NotificationsShell>
  );
}
