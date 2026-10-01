import RegisteredCoachesHero from "./RegisteredCoachesHero";
import CoachPanelGrid from "./CoachPanelGrid";
import CoachCTA from "./CoachCTA";

export default function CoachesDatabasePage() {
  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pb-16">
      <RegisteredCoachesHero />

      <div className="max-w-7xl mx-auto px-6 mt-32">
        <CoachPanelGrid />
        <CoachCTA />
      </div>
    </main>
  );
}
