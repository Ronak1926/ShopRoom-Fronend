import type { Metadata } from "next";
import LegalDocument from "@/components/public/LegalDocument";
import { SECURITY } from "./_content";

export const metadata: Metadata = {
  title: "Security",
  description: "How ShopRoom protects accounts, conversations and payments.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return <LegalDocument content={SECURITY} />;
}
