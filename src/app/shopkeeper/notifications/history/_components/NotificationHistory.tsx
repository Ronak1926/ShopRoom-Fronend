"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import NotificationsShell from "../../_components/NotificationsShell";
import Dropdown from "@/components/ui/Dropdown";
import SampleBadge from "@/components/ui/SampleBadge";
import DesignPreview from "@/components/notifications/DesignPreview";
import { listDesigns, type DesignSummary } from "@/features/notifications/api";
import { useShopAudience } from "@/hooks/useShopAudience";
import HistoryTable from "./HistoryTable";
import OverallPerformanceCard from "./OverallPerformanceCard";
import TopTemplateCard from "./TopTemplateCard";
import DeliverySummaryCard from "./DeliverySummaryCard";
import HistoryTips from "./HistoryTips";
import HistorySkeleton from "./HistorySkeleton";
import {
  buildSampleHistory,
  rate,
  totalsOf,
  type HistoryRow,
  type HistoryStatus,
} from "../_data/sampleHistory";

type Tab = "all" | HistoryStatus | "drafts";
type Sort = "latest" | "oldest" | "opens" | "clicks";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "DELIVERED", label: "Delivered" },
  { id: "OPENED", label: "Opened" },
  { id: "CLICKED", label: "Clicked" },
  { id: "FAILED", label: "Failed" },
  { id: "drafts", label: "Drafts" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "opens", label: "Best open rate" },
  { value: "clicks", label: "Most clicked" },
];

const PAGE_SIZE = 8;

/** Must match STORAGE_KEY in useNotificationDesign — the Studio opens whatever
 *  design id it finds here. */
const STUDIO_DESIGN_KEY = "studio_design_id";

