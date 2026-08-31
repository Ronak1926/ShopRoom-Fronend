"use client";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import type { TemplateSummary } from "@/features/notifications/api";

interface Props {
  template: TemplateSummary;
  categoryName?: string;
  favourite: boolean;
  /** Set while this card's "Use Template" request is in flight. */
  busy: boolean;
  /** True when the template's requiredPlan is above the shop's plan. */
  locked: boolean;
  onToggleFavourite: (id: string) => void;
  onPreview: (template: TemplateSummary) => void;
  onUse: (template: TemplateSummary) => void;
}

export default function TemplateCard({
  template,
  categoryName,
  favourite,
  busy,
  locked,
  onToggleFavourite,
  onPreview,
  onUse,
}: Props) {
  return (
    <article className="group flex flex-col rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) overflow-hidden transition-colors hover:border-(--color-brand-primary)">
      <div className="relative">
        <DesignPreview design={template.designJson} />

        <button
          type="button"
          title={favourite ? "Remove from favourites" : "Add to favourites"}
          onClick={() => onToggleFavourite(template.id)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-(--color-bg-surface) shadow-(--shadow-sm) text-(--color-text-hint) hover:text-(--color-danger) transition-colors cursor-pointer"
        >
          {favourite ? (
            <FavoriteIcon sx={{ fontSize: 15, color: "var(--color-danger)" }} />
          ) : (
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 15 }} />
          )}
        </button>

        {locked && (
          <span className="absolute top-2 left-2 flex items-center gap-1 h-6 px-2 rounded-full bg-(--color-bg-surface) shadow-(--shadow-sm) text-[10px] font-semibold text-(--color-text-secondary)">
            <LockOutlinedIcon sx={{ fontSize: 12 }} />
            {template.requiredPlan?.toUpperCase()} plan
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-3 pt-2.5">
        <h3 className="text-[12.5px] font-semibold text-(--color-text-primary) truncate">
          {template.name}
        </h3>
        {categoryName && (
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-(--color-brand-primary-light) text-[10px] font-medium text-(--color-brand-primary)">
            {categoryName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="h-8 rounded-lg border border-(--color-border-default) text-[11.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
        >
          Preview
        </button>
        <button
          type="button"
          disabled={busy || locked}
          title={locked ? "Upgrade your plan to use this template" : undefined}
          onClick={() => onUse(template)}
          className="h-8 rounded-lg bg-(--color-brand-primary) text-[11.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Opening…" : "Use Template"}
        </button>
      </div>
    </article>
  );
}
