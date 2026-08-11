import type { Metadata } from "next";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import TrustedCarousel from "./_components/TrustedCarousel";
import Features from "./_components/Features";
import Industries from "./_components/Industries";
import WhyShopRoom from "./_components/WhyShopRoom";
import HowItWorks from "./_components/HowItWorks";
import NotificationShowcase from "./_components/NotificationShowcase";
import CommunitySection from "./_components/CommunitySection";
import Testimonials from "./_components/Testimonials";
import Pricing from "./_components/Pricing";
import FAQ from "./_components/FAQ";
import FinalCTA from "./_components/FinalCTA";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "ShopRoom — Bring Your Shop Closer to Your Customers",
  description:
    "Create your own room, invite customers, share updates, and grow your business together on ShopRoom — the platform built for local shopkeepers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-(--color-bg-page)">
      <Navbar />
      <main>
        <Hero />
        <TrustedCarousel />
        <Features />
        <Industries />
        <WhyShopRoom />
        <HowItWorks />
        <NotificationShowcase />
        <CommunitySection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
