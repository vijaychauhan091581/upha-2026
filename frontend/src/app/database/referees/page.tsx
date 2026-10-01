import RegisteredRefereesHero from "./RegisteredRefereesHero";
import RefereeBoardSection from "./RefereeBoardSection";
import RefereePanelGrid from "./RefereePanelGrid";
import RefereeCTA from "./RefereeCTA";

export default function RegisteredRefereesPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pb-16">
      <RegisteredRefereesHero />
      
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <RefereeBoardSection />
        <RefereePanelGrid />
        <RefereeCTA />
      </div>
    </main>
  );
}
