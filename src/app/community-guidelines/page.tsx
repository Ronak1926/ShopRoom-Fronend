import type { Metadata } from "next";
import LegalDocument from "@/components/public/LegalDocument";
import { COMMUNITY_GUIDELINES } from "./_content";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "What is and is not acceptable in ShopRoom rooms and notifications.",
  alternates: { canonical: "/community-guidelines" },
};

export default function CommunityGuidelinesPage() {
  return <LegalDocument content={COMMUNITY_GUIDELINES} />;
}
