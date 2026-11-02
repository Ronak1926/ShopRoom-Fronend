import type { Metadata } from "next";
import MembersView from "./_components/MembersView";

export const metadata: Metadata = { title: "Members" };

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const initialQuery = (q ?? "").slice(0, 100);
  // Keyed by the search so the top bar's search box can re-run it from this same page.
  return <MembersView key={initialQuery} initialQuery={initialQuery} />;
}
