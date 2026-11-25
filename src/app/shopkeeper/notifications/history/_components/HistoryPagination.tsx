"use client";

import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

const ARROW =
  "w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}

/** "Showing 1 to 8 of 40" with numbered pages (first, last and the neighbours of the current one). */
export default function HistoryPagination({ page, pageSize, total, onPage }: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const numbers = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pageCount || Math.abs(n - page) <= 1,
  );

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 border-t border-(--color-border-default)">
      <p className="text-[11.5px] text-(--color-text-hint)">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
      </p>

      <div className="flex items-center gap-1.5">
        <button type="button" title="Previous page" aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)} className={ARROW}>
          <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />
        </button>

        {numbers.map((n, index) => (
          <span key={n} className="flex items-center gap-1.5">
            {index > 0 && n - numbers[index - 1] > 1 && <span className="text-[11.5px] text-(--color-text-hint)">…</span>}
            <button
              type="button"
              onClick={() => onPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                n === page
                  ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                  : "border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
              }`}
            >
              {n}
            </button>
          </span>
        ))}

        <button type="button" title="Next page" aria-label="Next page" disabled={page === pageCount} onClick={() => onPage(page + 1)} className={ARROW}>
          <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
      </div>
    </footer>
  );
}
