"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import NotificationsShell from "../../_components/NotificationsShell";
import Dropdown from "@/components/ui/Dropdown";
import DesignPreview from "@/components/notifications/DesignPreview";
import { listSends, type DesignSummary, type SendHistoryParams } from "@/features/notifications/api";
import { downloadCsv, toCsv } from "@/lib/csv";
import HistoryTable from "./HistoryTable";
import HistoryPagination from "./HistoryPagination";
import OverallPerformanceCard from "./OverallPerformanceCard";
import TopTemplateCard from "./TopTemplateCard";
import DeliverySummaryCard from "./DeliverySummaryCard";
import HistoryTips from "./HistoryTips";
import HistorySkeleton from "./HistorySkeleton";
import { useDesigns, useSendRows, useSummary } from "../_hooks/useHistoryData";
import { toHistoryRow, type HistoryRow } from "../_utils/historyRows";

type Outcome = NonNullable<SendHistoryParams["outcome"]>;
type Sort = NonNullable<SendHistoryParams["sort"]>;
type Tab = Outcome | "drafts";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "delivered", label: "Delivered" },
  { id: "opened", label: "Opened" },
  { id: "clicked", label: "Clicked" },
  { id: "failed", label: "Failed" },
  { id: "drafts", label: "Drafts" },
];

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "opens", label: "Best open rate" },
  { value: "clicks", label: "Most clicked" },
];

const PAGE_SIZE = 8;
const EXPORT_PAGE_SIZE = 50;
/** A hard stop so an export can never become an endless run of requests. */
const EXPORT_MAX_PAGES = 40;
const SEARCH_DEBOUNCE_MS = 300;

/** Must match STORAGE_KEY in useNotificationDesign — the Studio opens whatever design id it finds here. */
const STUDIO_DESIGN_KEY = "studio_design_id";

