import type { Metadata } from "next";
import UnsubscribeCard from "./_components/UnsubscribeCard";

export const metadata: Metadata = {
  title: "Unsubscribe",
  // Reached from a personal email link; nothing here belongs in search results.
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return <UnsubscribeCard />;
}
