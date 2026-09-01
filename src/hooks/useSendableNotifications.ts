"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listDesigns,
  listTemplates,
  type DesignSummary,
  type TemplateSummary,
} from "@/features/notifications/api";
import type { NotificationDesign } from "@/features/notifications/types";
import { useFavouriteTemplates } from "@/hooks/useFavouriteTemplates";

export type SourceTab = "drafts" | "mine" | "favourites";

export const SOURCE_TABS: { id: SourceTab; label: string }[] = [
  { id: "drafts", label: "Saved Drafts" },
  { id: "mine", label: "My Templates" },
  { id: "favourites", label: "Favourites" },
];

/** A design or template reduced to what the picker and the preview need. */
export interface SendableNotification {
  id: string;
  source: "DESIGN" | "TEMPLATE";
  name: string;
  design: NotificationDesign;
  /** Chip drawn over the card thumbnail — "draft", "v2", "template". */
  badge: string;
  /** Second line under the name. */
  meta: string;
}

/** Enough for the row plus a scroll; the full lists live on Templates. */
const LIMIT = 12;

function fromDesign(design: DesignSummary): SendableNotification {
  return {
    id: design.id,
    source: "DESIGN",
    name: design.name,
    design: design.designJson,
    badge: design.status === "DRAFT" ? "draft" : `v${design.version}`,
    meta: `v${design.version} · edited ${new Date(design.updatedAt).toLocaleDateString()}`,
  };
}

function fromTemplate(template: TemplateSummary): SendableNotification {
  return {
    id: template.id,
    source: "TEMPLATE",
    name: template.name,
    design: template.designJson,
    badge: "template",
    meta: "ShopRoom template",
  };
}

/**
 * Favourites are stored as template ids only, so the catalog is walked until
 * they are all found — the same trade the Templates browser makes rather than
 * adding a bulk-by-id endpoint for a per-device convenience.
 */
async function loadFavourites(ids: string[]): Promise<SendableNotification[]> {
  if (!ids.length) return [];
  const wanted = new Set(ids);
  const found: TemplateSummary[] = [];
  let page = 1;
  let pages = 1;
  do {
    const res = await listTemplates({ page, limit: 24 });
    pages = res.totalPages;
    found.push(...res.items.filter((t) => wanted.has(t.id)));
    page += 1;
  } while (page <= pages && found.length < wanted.size);
  return found.map(fromTemplate);
}

/**
 * The notifications available to send, per tab, fetched on first visit to that
 * tab and then kept — switching tabs while composing should not re-fetch or
 * flash a skeleton over a choice already made.
 */
export function useSendableNotifications() {
  const favourites = useFavouriteTemplates();
  const [tab, setTab] = useState<SourceTab>("drafts");
  const [cache, setCache] = useState<Partial<Record<SourceTab, SendableNotification[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favouriteIds = favourites.ids;

  const load = useCallback(
    async (which: SourceTab, ids: string[]) => {
      setLoading(true);
      setError(null);
      try {
        let items: SendableNotification[];
        if (which === "favourites") {
          items = await loadFavourites(ids);
        } else {
          const res = await listDesigns({
            status: which === "drafts" ? "DRAFT" : "ACTIVE",
            archived: false,
            limit: LIMIT,
          });
          items = res.items.map(fromDesign);
        }
        setCache((prev) => ({ ...prev, [which]: items }));
      } catch {
        setError("Could not load your notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // Already fetched: `loading` is derived below, so nothing to reset here.
    if (cache[tab]) return;
    void load(tab, favouriteIds);
  }, [tab, cache, favouriteIds, load]);

  const reload = useCallback(() => {
    setCache((prev) => ({ ...prev, [tab]: undefined }));
  }, [tab]);

  return {
    tab,
    setTab,
    items: cache[tab] ?? [],
    loading: loading && !cache[tab],
    error,
    reload,
  };
}
