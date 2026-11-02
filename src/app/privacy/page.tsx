import type { Metadata } from "next";
import LegalDocument from "@/components/public/LegalDocument";
import { PRIVACY } from "./_content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What ShopRoom collects, why, who can see it, and how you stay in control of it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalDocument content={PRIVACY} />;
}
