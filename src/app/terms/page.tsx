import type { Metadata } from "next";
import LegalDocument from "@/components/public/LegalDocument";
import { TERMS } from "./_content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The agreement between you and ShopRoom for customers and shopkeepers.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDocument content={TERMS} />;
}
