import PlayerRegistrationHero from "./PlayerRegistrationHero";
import PlayerRegistrationSidebar from "./PlayerRegistrationSidebar";
import PlayerRegistrationForm from "./PlayerRegistrationForm";

export default function PlayerRegistrationPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9]">
      <PlayerRegistrationHero />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Main Form Column */}
        <div className="w-full lg:w-2/3">
          <PlayerRegistrationForm />
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/3 relative">
          <div className="space-y-6">
            <PlayerRegistrationSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
