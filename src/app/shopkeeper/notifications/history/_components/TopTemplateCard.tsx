"use client";

import DesignPreview from "@/components/notifications/DesignPreview";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import type { DesignSummary } from "@/features/notifications/api";
import type { Analytics } from "@/features/notifications/insights";

interface Props {
  top: Analytics["topDesigns"][number] | null;
  design: DesignSummary | null;
  onOpenDesign: (design: DesignSummary) => void;
}

/** The design with the best open rate in the window. */
export default function TopTemplateCard({ top, design, onOpenDesign }: Props) {
  if (!top) return null;

  return (
    <section className="h-full flex flex-col rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">Top performing</h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="w-20 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
          {design ? (
            <DesignPreview design={design.designJson} />
          ) : (
            <span className="flex aspect-2/1 items-center justify-center bg-(--color-brand-primary-light) text-(--color-brand-primary)">
              <CampaignOutlinedIcon sx={{ fontSize: 16 }} />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-(--color-text-primary) truncate">{top.name}</span>
          <span className="block mt-1 text-[11px] text-(--color-text-hint)">
            Sent {top.sends} {top.sends === 1 ? "time" : "times"}
          </span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <span className="rounded-xl bg-(--color-bg-page) px-3 py-2.5">
          <span className="block text-[10.5px] text-(--color-text-hint)">Open rate</span>
          <span className="block mt-0.5 text-[16px] font-bold text-(--color-text-primary) tabular-nums">{top.openRate}%</span>
        </span>
        <span className="rounded-xl bg-(--color-bg-page) px-3 py-2.5">
          <span className="block text-[10.5px] text-(--color-text-hint)">Click rate</span>
          <span className="block mt-0.5 text-[16px] font-bold text-(--color-text-primary) tabular-nums">{top.clickRate}%</span>
        </span>
      </div>

      {design && (
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onOpenDesign(design)}
            className="w-full h-9 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            Open in Studio
          </button>
        </div>
      )}
    </section>
  );
}
