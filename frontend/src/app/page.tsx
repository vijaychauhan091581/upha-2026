import AnnouncementMarquee from "@/components/AnnouncementMarquee";
import HeroSection from "@/components/HeroSection";
import StatsBanner from "@/components/StatsBanner";
import AboutSection from "@/components/AboutSection";
import MandateSection from "@/components/MandateSection";
import EventsSection from "@/components/EventsSection";
import RegistrationCards from "@/components/RegistrationCards";
import AchievementsSection from "@/components/AchievementsSection";
import LeadershipSection from "@/components/LeadershipSection";
import SocialFeedsSection from "@/components/SocialFeedsSection";
import CTABanner from "@/components/CTABanner";

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground flex flex-col min-w-0 overflow-hidden">

      <AnnouncementMarquee />
      <HeroSection />
      <StatsBanner />
      <AboutSection />
      <MandateSection />
      <EventsSection />
      <RegistrationCards />
      <AchievementsSection />
      <LeadershipSection />
      <SocialFeedsSection />
      <CTABanner />

    </main>
  );
}

