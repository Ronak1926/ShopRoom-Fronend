import type { Metadata } from "next";
import Link from "next/link";
import PublicPage from "@/components/public/PublicPage";
import Pricing from "../_components/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ShopRoom is free for customers. Shopkeepers pay once for 1, 2 or 3 months, with no automatic renewal.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <PublicPage>
      <h1 className="sr-only">ShopRoom pricing</h1>
      <Pricing />
      <p className="mx-auto max-w-3xl px-4 pb-16 text-center text-[13px] leading-relaxed text-(--color-text-secondary) sm:px-6">
        Prices are in Indian rupees and are one-time payments for the period shown: plans never renew by themselves. See the{" "}
        <Link href="/refund-policy" className="font-semibold text-(--color-text-link) hover:underline">
          Cancellation and Refund Policy
        </Link>{" "}
        and the{" "}
        <Link href="/terms" className="font-semibold text-(--color-text-link) hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    </PublicPage>
  );
}
