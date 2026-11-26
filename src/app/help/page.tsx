import type { Metadata } from "next";
import Link from "next/link";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PublicPage from "@/components/public/PublicPage";
import JsonLd from "@/components/seo/JsonLd";
import { faqData } from "@/components/seo/structuredData";
import HelpCenter from "./_components/HelpCenter";
import { HELP_GROUPS } from "./_content";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common questions for CounterCircle customers and shopkeepers.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <PublicPage>
      <JsonLd data={faqData(HELP_GROUPS.flatMap((group) => group.items))} />
      <HelpCenter groups={HELP_GROUPS} />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <section className="flex flex-col items-start gap-4 rounded-2xl bg-(--color-brand-primary-light) p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-surface) text-(--color-brand-primary)">
              <MailOutlineOutlinedIcon fontSize="small" />
            </span>
            <div>
              <h2 className="text-[18px] font-bold text-(--color-text-primary)">Still stuck?</h2>
              <p className="mt-1 text-[14px] text-(--color-text-secondary)">Send us a message and we&apos;ll get back to you by email.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-(--color-brand-primary) px-5 text-[14px] font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover)"
          >
            Contact us
          </Link>
        </section>
      </div>
    </PublicPage>
  );
}
