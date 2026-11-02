import type { Metadata } from "next";
import PublicPage from "@/components/public/PublicPage";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Send the ShopRoom team a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PublicPage>
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-[32px] font-extrabold tracking-[-0.8px] text-(--color-text-primary) sm:text-[40px]">Contact us</h1>
        <p className="mt-3 text-[16px] text-(--color-text-secondary)">
          Questions, feedback, or something not working? Tell us and we&apos;ll reply by email.
        </p>
        <div className="mt-8 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </PublicPage>
  );
}
