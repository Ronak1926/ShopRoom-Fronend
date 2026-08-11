"use client";

import { useEffect, useRef, useState } from "react";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import CategoryPillsBar from "./CategoryPillsBar";
import type { SortOption, ViewMode } from "../types";

const SORT_LABELS: Record<SortOption, string> = {
  nearest: "Nearest",
  popular: "Popular",
};

type DiscoverHeaderProps = {
  categories: string[];
  activeChip: string;
  onChipChange: (chip: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

export default function DiscoverHeader({
  categories,
  activeChip,
  onChipChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: DiscoverHeaderProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-(--color-text-primary)">
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 20, color: "var(--color-brand-primary)" }} />
            Discover <span className="text-(--color-brand-primary)">amazing rooms</span> near you
          </h1>
          <p className="text-sm text-(--color-text-secondary) mt-1">
            Join active communities and shop smarter
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="h-9 px-3 rounded-full border border-(--color-border-default) bg-(--color-bg-page) flex items-center gap-1.5 text-[13px] font-medium text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
            >
              Sort by: {SORT_LABELS[sort]}
              <KeyboardArrowDownOutlinedIcon
                sx={{
                  fontSize: 16,
                  transition: "transform 0.2s",
                  transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {sortOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 z-50 bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl shadow-(--shadow-lg) p-1.5 min-w-36">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                      sort === option
                        ? "bg-(--color-brand-primary) text-white"
                        : "text-(--color-text-primary) hover:bg-(--color-bg-page)"
                    }`}
                  >
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-(--color-border-default) bg-(--color-bg-page) p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                viewMode === "grid"
                  ? "bg-(--color-brand-primary) text-white"
                  : "text-(--color-text-secondary) hover:text-(--color-brand-primary)"
              }`}
            >
              <GridViewOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "bg-(--color-brand-primary) text-white"
                  : "text-(--color-text-secondary) hover:text-(--color-brand-primary)"
              }`}
            >
              <ViewListOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>

      <CategoryPillsBar
        categories={categories}
        activeChip={activeChip}
        onChipChange={onChipChange}
      />
    </div>
  );
}
