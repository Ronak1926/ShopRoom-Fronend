import type { Metadata } from "next";
import PublicPage from "@/components/public/PublicPage";
import ContactForm from "./_components/ContactForm";
import ContactDetails from "./_components/ContactDetails";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Send the CounterCircle team a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PublicPage>
      <section className="bg-(--color-brand-primary-light)">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-[32px] font-extrabold tracking-[-0.8px] text-(--color-text-primary) sm:text-[40px]">Contact us</h1>
          <p className="mt-3 max-w-xl text-[16px] text-(--color-text-secondary)">
            Questions, feedback, or something not working? Tell us and we&apos;ll reply by email.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-8">
        <div className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 shadow-(--shadow-xs) sm:p-8">
          <h2 className="mb-5 text-[18px] font-bold text-(--color-text-primary)">Send us a message</h2>
          <ContactForm />
        </div>
        <ContactDetails />
      </div>
    </PublicPage>
  );
}
