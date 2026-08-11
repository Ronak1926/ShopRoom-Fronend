"use client";

import { useRef } from "react";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { getCategoryIcon } from "../_utils/categoryIcon";

type CategoryPillsBarProps = {
  categories: string[];
  activeChip: string;
  onChipChange: (chip: string) => void;
};

export default function CategoryPillsBar({
  categories,
  activeChip,
  onChipChange,
}: CategoryPillsBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          onClick={() => onChipChange("All")}
          className={`h-9 px-4 flex items-center gap-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
            activeChip === "All"
              ? "bg-(--color-brand-primary) border-transparent text-white"
              : "bg-(--color-bg-page) border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
          }`}
        >
          {getCategoryIcon("all")}
          All Categories
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChipChange(category)}
            className={`h-9 px-4 flex items-center gap-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
              activeChip === category
                ? "bg-(--color-brand-primary) border-transparent text-white"
                : "bg-(--color-bg-page) border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
            }`}
          >
            {getCategoryIcon(category)}
            {category}
          </button>
        ))}
      </div>

      <button
        onClick={scrollNext}
        aria-label="Show more categories"
        className="w-8 h-8 flex items-center justify-center rounded-full border border-(--color-border-default) text-(--color-text-secondary) bg-(--color-bg-page) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer shrink-0"
      >
        <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
}
