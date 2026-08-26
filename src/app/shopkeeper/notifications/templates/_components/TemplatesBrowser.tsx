"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
  archiveDesign,
  cloneTemplate,
  listCategories,
  listDesigns,
  listTemplates,
  type DesignSummary,
  type NotificationCategory,
  type TemplateSummary,
} from "@/features/notifications/api";
import TemplateCard from "./TemplateCard";
import DesignCard from "./DesignCard";
import TemplateGridSkeleton from "./TemplateGridSkeleton";
import TemplatePreviewModal from "./TemplatePreviewModal";
import { useFavouriteTemplates } from "../_hooks/useFavouriteTemplates";

type Tab = "catalog" | "mine" | "drafts" | "favourites";
type Sort = "popular" | "newest" | "name";

const TABS: { id: Tab; label: string; icon: typeof GridViewOutlinedIcon }[] = [
  { id: "catalog", label: "ShopRoom Templates", icon: GridViewOutlinedIcon },
  { id: "mine", label: "My Templates", icon: PersonOutlineOutlinedIcon },
  { id: "drafts", label: "Drafts", icon: EditNoteOutlinedIcon },
  { id: "favourites", label: "Favourites", icon: FavoriteBorderOutlinedIcon },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "name", label: "Name" },
];

/** Must match STORAGE_KEY in useNotificationDesign — the Studio reopens whatever
 *  design id it finds here, which is how "Use Template" hands one over. */
const STUDIO_DESIGN_KEY = "studio_design_id";

const PAGE_SIZE = 12;
/** Fetch the next page once the card this far through the list comes into view. */
const PREFETCH_AT = 0.7;
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4";

