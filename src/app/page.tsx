import type { Metadata } from "next";
import HeroSection from "./_components/HeroSection";

export const metadata: Metadata = {
  title: "ShopRoom — Your Neighbourhood Shop, Delivered to Your Feed",
  description:
    "ShopRoom connects customers to their favourite local shops with real-time stock updates, personalised alerts, and hyper-local discovery. Zero algorithms, just your street.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};
import MissionSection from "./_components/MissionSection";
import FeaturesSection from "./_components/FeaturesSection";
import StatsSection from "./_components/StatsSection";
import HowItWorksSection from "./_components/HowItWorksSection";
import CtaBanner from "./_components/CtaBanner";
import LandingFooter from "./_components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-(--color-landing-hero-bg)">
      <main>
        {/* HeroSection now includes LandingNav inside the shared particle canvas */}
        <HeroSection />
        <MissionSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
