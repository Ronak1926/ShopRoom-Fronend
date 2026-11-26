"use client";

import { useMemo, useState } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import type { ReactNode } from "react";
import type { FaqGroup } from "../_content";

const GROUP_ICONS: Record<string, ReactNode> = {
  customers: <PersonOutlineOutlinedIcon />,
  shopkeepers: <StorefrontOutlinedIcon />,
  billing: <PaymentsOutlinedIcon />,
};

export default function HelpCenter({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: term
            ? group.items.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(term))
            : group.items,
        }))
        .filter((group) => group.items.length > 0),
    [groups, term],
  );
  const matchCount = visible.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <section className="bg-(--color-brand-primary-light)">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="text-[32px] font-extrabold tracking-[-0.8px] text-(--color-text-primary) sm:text-[40px]">How can we help?</h1>
          <p className="mt-3 text-[16px] text-(--color-text-secondary)">Quick answers to the things people ask most.</p>
          <div className="relative mx-auto mt-6 max-w-xl">
            <SearchOutlinedIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-(--color-text-secondary)" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search, for example notifications or plan"
              aria-label="Search the Help Center"
              className="h-13 w-full rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) pr-12 pl-12 text-[15px] text-(--color-text-primary) shadow-(--shadow-xs) outline-none focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary)/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
              >
                <CloseOutlinedIcon fontSize="small" />
              </button>
            )}
          </div>
          {!term && (
            <nav aria-label="Help topics" className="mt-6 flex flex-wrap justify-center gap-2">
              {groups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border-default) bg-(--color-bg-surface) px-4 py-2 text-[13px] font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-brand-primary) hover:text-(--color-brand-primary)"
                >
                  {group.title}
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <p role="status" aria-live="polite" className={term ? "mb-4 text-[13px] text-(--color-text-secondary)" : "sr-only"}>
          {matchCount === 0 ? "No answers found" : `${matchCount} ${matchCount === 1 ? "answer" : "answers"} found`}
        </p>

        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-(--color-border-default) bg-(--color-bg-surface) p-8 text-center">
            <p className="text-[16px] font-bold text-(--color-text-primary)">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
            <p className="mt-1 text-[14px] text-(--color-text-secondary)">Try a shorter word, or send us a message below.</p>
          </div>
        )}

        {visible.map((group) => (
          <section key={group.id} id={group.id} className="mb-10 scroll-mt-24 last:mb-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                {GROUP_ICONS[group.id]}
              </span>
              <div>
                <h2 className="text-[20px] font-bold text-(--color-text-primary)">{group.title}</h2>
                <p className="text-[13px] text-(--color-text-secondary)">{group.description}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {group.items.map((faq) => (
                <details
                  key={`${term}-${faq.question}`}
                  open={!!term}
                  className="group rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) open:shadow-(--shadow-xs)"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-semibold text-(--color-text-primary) [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ExpandMoreOutlinedIcon className="shrink-0 text-(--color-text-secondary) transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 text-[14px] leading-relaxed text-(--color-text-secondary)">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
