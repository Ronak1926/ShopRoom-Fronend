import Link from "next/link";
import PublicPage from "./PublicPage";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalContent {
  title: string;
  /** e.g. "2 November 2026" */
  updated: string;
  intro: string;
  sections: LegalSection[];
}

/** A long-form page: a title, when it was last changed, and numbered sections. */
export default function LegalDocument({ content }: { content: LegalContent }) {
  return (
    <PublicPage>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-[32px] font-extrabold tracking-[-0.8px] text-(--color-text-primary) sm:text-[40px]">{content.title}</h1>
        <p className="mt-2 text-[13px] text-(--color-text-hint)">Last updated {content.updated}</p>
        <p className="mt-6 text-[16px] leading-relaxed text-(--color-text-secondary)">{content.intro}</p>

        <nav aria-label="On this page" className="mt-8 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
          <p className="text-[12px] font-semibold tracking-wide text-(--color-text-hint) uppercase">On this page</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-[14px] sm:grid-cols-2">
            {content.sections.map((section, i) => (
              <li key={section.heading}>
                <a href={`#section-${i + 1}`} className="text-(--color-text-link) hover:underline">
                  {i + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 flex flex-col gap-10">
          {content.sections.map((section, i) => (
            <section key={section.heading} id={`section-${i + 1}`} className="scroll-mt-24">
              <h2 className="text-[20px] font-bold text-(--color-text-primary)">
                {i + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="mt-3 text-[15px] leading-relaxed text-(--color-text-secondary)">
                  {text}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-(--color-text-secondary)">
                  {section.bullets.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-(--color-border-default) pt-6 text-[14px] text-(--color-text-secondary)">
          Questions about this page? <Link href="/contact" className="font-semibold text-(--color-text-link) hover:underline">Contact us</Link>.
        </p>
      </article>
    </PublicPage>
  );
}
