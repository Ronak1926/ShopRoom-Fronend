"use client";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "../../../../utils/apiClient";

export interface MemberRow {
  id: string;
  customerName: string;
  email: string;
  joinedAt: string;
  notificationsEnabled: boolean;
}

interface MembersTableProps {
  /** Pass false while the parent dashboard data is still loading. */
  dashboardLoading?: boolean;
}

const TH =
  "text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint) pb-2 border-b border-(--color-border-default) text-left";
const TD =
  "border-b border-(--color-bg-page) h-14 align-middle text-[13px] text-(--color-text-secondary)";

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const AVATAR_COLORS = [
  "bg-[var(--color-brand-primary-light)]",
  "bg-[var(--color-brand-alert-light)]",
  "bg-[var(--color-avatar-pink-bg)]",
  "bg-[var(--color-avatar-indigo-bg)]",
];

export default function MembersTable({ dashboardLoading }: MembersTableProps) {
  const [page, setPage] = useState(0);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);

  const fetchMembers = useCallback(async (p: number, isInitial: boolean) => {
    if (isInitial) setInitialLoading(true);
    else setPaginating(true);
    try {
      const token = localStorage.getItem("shopkeeper_token");
      const res = await apiClient.get<{
        members: MemberRow[];
        total: number;
        totalPages: number;
      }>(`/api/shop/members?page=${p}&limit=${PAGE_SIZE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setMembers(res.data.members);
      setTotal(res.data.total);
      setTotalPages(Math.max(1, res.data.totalPages));
    } catch {
      // keep previous data on error
    } finally {
      setInitialLoading(false);
      setPaginating(false);
    }
  }, []);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!dashboardLoading) {
      const isInitial = isFirstLoad.current;
      isFirstLoad.current = false;
      fetchMembers(page, isInitial);
    }
  }, [page, dashboardLoading, fetchMembers]);

  const showSkeleton = dashboardLoading || initialLoading;

  return (
    <div className="bg-(--color-bg-surface) border border-(--color-border-default) rounded-[14px] p-6 mt-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-(--color-text-primary)">
          Active Members
        </span>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-secondary) border border-(--color-border-default) rounded-lg px-3 h-8 cursor-pointer bg-(--color-bg-surface) hover:bg-(--color-bg-page) transition-colors font-[inherit]">
            <FilterListOutlinedIcon sx={{ fontSize: 14 }} /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-secondary) border border-(--color-border-default) rounded-lg px-3 h-8 cursor-pointer bg-(--color-bg-surface) hover:bg-(--color-bg-page) transition-colors font-[inherit]">
            <FileDownloadOutlinedIcon sx={{ fontSize: 14 }} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className={`${TH} w-[35%]`}>Member Name</th>
            <th className={`${TH} w-[25%]`}>Joined Date</th>
            <th className={`${TH} w-[25%]`}>
              <span className="flex items-center gap-1.5">
                Last Seen
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-(--color-badge-neutral-bg) text-(--color-badge-neutral-text) border border-(--color-border-default) normal-case tracking-normal">
                  Soon
                </span>
              </span>
            </th>
            <th className={`${TH} w-[15%]`}>Notifications</th>
          </tr>
        </thead>
        <tbody
          className={
            paginating
              ? "opacity-50 transition-opacity duration-150"
              : "transition-opacity duration-150"
          }
        >
          {showSkeleton &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className={TD} colSpan={4}>
                  <div className="h-4 bg-(--color-bg-page) rounded animate-pulse w-3/4" />
                </td>
              </tr>
            ))}
          {!showSkeleton && members.length === 0 && (
            <tr>
              <td
                className="py-8 text-center text-sm text-(--color-text-secondary)"
                colSpan={4}
              >
                No members yet. Share your invite link to get started!
              </td>
            </tr>
          )}
          {!showSkeleton &&
            members.map((m, idx) => (
              <tr key={m.id}>
                <td className={TD}>
                  <div className="flex items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mr-2.5 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                    >
                      <PersonOutlinedIcon
                        sx={{
                          fontSize: 17,
                          color: "var(--color-text-secondary)",
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-(--color-text-primary)">
                        {m.customerName}
                      </div>
                      <div className="text-xs text-(--color-text-secondary)">
                        {m.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={TD}>{formatDate(m.joinedAt)}</td>
                <td className={`${TD} text-(--color-text-hint) italic`}>—</td>
                <td className={TD}>
                  {m.notificationsEnabled ? (
                    <NotificationsOutlinedIcon
                      sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
                    />
                  ) : (
                    <NotificationsOffOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: "var(--color-text-secondary)",
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-(--color-text-secondary)">
          Showing {members.length} of {total} members
        </span>
        <div className="flex gap-1.5">
          <button
            disabled={paginating || showSkeleton || page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="w-7 h-7 flex items-center justify-center border border-(--color-border-default) rounded-md bg-(--color-bg-surface) cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeftOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
          <button
            disabled={paginating || showSkeleton || page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="w-7 h-7 flex items-center justify-center border border-(--color-border-default) rounded-md bg-(--color-bg-surface) cursor-pointer text-(--color-text-secondary) hover:bg-(--color-bg-page) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRightOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
