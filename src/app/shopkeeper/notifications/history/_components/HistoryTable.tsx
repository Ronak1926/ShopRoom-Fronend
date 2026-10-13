"use client";

import { useState } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import { rate, type HistoryRow, type HistoryStatus } from "../_data/sampleHistory";

const STATUS_STYLE: Record<HistoryStatus, string> = {
  DELIVERED: "bg-(--color-success-light) text-(--color-success-text)",
  OPENED: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
  CLICKED: "bg-(--color-avatar-indigo-bg) text-(--color-avatar-1)",
  FAILED: "bg-(--color-danger-bg) text-(--color-danger)",
};

const STATUS_LABEL: Record<HistoryStatus, string> = {
  DELIVERED: "Delivered",
  OPENED: "Opened",
  CLICKED: "Clicked",
  FAILED: "Failed",
};

/**
 * One grid template shared by the header and every row, so the columns line up
 * by construction — a table head cannot align with a grid body, which is what
 * pushed Performance out from under its own heading.
 */
const COLUMNS =
  "grid grid-cols-[minmax(230px,2.3fr)_minmax(110px,0.9fr)_minmax(120px,1fr)_minmax(104px,0.8fr)_minmax(110px,0.9fr)_minmax(200px,1.4fr)_44px] gap-3 items-center";

const HEAD = "text-[10px] font-semibold tracking-widest uppercase text-(--color-text-hint)";

const DAY = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const TIME = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });

function dayLabel(date: Date, today: Date): string {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(today) - start(date)) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return DAY.format(date);
}

function Metric({
  icon: Icon,
  value,
  percent,
}: {
  icon: typeof VisibilityOutlinedIcon;
  value: number;
  percent: number;
}) {
  return (
    <span className="flex flex-col items-start gap-0.5 min-w-14">
      <span className="flex items-center gap-1 text-[12px] font-semibold text-(--color-text-primary) tabular-nums">
        <Icon sx={{ fontSize: 14, color: "var(--color-text-hint)" }} />
        {value.toLocaleString()}
      </span>
      <span className="text-[10.5px] text-(--color-text-hint) tabular-nums">{percent}%</span>
    </span>
  );
}

interface Props {
  rows: HistoryRow[];
  onOpenDesign: (row: HistoryRow) => void;
}

