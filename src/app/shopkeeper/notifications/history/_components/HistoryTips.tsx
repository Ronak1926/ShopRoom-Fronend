"use client";

import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

const TIPS = [
  "Sends land best in the hour before your shop's busiest time.",
  "A banner with one clear offer beats three competing ones.",
  "Radius sends reach people who never joined — keep those short.",
];

/** Practical notes rather than a link to documentation that does not exist. */
export default function HistoryTips() {
  return (
    <section className="h-full rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex items-center gap-2.5">
        <span className="w-8 h-8 shrink-0 rounded-lg bg-(--color-brand-alert-light) text-(--color-brand-alert) flex items-center justify-center">
          <LightbulbOutlinedIcon sx={{ fontSize: 16 }} />
        </span>
        <h2 className="text-[13.5px] font-bold text-(--color-text-primary)">
          Getting more opens
        </h2>
      </header>

      <ul className="mt-3 flex flex-col gap-2.5">
        {TIPS.map((tip) => (
          <li
            key={tip}
            className="flex gap-2 text-[11.5px] leading-relaxed text-(--color-text-secondary)"
          >
            <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-(--color-brand-primary)" />
            {tip}
          </li>
        ))}
      </ul>
    </section>
  );
}
