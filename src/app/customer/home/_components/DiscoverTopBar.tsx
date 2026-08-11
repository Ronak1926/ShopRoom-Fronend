"use client";

import { useEffect, useRef, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import Avatar from "@/components/ui/Avatar";

type DiscoverTopBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeChip: string;
  onChipChange: (chip: string) => void;
  filterChips: string[];
  customerName: string;
  onProfileClick: () => void;
};

export default function DiscoverTopBar({
  searchQuery,
  onSearchChange,
  activeChip,
  onChipChange,
  filterChips,
  customerName,
  onProfileClick,
}: DiscoverTopBarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-(--color-bg-surface) border-b border-(--color-border-default) px-5 flex items-center gap-3 shrink-0">
      {/* Search pill */}
      <div className="flex items-center h-10 rounded-xl bg-(--color-bg-page) border border-(--color-border-default) px-3 gap-2 flex-1 max-w-xl transition-colors focus-within:border-(--color-brand-primary)">
        <SearchOutlinedIcon
          sx={{ fontSize: 18, color: "var(--color-text-hint)", flexShrink: 0 }}
        />
        <input
          type="text"
          placeholder="Search rooms, shops or categories..."
          className="flex-1 bg-transparent outline-none text-sm text-(--color-text-primary) placeholder:text-(--color-text-hint) min-w-0"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-[11px] text-(--color-text-hint) cursor-pointer border-0 bg-transparent px-1"
          >
            <ClearIcon sx={{ fontSize: 16 }} />
          </button>
        )}
        <div className="w-px h-5 bg-(--color-border-default) shrink-0" />
        <LocationOnOutlinedIcon
          sx={{ fontSize: 14, color: "var(--color-brand-primary)", flexShrink: 0 }}
        />
        <span className="text-xs font-medium text-(--color-brand-primary) whitespace-nowrap shrink-0">
          Near You
        </span>
      </div>

      {/* Filter btn + dropdown */}
      <div className="relative" ref={filterRef}>
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className={`h-10 px-3 rounded-xl bg-(--color-bg-page) border flex items-center gap-1.5 text-[13px] font-medium cursor-pointer transition-colors ${
            activeChip !== "All"
              ? "border-(--color-brand-primary) text-(--color-brand-primary) bg-(--color-brand-primary-light)"
              : "border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
          }`}
        >
          <TuneOutlinedIcon sx={{ fontSize: 16 }} />
          {activeChip !== "All" ? activeChip : "Filter"}
          <KeyboardArrowDownOutlinedIcon
            sx={{
              fontSize: 16,
              transition: "transform 0.2s",
              transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {filterOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-(--color-bg-surface) border border-(--color-border-default) rounded-2xl shadow-(--shadow-lg) p-3 min-w-52">
            <p className="text-[11px] font-semibold text-(--color-text-hint) uppercase tracking-wider mb-2 px-1">
              Category
            </p>
            <div className="flex flex-col gap-1">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    onChipChange(chip);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                    activeChip === chip
                      ? "bg-(--color-brand-primary) text-white"
                      : "text-(--color-text-primary) hover:bg-(--color-bg-page)"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-2">
        <button className="relative w-9 h-9 flex items-center justify-center cursor-pointer border-0 bg-transparent rounded-full hover:bg-(--color-bg-page) transition-colors">
          <NotificationsNoneOutlinedIcon
            sx={{ fontSize: 22, color: "var(--color-text-secondary)" }}
          />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-(--color-danger-dot) ring-2 ring-(--color-bg-surface)" />
        </button>

        <button
          type="button"
          title="Profile"
          onClick={onProfileClick}
          className="border-0 bg-transparent p-0 cursor-pointer rounded-full hover:opacity-80 transition-opacity"
        >
          <Avatar name={customerName} size="md" />
        </button>
      </div>
    </div>
  );
}
