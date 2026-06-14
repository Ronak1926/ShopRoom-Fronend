import HeroSection from "./_components/HeroSection";
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
