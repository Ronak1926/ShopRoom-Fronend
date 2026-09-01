"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import Dropdown from "@/components/ui/Dropdown";
import {
  SOURCE_TABS,
  type SendableNotification,
  type SourceTab,
} from "@/hooks/useSendableNotifications";

const TYPE_FILTERS = [
  { value: "ALL", label: "All types" },
  { value: "DESIGN", label: "My designs" },
  { value: "TEMPLATE", label: "Templates" },
];

interface Props {
  tab: SourceTab;
  onTabChange: (tab: SourceTab) => void;
  items: SendableNotification[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (item: SendableNotification) => void;
  onRetry: () => void;
  fieldError?: string;
}

/** Step 1 — pick the draft the schedule will send. */
export default function SelectNotificationStep({
  tab,
  onTabChange,
  items,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
  fieldError,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (type !== "ALL" && item.source !== type) return false;
      return !needle || item.name.toLowerCase().includes(needle);
    });
  }, [items, query, type]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Draft source"
        className="flex items-center gap-1 border-b border-(--color-border-default)"
      >
        {SOURCE_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTabChange(id)}
            className={`h-9 px-3 -mb-px border-b-2 text-[12.5px] transition-colors cursor-pointer ${
              tab === id
                ? "border-(--color-brand-primary) text-(--color-brand-primary) font-semibold"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex-1 min-w-56 flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-surface) transition-colors focus-within:border-(--color-brand-primary)">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drafts by name…"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[12.5px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
          />
        </label>
        <Dropdown
          value={type}
          options={TYPE_FILTERS}
          onChange={setType}
          ariaLabel="Filter by source"
          className="w-40"
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-(--color-border-default) overflow-hidden animate-pulse"
              >
                <div className="aspect-2/1 bg-(--color-bg-surface-hover)" />
                <div className="px-3 py-2.5 flex flex-col gap-1.5">
                  <span className="h-3 w-28 rounded bg-(--color-bg-surface-hover)" />
                  <span className="h-2.5 w-20 rounded bg-(--color-bg-surface-hover)" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--color-border-strong) py-10">
            <p className="text-[12.5px] text-(--color-text-secondary)">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-(--color-border-default) text-[12.5px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
            >
              <RefreshOutlinedIcon sx={{ fontSize: 15 }} />
              Try again
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-(--color-border-strong) py-10 px-6 text-center">
            <p className="text-[12.5px] text-(--color-text-secondary)">
              {query.trim()
                ? "No drafts match that search."
                : "Nothing here yet. Designs you save in the Studio show up in this list."}
            </p>
            <button
              type="button"
              onClick={() => router.push("/shopkeeper/notifications/studio")}
              className="h-9 px-4 rounded-lg bg-(--color-brand-primary) text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors cursor-pointer"
            >
              Open Notification Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {visible.map((item) => {
              const selected = selectedId === item.id;
              return (
                <button
                  key={`${item.source}-${item.id}`}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(item)}
                  className={`flex flex-col text-left rounded-2xl border bg-(--color-bg-surface) overflow-hidden transition-colors cursor-pointer ${
                    selected
                      ? "border-(--color-brand-primary) ring-1 ring-(--color-brand-primary)"
                      : "border-(--color-border-default) hover:border-(--color-brand-primary)"
                  }`}
                >
                  <span className="relative block">
                    <DesignPreview design={item.design} />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-(--color-bg-surface) text-[10px] font-semibold text-(--color-text-secondary) shadow-(--shadow-sm)">
                      {item.badge}
                    </span>
                    {selected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-(--color-bg-surface) flex items-center justify-center shadow-(--shadow-sm)">
                        <CheckCircleIcon
                          sx={{ fontSize: 18, color: "var(--color-brand-primary)" }}
                        />
                      </span>
                    )}
                  </span>
                  <span className="px-3 py-2.5">
                    <span className="block text-[12.5px] font-semibold text-(--color-text-primary) truncate">
                      {item.name}
                    </span>
                    <span className="block text-[10.5px] text-(--color-text-hint) mt-0.5 truncate">
                      {item.meta}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11.5px] text-(--color-text-hint)">
          Showing {visible.length} of {items.length} drafts
        </p>
        <button
          type="button"
          onClick={() => router.push("/shopkeeper/notifications/templates")}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
        >
          View all drafts
          <ArrowForwardOutlinedIcon sx={{ fontSize: 15 }} />
        </button>
      </div>

      {fieldError && <p className="mt-3 text-[11.5px] text-(--color-danger)">{fieldError}</p>}
    </div>
  );
}