export default function TemplatesBrowser() {
  const router = useRouter();
  const favourites = useFavouriteTemplates();

  const [tab, setTab] = useState<Tab>("catalog");
  const [categories, setCategories] = useState<NotificationCategory[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("popular");
  const [search, setSearch] = useState("");

  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [designs, setDesigns] = useState<DesignSummary[]>([]);
  const [favouriteItems, setFavouriteItems] = useState<TemplateSummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingId, setUsingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<TemplateSummary | null>(null);

  // Held as state, not a ref, so the observer effect re-runs when the element
  // at the 70% mark moves after a page is appended.
  const [nearEndEl, setNearEndEl] = useState<HTMLDivElement | null>(null);
  const inFlight = useRef(false);

  const categoryName = useCallback(
    (id: string | null) => categories.find((c) => c.id === id)?.name,
    [categories],
  );

  useEffect(() => {
    let cancelled = false;
    listCategories()
      .then((c) => !cancelled && setCategories(c))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Imperative on purpose: called from a debounce timer, the scroll observer
   * and click handlers — never synchronously from an effect body, which would
   * make the loading flags cascade renders.
   */
  const loadCatalog = useCallback(
    async (opts: { page: number; sort: Sort; categoryId: string | null; q: string; append: boolean }) => {
      if (inFlight.current) return;
      inFlight.current = true;
      if (opts.append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await listTemplates({
          page: opts.page,
          limit: PAGE_SIZE,
          sort: opts.sort,
          ...(opts.categoryId ? { categoryId: opts.categoryId } : {}),
          ...(opts.q ? { q: opts.q } : {}),
        });
        setTemplates((prev) => {
          if (!opts.append) return res.items;
          // A page boundary can repeat a row if the catalog shifts mid-scroll;
          // dedupe so React keys stay unique.
          const seen = new Set(prev.map((t) => t.id));
          return [...prev, ...res.items.filter((t) => !seen.has(t.id))];
        });
        setTotal(res.total);
        setPage(res.page);
        setHasMore(res.page < res.totalPages);
        setError(null);
      } catch {
        if (!opts.append) setTemplates([]);
        setHasMore(false);
        setError("Could not load templates. Please try again.");
      } finally {
        inFlight.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  const loadDesigns = useCallback(async (which: "mine" | "drafts") => {
    setLoading(true);
    try {
      const res = await listDesigns({
        status: which === "mine" ? "ACTIVE" : "DRAFT",
        archived: false,
        limit: 40,
      });
      setDesigns(res.items);
      setError(null);
    } catch {
      setDesigns([]);
      setError("Could not load your designs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavourites = useCallback(async (ids: string[]) => {
    if (!ids.length) {
      setFavouriteItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Favourites are stored as ids only, so the catalog is walked once rather
      // than adding a bulk-by-id endpoint for a per-device convenience.
      const wanted = new Set(ids);
      const found: TemplateSummary[] = [];
      let p = 1;
      let pages = 1;
      do {
        const res = await listTemplates({ page: p, limit: 24 });
        pages = res.totalPages;
        found.push(...res.items.filter((t) => wanted.has(t.id)));
        p += 1;
      } while (p <= pages && found.length < wanted.size);
      setFavouriteItems(found);
      setError(null);
    } catch {
      setError("Could not load your favourites. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Catalog: debounced so typing does not fire a request per keystroke. The
  // call sits inside the timer, which keeps it out of the effect body.
  useEffect(() => {
    if (tab !== "catalog") return;
    const timer = setTimeout(() => {
      loadCatalog({ page: 1, sort, categoryId, q: search.trim(), append: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [tab, sort, categoryId, search, loadCatalog]);

  useEffect(() => {
    if (tab !== "mine" && tab !== "drafts") return;
    const timer = setTimeout(() => loadDesigns(tab), 0);
    return () => clearTimeout(timer);
  }, [tab, loadDesigns]);

  const favouriteIds = favourites.ids;
  useEffect(() => {
    if (tab !== "favourites") return;
    const timer = setTimeout(() => loadFavourites(favouriteIds), 0);
    return () => clearTimeout(timer);
  }, [tab, favouriteIds, loadFavourites]);

  // Infinite scroll: the grid tags the card ~70% of the way through what is
  // loaded; once it scrolls into view the next page is fetched and appended.
  useEffect(() => {
    if (tab !== "catalog" || !nearEndEl || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadCatalog({ page: page + 1, sort, categoryId, q: search.trim(), append: true });
        }
      },
      // Start a little early so the next page is usually there by the time the
      // user actually reaches it.
      { rootMargin: "300px" },
    );
    observer.observe(nearEndEl);
    return () => observer.disconnect();
  }, [tab, nearEndEl, hasMore, loading, loadingMore, page, sort, categoryId, search, loadCatalog]);

  function selectTab(next: Tab) {
    if (next === tab) return;
    // Both set in the same click, so the very next render already shows the new
    // tab in its loading state — without this there is one frame holding the
    // previous tab's cards (or an empty state) before the fetch begins.
    setTab(next);
    setLoading(true);
    setError(null);
  }

  async function handleUse(template: TemplateSummary) {
    setUsingId(template.id);
    try {
      const record = await cloneTemplate(template.id);
      localStorage.setItem(STUDIO_DESIGN_KEY, record.id);
      router.push("/shopkeeper/notifications/studio");
    } catch {
      setError("Could not open that template. Please try again.");
      setUsingId(null);
    }
  }

  function openDesign(id: string) {
    localStorage.setItem(STUDIO_DESIGN_KEY, id);
    router.push("/shopkeeper/notifications/studio");
  }

  /**
   * Archives a design and drops it from the grid straight away, restoring the
   * card if the request fails. The Studio autosaves on every edit, so drafts
   * accumulate fast and this is the only way to clear them.
   */
  async function handleDelete(id: string) {
    setDeletingId(id);
    const previous = designs;
    setDesigns((list) => list.filter((d) => d.id !== id));
    try {
      await archiveDesign(id);
      // Otherwise the Studio would reopen a design that is no longer listed.
      if (localStorage.getItem(STUDIO_DESIGN_KEY) === id) {
        localStorage.removeItem(STUDIO_DESIGN_KEY);
      }
    } catch {
      setDesigns(previous);
      setError("Could not delete that design. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const showingTemplates = tab === "catalog" || tab === "favourites";
  const items = tab === "catalog" ? templates : favouriteItems;
  const count = showingTemplates ? items.length : designs.length;
  // Skeleton only when there is nothing to show. With cards already on screen a
  // refetch dims them instead, so filtering never flashes the layout away.
  const showSkeleton = loading && count === 0;
  const dim = loading && count > 0;
  const triggerIndex = Math.max(0, Math.floor(items.length * PREFETCH_AT) - 1);

  const emptyCopy = useMemo(() => {
    if (tab === "catalog") return "No templates match that search.";
    if (tab === "mine") return "Designs you finish will appear here. Open one in the Studio and save it.";
    if (tab === "drafts") return "No drafts yet — start one from any template.";
    return "Tap the heart on a template to keep it here.";
  }, [tab]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-(--color-border-default) mb-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => selectTab(id)}
            className={`flex items-center gap-1.5 px-3 pb-2.5 pt-1 text-[13px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              tab === id
                ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            <Icon sx={{ fontSize: 16 }} />
            {label}
          </button>
        ))}
      </div>

      {tab === "catalog" && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <label className="flex items-center gap-2 h-9 px-3 flex-1 min-w-55 max-w-sm rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) focus-within:border-(--color-brand-primary) transition-colors">
              <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full bg-transparent border-0 outline-none text-[13px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
              />
            </label>

            <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface)">
              <span className="text-[12px] text-(--color-text-hint)">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent border-0 outline-none text-[12.5px] font-medium text-(--color-text-primary) cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <button
              type="button"
              onClick={() => setCategoryId(null)}
              className={chip(categoryId === null)}
            >
              All Templates
            </button>
            {categories.map((c) => (
              <button key={c.id} type="button" onClick={() => setCategoryId(c.id)} className={chip(categoryId === c.id)}>
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-(--color-danger) bg-(--color-danger-bg) px-4 py-2.5 text-[12.5px] text-(--color-danger-text)">
          {error}
        </div>
      )}

      {showSkeleton ? (
        <TemplateGridSkeleton count={PAGE_SIZE} />
      ) : (
        <div className={dim ? "opacity-60 transition-opacity pointer-events-none" : "transition-opacity"}>
          {showingTemplates ? (
            items.length ? (
              <div className={GRID}>
                {items.map((t, i) => (
                  <div key={t.id} ref={i === triggerIndex ? setNearEndEl : undefined}>
                    <TemplateCard
                      template={t}
                      categoryName={categoryName(t.categoryId)}
                      favourite={favourites.has(t.id)}
                      busy={usingId === t.id}
                      locked={false}
                      onToggleFavourite={favourites.toggle}
                      onPreview={setPreviewing}
                      onUse={handleUse}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState copy={emptyCopy} />
            )
          ) : designs.length ? (
            <div className={GRID}>
              {designs.map((d) => (
                <DesignCard
                  key={d.id}
                  design={d}
                  busy={deletingId === d.id}
                  onOpen={openDesign}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState copy={emptyCopy} />
          )}
        </div>
      )}

      {tab === "catalog" && !showSkeleton && (
        <div className="pt-6 pb-2 text-center">
          {loadingMore ? (
            <span className="text-[12px] text-(--color-text-hint)">Loading more…</span>
          ) : items.length ? (
            <span className="text-[12px] text-(--color-text-hint)">
              Showing {items.length} of {total} templates
              {!hasMore && total > PAGE_SIZE ? " · that's all of them" : ""}
            </span>
          ) : null}
        </div>
      )}

      {previewing && (
        <TemplatePreviewModal
          template={previewing}
          categoryName={categoryName(previewing.categoryId)}
          busy={usingId === previewing.id}
          locked={false}
          onClose={() => setPreviewing(null)}
          onUse={handleUse}
        />
      )}
    </>
  );
}

function chip(active: boolean): string {
  return `h-8 px-3 rounded-lg border text-[12px] font-medium transition-colors cursor-pointer ${
    active
      ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
      : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
  }`;
}

function EmptyState({ copy }: { copy: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-(--color-border-strong) bg-(--color-bg-surface) py-16 px-6">
      <span className="w-12 h-12 rounded-2xl bg-(--color-brand-primary-light) flex items-center justify-center text-(--color-brand-primary) mb-3">
        <GridViewOutlinedIcon sx={{ fontSize: 24 }} />
      </span>
      <p className="max-w-sm text-[13px] text-(--color-text-secondary)">{copy}</p>
    </div>
  );
}
