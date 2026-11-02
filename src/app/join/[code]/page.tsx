import type { Metadata } from "next";
import JoinInvite from "./_components/JoinInvite";

export const metadata: Metadata = {
  title: "Join a shop's room",
  // Invite links are for the people they were shared with, not for search results.
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: PageProps) {
  const { code } = await params;
  return <JoinInvite code={code} />;
}
