import type { ReactNode } from "react";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

/** The landing page's header and footer around a content page (legal, help, contact…). */
export default function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg-page)">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