export default function NotificationHistory() {
  const router = useRouter();
  const designs = useDesigns();

  const [tab, setTab] = useState<Tab>("all");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("latest");
  const [rangeDays, setRangeDays] = useState(7);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(queryInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [queryInput]);

  const outcome: Outcome = tab === "drafts" ? "all" : tab;
  const filters = { outcome, sort, q: query, days: rangeDays, page, pageSize: PAGE_SIZE };
  const sends = useSendRows(filters, designs);
  const summary = useSummary(rangeDays);

  const drafts = designs.filter((d) => d.status === "DRAFT");
  const topDesign = summary?.analytics.topDesigns[0] ?? null;

  function openInStudio(design: DesignSummary | null) {
    if (!design) return;
    try {
      localStorage.setItem(STUDIO_DESIGN_KEY, design.id);
    } catch {
      // Private mode: the Studio opens on its own last design instead.
    }
    router.push("/shopkeeper/notifications/studio");
  }

  /** Exports everything matching the current filters, not just the visible page. */
  async function exportCsv() {
    setExporting(true);
    setExportError(false);
    try {
      const rows: HistoryRow[] = [];
      for (let p = 1; p <= EXPORT_MAX_PAGES; p += 1) {
        const result = await listSends({ page: p, limit: EXPORT_PAGE_SIZE, outcome, sort, days: rangeDays, ...(query ? { q: query } : {}) });
        rows.push(...result.items.map((item) => toHistoryRow(item, designs)));
        if (p * EXPORT_PAGE_SIZE >= result.total) break;
      }
      downloadCsv(
        `notification-history-${new Date().toISOString().slice(0, 10)}.csv`,
        toCsv([
          ["Notification", "Message", "Source", "Audience", "Status", "Sent at", "Devices addressed", "Delivered", "Opened", "Clicked"],
          ...rows.map((r) => [r.title, r.body, r.source, r.audienceLabel, r.status.toLowerCase(), r.sentAt.toISOString(), String(r.audience), String(r.delivered), String(r.opened), String(r.clicked)]),
        ]),
      );
    } catch {
      setExportError(true);
    } finally {
      setExporting(false);
    }
  }

  return (
    <NotificationsShell
      title="Notification History"
      description="Track the performance and delivery status of all your notifications."
      icon={HistoryOutlinedIcon}
      headerAside={
        <button
          type="button"
          onClick={() => void exportCsv()}
          disabled={exporting || sends.total === 0}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) text-[12.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      }
    >
      {!sends.loaded && sends.loading ? (
        <HistorySkeleton />
      ) : (
        <div className="flex flex-col gap-5">
          {exportError && (
            <p role="alert" className="rounded-xl bg-(--color-danger-bg) px-4 py-3 text-[13px] text-(--color-danger)">
              Could not export the history. Please try again.
            </p>
          )}

          <div className="flex flex-col gap-4 min-w-0">
            <div role="tablist" aria-label="Delivery status" className="flex flex-wrap items-center gap-1 border-b border-(--color-border-default)">
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
                <SearchOutlinedIcon sx={{ fontSize: 17 }} className="text-(--color-text-hint)" />
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  maxLength={100}
                  aria-label="Search notifications"
                  placeholder="Search by title or message…"
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[12.5px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
                />
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[12px] text-(--color-text-secondary)">Sort by</span>
                <Dropdown
                  value={sort}
                  options={SORT_OPTIONS}
                  onChange={(value) => {
                    setSort(value as Sort);
                    setPage(1);
                  }}
                  ariaLabel="Sort history"
                  className="w-44"
                />
              </div>
            </div>

            {tab === "drafts" ? (
              <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
                <h2 className="text-[14px] font-bold text-(--color-text-primary)">Drafts not yet sent</h2>
                <p className="text-[11.5px] text-(--color-text-hint) mt-0.5">Your saved drafts. Open one in the Studio to finish it.</p>

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
                        onClick={() => openInStudio(draft)}
                        className="flex flex-col text-left rounded-xl border border-(--color-border-default) overflow-hidden hover:border-(--color-brand-primary) transition-colors cursor-pointer"
                      >
                        <DesignPreview design={draft.designJson} />
                        <span className="px-2.5 py-2">
                          <span className="block text-[12px] font-semibold text-(--color-text-primary) truncate">{draft.name}</span>
                          <span className="block text-[10.5px] text-(--color-text-hint) mt-0.5">
                            draft · {new Date(draft.updatedAt).toLocaleDateString()}
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
                    {sends.total.toLocaleString()} notification{sends.total === 1 ? "" : "s"}
                  </h2>
                </header>

                {sends.error ? (
                  <p role="alert" className="py-16 px-6 text-center text-[12.5px] text-(--color-danger)">
                    Could not load your history. Please refresh to try again.
                  </p>
                ) : sends.rows.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                    <EventBusyOutlinedIcon sx={{ fontSize: 24 }} className="text-(--color-text-hint)" />
                    <p className="text-[12.5px] text-(--color-text-secondary)">
                      {sends.loading ? "Loading…" : query || tab !== "all" ? "Nothing matches these filters." : "No notifications sent in this period."}
                    </p>
                  </div>
                ) : (
                  <div className={`mt-3 ${sends.loading ? "opacity-50 transition-opacity" : ""}`}>
                    <HistoryTable rows={sends.rows} onOpenDesign={(row) => openInStudio(row.design)} />
                  </div>
                )}

                {sends.total > 0 && <HistoryPagination page={page} pageSize={PAGE_SIZE} total={sends.total} onPage={setPage} />}
              </section>
            )}
          </div>

          {summary && (
            <OverallPerformanceCard
              totals={summary.totals}
              rangeDays={rangeDays}
              onRangeChange={(days) => {
                setRangeDays(days);
                setPage(1);
              }}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {summary && (
              <TopTemplateCard
                top={topDesign}
                design={designs.find((d) => d.id === topDesign?.designId) ?? null}
                onOpenDesign={openInStudio}
              />
            )}
            {summary && <DeliverySummaryCard totals={summary.totals} />}
            <HistoryTips />
          </div>
        </div>
      )}
    </NotificationsShell>
  );
}
