"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import Avatar from "@/components/ui/Avatar";
import { fetchAllMembers, fetchMembers, type MembersFilter, type MembersPage } from "@/features/members/api";
import { downloadCsv } from "@/lib/csv";
import { membersToCsv } from "@/features/members/csv";
import MembersToolbar, { type NotificationsFilter } from "./MembersToolbar";

interface MembersTableProps {
  /** `preview` is the dashboard's five newest members; `full` adds search, filter, export and paging. */
  variant?: "preview" | "full";
  initialQuery?: string;
}

const TH = "text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) pb-2 border-b border-(--color-border-default) text-left";
const TD = "border-b border-(--color-bg-page) h-14 align-middle text-[13px] text-(--color-text-secondary)";
const PAGE_SIZE = 10;
const PREVIEW_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 300;

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function MembersTable({ variant = "full", initialQuery = "" }: MembersTableProps) {
  const full = variant === "full";
  const limit = full ? PAGE_SIZE : PREVIEW_SIZE;

  const [page, setPage] = useState(0);
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery.trim());
  const [notifications, setNotifications] = useState<NotificationsFilter>("all");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [retry, setRetry] = useState(0);
  // Each answer is tagged with the request it belongs to, so "loading" and "failed" are read
  // off the current page and filters rather than reset by hand.
  const [result, setResult] = useState<{ key: string; data: MembersPage | null; failed: boolean } | null>(null);

  const filter: MembersFilter = { ...(query ? { q: query } : {}), ...(notifications !== "all" ? { notifications } : {}) };
  const requestKey = JSON.stringify([page, limit, query, notifications, retry]);

  // Search as you type, but not on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(queryInput.trim());
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [queryInput]);

  useEffect(() => {
    let cancelled = false;
    const wanted: MembersFilter = { ...(query ? { q: query } : {}), ...(notifications !== "all" ? { notifications } : {}) };
    fetchMembers(page, limit, wanted).then(
      (data) => !cancelled && setResult({ key: requestKey, data, failed: false }),
      () => !cancelled && setResult((prev) => ({ key: requestKey, data: prev?.data ?? null, failed: true })),
    );
    return () => {
      cancelled = true;
    };
  }, [page, limit, query, notifications, requestKey]);

  const current = result?.key === requestKey ? result : null;
  const loading = current === null;
  const members = result?.data?.members ?? [];
  const total = result?.data?.total ?? 0;
  const totalPages = Math.max(1, result?.data?.totalPages ?? 1);
  const error = current?.failed ? "Could not load members." : exportError ? "Could not export members. Please try again." : null;
  const load = () => setRetry((n) => n + 1);

  async function exportCsv() {
    setExporting(true);
    setExportError(false);
    try {
      downloadCsv("shoproom-members.csv", membersToCsv(await fetchAllMembers(filter)));
    } catch {
      setExportError(true);
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="rounded-[14px] border border-(--color-border-default) bg-(--color-bg-surface) p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-(--color-text-primary)">{full ? "Members" : "Recent members"}</h2>
        {!full && (
          <Link href="/shopkeeper/members" className="text-[13px] font-semibold text-(--color-brand-primary) hover:underline">
            View all members →
          </Link>
        )}
      </div>

      {full && (
        <MembersToolbar
          query={queryInput}
          onQueryChange={setQueryInput}
          notifications={notifications}
          onNotificationsChange={(value) => {
            setNotifications(value);
            setPage(0);
          }}
          onExport={() => void exportCsv()}
          exporting={exporting}
          canExport={total > 0}
        />
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-120 border-collapse">
          <thead>
            <tr>
              <th className={`${TH} w-[50%]`}>Member</th>
              <th className={`${TH} w-[30%]`}>Joined</th>
              <th className={`${TH} w-[20%]`}>Notifications</th>
            </tr>
          </thead>
          <tbody className={loading && members.length > 0 ? "opacity-50 transition-opacity" : "transition-opacity"}>
            {loading && members.length === 0 && !error &&
              Array.from({ length: limit > 5 ? 5 : limit }).map((_, i) => (
                <tr key={i}>
                  <td className={TD} colSpan={3}>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-(--color-bg-surface-hover)" />
                  </td>
                </tr>
              ))}
            {error && (
              <tr>
                <td className="py-8 text-center text-sm text-(--color-danger)" colSpan={3}>
                  {error}{" "}
                  <button type="button" onClick={load} className="font-bold underline">
                    Try again
                  </button>
                </td>
              </tr>
            )}
            {!loading && !error && members.length === 0 && (
              <tr>
                <td className="py-8 text-center text-sm text-(--color-text-secondary)" colSpan={3}>
                  {query || notifications !== "all" ? "No members match your search." : "No members yet. Share your invite link to get started!"}
                </td>
              </tr>
            )}
            {!error &&
              members.map((m) => (
                <tr key={m.id}>
                  <td className={TD}>
                    <div className="flex items-center">
                      <Avatar name={m.customerName} size="md" className="mr-2.5" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-(--color-text-primary)">{m.customerName}</div>
                        <div className="truncate text-xs text-(--color-text-secondary)">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className={TD}>{formatDate(m.joinedAt)}</td>
                  <td className={TD}>
                    {m.notificationsEnabled ? (
                      <span title="Notifications on" className="text-(--color-brand-primary)">
                        <NotificationsOutlinedIcon sx={{ fontSize: 18 }} />
                      </span>
                    ) : (
                      <span title="Notifications off" className="text-(--color-text-secondary)">
                        <NotificationsOffOutlinedIcon sx={{ fontSize: 18 }} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {full && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-(--color-text-secondary)">
            Showing {members.length} of {total} {total === 1 ? "member" : "members"}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              disabled={loading || page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-(--color-border-default) bg-(--color-bg-surface) text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-page) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftOutlinedIcon sx={{ fontSize: 15 }} />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={loading || page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-(--color-border-default) bg-(--color-bg-surface) text-(--color-text-secondary) transition-colors hover:bg-(--color-bg-page) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightOutlinedIcon sx={{ fontSize: 15 }} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
