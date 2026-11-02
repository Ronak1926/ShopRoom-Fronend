import type { Metadata } from "next";
import Link from "next/link";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import PublicPage from "@/components/public/PublicPage";
import { HELP_GROUPS } from "./_content";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common questions for ShopRoom customers and shopkeepers.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <PublicPage>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-[32px] font-extrabold tracking-[-0.8px] text-(--color-text-primary) sm:text-[40px]">Help Center</h1>
        <p className="mt-3 text-[16px] text-(--color-text-secondary)">Quick answers to the things people ask most.</p>

        {HELP_GROUPS.map((group) => (
          <section key={group.title} className="mt-10">
            <h2 className="text-[20px] font-bold text-(--color-text-primary)">{group.title}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {group.items.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) open:shadow-(--shadow-xs)">
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

        <section className="mt-12 rounded-2xl bg-(--color-brand-primary-light) p-6">
          <h2 className="text-[18px] font-bold text-(--color-text-primary)">Still stuck?</h2>
          <p className="mt-1 text-[14px] text-(--color-text-secondary)">Send us a message and we&apos;ll get back to you by email.</p>
          <Link href="/contact" className="mt-4 inline-flex h-11 items-center rounded-lg bg-(--color-brand-primary) px-5 text-[14px] font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover)">
            Contact us
          </Link>
        </section>
      </div>
    </PublicPage>
  );
}