export default function NotificationHistory() {
  const router = useRouter();
  const { shop } = useShopAudience();
  const [drafts, setDrafts] = useState<DesignSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("latest");
  const [rangeDays, setRangeDays] = useState(7);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    listDesigns({ archived: false, limit: 12 })
      .then((res) => {
        if (!cancelled) setDrafts(res.items);
      })
      .catch(() => {
        // The table still renders; rows simply fall back to generic banners.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const history = useMemo(
    () => buildSampleHistory(shop?.membersCount ?? 0, drafts),
    [shop?.membersCount, drafts],
  );

  // Anchored to the newest row rather than the clock: the window then depends
  // only on the data it filters, and stays stable across re-renders.
  const inRange = useMemo(() => {
    const newest = history.reduce((max, row) => Math.max(max, row.sentAt.getTime()), 0);
    const cutoff = newest - (rangeDays - 1) * 86_400_000;
    return history.filter((row) => row.sentAt.getTime() >= cutoff);
  }, [history, rangeDays]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = inRange.filter((row) => {
      if (tab !== "all" && tab !== "drafts" && row.status !== tab) return false;
      if (!needle) return true;
      return (
        row.title.toLowerCase().includes(needle) ||
        row.template.toLowerCase().includes(needle)
      );
    });

    const sorted = [...rows];
    if (sort === "latest") sorted.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
    if (sort === "oldest") sorted.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
    if (sort === "opens")
      sorted.sort((a, b) => rate(b.opened, b.delivered) - rate(a.opened, a.delivered));
    if (sort === "clicks") sorted.sort((a, b) => b.clicked - a.clicked);
    return sorted;
  }, [inRange, tab, query, sort]);

  const totals = useMemo(() => totalsOf(inRange), [inRange]);
  const topRow = useMemo(() => {
    const candidates = inRange.filter((row) => row.status !== "FAILED" && row.delivered > 0);
    return candidates.length
      ? candidates.reduce((best, row) =>
          rate(row.opened, row.delivered) > rate(best.opened, best.delivered) ? row : best,
        )
      : null;
  }, [inRange]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openInStudio(row: HistoryRow) {
    if (!row.design) return;
    try {
      localStorage.setItem(STUDIO_DESIGN_KEY, row.design.id);
    } catch {
      // Private mode: the Studio opens on its own last design instead.
    }
    router.push("/shopkeeper/notifications/studio");
  }

  /** Exports what is on screen, so the download always matches the filters. */
  function exportCsv() {
    const header = [
      "Title",
      "Template",
      "Audience",
      "Status",
      "Sent at",
      "Delivered",
      "Opened",
      "Clicked",
    ];
    const lines = filtered.map((row) =>
      [
        row.title,
        row.template,
        row.audience,
        row.status,
        row.sentAt.toISOString(),
        row.delivered,
        row.opened,
        row.clicked,
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notification-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <NotificationsShell
      title="Notification History"
      description="Track the performance and delivery status of all your notifications."
      icon={HistoryOutlinedIcon}
      headerAside={
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) text-[12.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
        >
          <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
          Export CSV
        </button>
      }
    >
      {loading ? (
        <HistorySkeleton />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 min-w-0">
            <div
              role="tablist"
              aria-label="Delivery status"
              className="flex flex-wrap items-center gap-1 border-b border-(--color-border-default)"
            >
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => {
                    setTab(id);
                    setPage(1);
                  }}
                  className={`h-10 px-3.5 -mb-px border-b-2 text-[13px] transition-colors cursor-pointer ${
                    tab === id
                      ? "border-(--color-brand-primary) text-(--color-brand-primary) font-semibold"
                      : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex-1 min-w-56 flex items-center gap-2 h-10 px-3.5 rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) transition-colors focus-within:border-(--color-brand-primary)">
                <SearchOutlinedIcon sx={{ fontSize: 17, color: "var(--color-text-hint)" }} />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by title or template…"
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[12.5px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
                />
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[12px] text-(--color-text-secondary)">Sort by</span>
                <Dropdown
                  value={sort}
                  options={SORT_OPTIONS}
                  onChange={(value) => setSort(value as Sort)}
                  ariaLabel="Sort history"
                  className="w-44"
                />
              </div>
            </div>

            {tab === "drafts" ? (
              <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
                <h2 className="text-[14px] font-bold text-(--color-text-primary)">
                  Drafts not yet sent
                </h2>
                <p className="text-[11.5px] text-(--color-text-hint) mt-0.5">
                  Your saved designs. These are real — everything else on this page is sample
                  data until sends are recorded.
                </p>

                {drafts.length === 0 ? (
                  <p className="mt-4 rounded-xl border border-dashed border-(--color-border-strong) py-10 text-center text-[12.5px] text-(--color-text-secondary)">
                    No drafts yet. Design one in the Studio and it shows up here.
                  </p>
                ) : (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {drafts.map((draft) => (
                      <button
                        key={draft.id}
                        type="button"
                        onClick={() =>
                          openInStudio({ design: draft } as HistoryRow)
                        }
                        className="flex flex-col text-left rounded-xl border border-(--color-border-default) overflow-hidden hover:border-(--color-brand-primary) transition-colors cursor-pointer"
                      >
                        <DesignPreview design={draft.designJson} />
                        <span className="px-2.5 py-2">
                          <span className="block text-[12px] font-semibold text-(--color-text-primary) truncate">
                            {draft.name}
                          </span>
                          <span className="block text-[10.5px] text-(--color-text-hint) mt-0.5">
                            {draft.status === "DRAFT" ? "draft" : `v${draft.version}`} ·{" "}
                            {new Date(draft.updatedAt).toLocaleDateString()}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) overflow-hidden">
                <header className="flex items-center gap-2 px-4 pt-4">
                  <h2 className="text-[13px] font-bold text-(--color-text-primary)">
                    {filtered.length.toLocaleString()} notification
                    {filtered.length === 1 ? "" : "s"}
                  </h2>
                  <SampleBadge title="Sends are not recorded on the server yet." />
                </header>

                {visible.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                    <EventBusyOutlinedIcon
                      sx={{ fontSize: 24, color: "var(--color-text-hint)" }}
                    />
                    <p className="text-[12.5px] text-(--color-text-secondary)">
                      Nothing matches these filters.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3">
                    <HistoryTable rows={visible} onOpenDesign={openInStudio} />
                  </div>
                )}

                {filtered.length > 0 && (
                  <footer className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 border-t border-(--color-border-default)">
                    <p className="text-[11.5px] text-(--color-text-hint)">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                      {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Previous page"
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />
                      </button>

                      {Array.from({ length: pageCount }, (_, i) => i + 1)
                        .filter(
                          (number) =>
                            number === 1 ||
                            number === pageCount ||
                            Math.abs(number - currentPage) <= 1,
                        )
                        .map((number, index, list) => (
                          <span key={number} className="flex items-center gap-1.5">
                            {index > 0 && number - list[index - 1] > 1 && (
                              <span className="text-[11.5px] text-(--color-text-hint)">…</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setPage(number)}
                              className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                                number === currentPage
                                  ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                                  : "border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
                              }`}
                            >
                              {number}
                            </button>
                          </span>
                        ))}

                      <button
                        type="button"
                        title="Next page"
                        disabled={currentPage === pageCount}
                        onClick={() => setPage(currentPage + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </footer>
                )}
              </section>
            )}
          </div>

          <OverallPerformanceCard
            totals={totals}
            rangeDays={rangeDays}
            onRangeChange={(days) => {
              setRangeDays(days);
              setPage(1);
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            <TopTemplateCard row={topRow} onOpenDesign={openInStudio} />
            <DeliverySummaryCard totals={totals} />
            <HistoryTips />
          </div>
        </div>
      )}
    </NotificationsShell>
  );
}
