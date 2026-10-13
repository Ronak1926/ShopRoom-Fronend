"use client";

import DesignPreview from "@/components/notifications/DesignPreview";
import SampleBadge from "@/components/ui/SampleBadge";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import { rate, type HistoryRow } from "../_data/sampleHistory";

interface Props {
  row: HistoryRow | null;
  onOpenDesign: (row: HistoryRow) => void;
}

/** The send with the best open rate in the window. */
export default function TopTemplateCard({ row, onOpenDesign }: Props) {
  if (!row) return null;

  return (
    <section className="h-full flex flex-col rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">
          Top performing
        </h2>
        <SampleBadge />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="w-20 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
          {row.design ? (
            <DesignPreview design={row.design.designJson} />
          ) : (
            <span className="flex aspect-2/1 items-center justify-center bg-(--color-brand-primary-light) text-(--color-brand-primary)">
              <CampaignOutlinedIcon sx={{ fontSize: 16 }} />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-(--color-text-primary) truncate">
            {row.title}
          </span>
          <span className="inline-flex mt-1 h-5 px-2 rounded-full bg-(--color-brand-primary-light) text-[10px] font-semibold text-(--color-brand-primary) items-center">
            {row.template}
          </span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <span className="rounded-xl bg-(--color-bg-page) px-3 py-2.5">
          <span className="block text-[10.5px] text-(--color-text-hint)">Open rate</span>
          <span className="block mt-0.5 text-[16px] font-bold text-(--color-text-primary) tabular-nums">
            {rate(row.opened, row.delivered)}%
          </span>
        </span>
        <span className="rounded-xl bg-(--color-bg-page) px-3 py-2.5">
          <span className="block text-[10.5px] text-(--color-text-hint)">Click rate</span>
          <span className="block mt-0.5 text-[16px] font-bold text-(--color-text-primary) tabular-nums">
            {rate(row.clicked, row.delivered)}%
          </span>
        </span>
      </div>

      {row.design && (
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onOpenDesign(row)}
            className="w-full h-9 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
          >
            Open in Studio
          </button>
        </div>
      )}
    </section>
  );
}
