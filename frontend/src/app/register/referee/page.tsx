import RefereeAccreditationHero from "./RefereeAccreditationHero";
import RefereeAccreditationSidebar from "./RefereeAccreditationSidebar";
import RefereeAccreditationForm from "./RefereeAccreditationForm";

export default function RefereeAccreditationPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9]">
      <RefereeAccreditationHero />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Main Form Column */}
        <div className="w-full lg:w-2/3">
          <RefereeAccreditationForm />
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/3 relative">
          <div className="space-y-6">
            <RefereeAccreditationSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
