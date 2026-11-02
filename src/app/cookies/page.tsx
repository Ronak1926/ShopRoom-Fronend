import type { Metadata } from "next";
import LegalDocument from "@/components/public/LegalDocument";
import { COOKIES } from "./_content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies and browser storage ShopRoom uses, and why.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return <LegalDocument content={COOKIES} />;
}
