import type { Metadata } from "next";
import LegalDocument from "@/components/public/LegalDocument";
import { REFUND_POLICY } from "./_content";

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy",
  description: "How ShopRoom plans are paid for, what happens if you stop, and when payments are refunded.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <LegalDocument content={REFUND_POLICY} />;
}