/** The history list, with a row that opens to show the full breakdown. */
export default function HistoryTable({ rows, onOpenDesign }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // "Today" is relative to the newest row, keeping the labels stable rather
  // than reading the clock during render.
  const newest = rows.reduce(
    (latest, row) => (row.sentAt > latest ? row.sentAt : latest),
    rows[0]?.sentAt ?? new Date(0),
  );

  return (
    <div className="overflow-x-auto">
      <div role="table" aria-label="Notification history" className="min-w-[1020px]">
        <div
          role="row"
          className={`${COLUMNS} px-4 py-2.5 border-b border-(--color-border-default)`}
        >
          <span role="columnheader" className={HEAD}>
            Notification
          </span>
          <span role="columnheader" className={HEAD}>
            Template
          </span>
          <span role="columnheader" className={HEAD}>
            Audience
          </span>
          <span role="columnheader" className={HEAD}>
            Status
          </span>
          <span role="columnheader" className={HEAD}>
            Time
          </span>
          <span role="columnheader" className={HEAD}>
            Performance
          </span>
          <span role="columnheader" className={HEAD} />
        </div>

        {rows.map((row) => {
          const expanded = expandedId === row.id;
          return (
            <div
              key={row.id}
              className="border-b border-(--color-border-default) last:border-b-0"
            >
              <div
                role="row"
                className={`${COLUMNS} px-4 py-3 transition-colors ${
                  expanded ? "bg-(--color-bg-page)" : ""
                }`}
              >
                <span role="cell" className="flex items-center gap-3 min-w-0">
                  <span className="w-14 shrink-0 rounded-lg overflow-hidden border border-(--color-border-default)">
                    {row.design ? (
                      <DesignPreview design={row.design.designJson} />
                    ) : (
                      <span className="flex aspect-2/1 items-center justify-center bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                        <CampaignOutlinedIcon sx={{ fontSize: 14 }} />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold text-(--color-text-primary) truncate">
                      {row.title}
                    </span>
                    <span className="block text-[11px] text-(--color-text-hint) truncate">
                      {row.body}
                    </span>
                  </span>
                </span>

                <span role="cell" className="min-w-0">
                  <span className="inline-flex max-w-full h-6 px-2.5 rounded-full bg-(--color-brand-primary-light) text-[10.5px] font-semibold text-(--color-brand-primary) items-center truncate">
                    {row.template}
                  </span>
                </span>

                <span role="cell" className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-(--color-text-primary) tabular-nums">
                    {row.audience.toLocaleString()}
                  </span>
                  <span className="block text-[10.5px] text-(--color-text-hint) truncate">
                    {row.audienceLabel}
                  </span>
                </span>

                <span role="cell">
                  <span
                    className={`inline-flex h-6 px-2.5 rounded-full text-[10.5px] font-semibold items-center ${STATUS_STYLE[row.status]}`}
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </span>

                <span role="cell" className="min-w-0">
                  <span className="block text-[12px] text-(--color-text-primary) truncate">
                    {dayLabel(row.sentAt, newest)}
                  </span>
                  <span className="block text-[10.5px] text-(--color-text-hint)">
                    {TIME.format(row.sentAt)}
                  </span>
                </span>

                <span role="cell">
                  {row.status === "FAILED" ? (
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : row.id)}
                      className="flex items-center gap-1 text-[11.5px] font-semibold text-(--color-danger) hover:underline cursor-pointer"
                    >
                      <ErrorOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                      View error
                    </button>
                  ) : (
                    <span className="flex items-center gap-5">
                      <Metric
                        icon={MarkEmailReadOutlinedIcon}
                        value={row.delivered}
                        percent={rate(row.delivered, row.audience)}
                      />
                      <Metric
                        icon={VisibilityOutlinedIcon}
                        value={row.opened}
                        percent={rate(row.opened, row.delivered)}
                      />
                      <Metric
                        icon={AdsClickOutlinedIcon}
                        value={row.clicked}
                        percent={rate(row.clicked, row.delivered)}
                      />
                    </span>
                  )}
                </span>

                <span role="cell">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    title={expanded ? "Hide details" : "Show details"}
                    onClick={() => setExpandedId(expanded ? null : row.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
                  >
                    <ExpandMoreOutlinedIcon
                      sx={{ fontSize: 18 }}
                      className={`transition-transform duration-200 ${
                        expanded ? "rotate-180" : "-rotate-90"
                      }`}
                    />
                  </button>
                </span>
              </div>

              {expanded && (
                <div className="bg-(--color-bg-page) px-4 pb-4 pt-1">
                  {row.error ? (
                    <p className="flex items-start gap-2 rounded-xl bg-(--color-danger-bg) px-3.5 py-3 text-[12px] leading-relaxed text-(--color-danger)">
                      <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: 15 }}
                        className="mt-0.5 shrink-0"
                      />
                      {row.error}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Audience", value: row.audience.toLocaleString() },
                        {
                          label: "Delivered",
                          value: `${row.delivered.toLocaleString()} · ${rate(row.delivered, row.audience)}%`,
                        },
                        {
                          label: "Opened",
                          value: `${row.opened.toLocaleString()} · ${rate(row.opened, row.delivered)}%`,
                        },
                        {
                          label: "Clicked",
                          value: `${row.clicked.toLocaleString()} · ${rate(row.clicked, row.delivered)}%`,
                        },
                      ].map((cell) => (
                        <span
                          key={cell.label}
                          className="rounded-xl bg-(--color-bg-surface) px-3 py-2.5"
                        >
                          <span className="block text-[10.5px] text-(--color-text-hint)">
                            {cell.label}
                          </span>
                          <span className="block mt-0.5 text-[13px] font-semibold text-(--color-text-primary) tabular-nums">
                            {cell.value}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-[11px] text-(--color-text-hint)">
                      Sent {DAY.format(row.sentAt)} at {TIME.format(row.sentAt)} ·{" "}
                      {row.audienceLabel}
                    </span>
                    {row.design && (
                      <button
                        type="button"
                        onClick={() => onOpenDesign(row)}
                        className="ml-auto flex items-center gap-1.5 h-8 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) text-[11.5px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
                      >
                        <OpenInNewOutlinedIcon sx={{ fontSize: 14 }} />
                        Open in Studio
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
