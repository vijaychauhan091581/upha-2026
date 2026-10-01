import DistrictAffiliationHero from "./DistrictAffiliationHero";
import DistrictAffiliationSidebar from "./DistrictAffiliationSidebar";
import DistrictAffiliationForm from "./DistrictAffiliationForm";

export default function DistrictAffiliationPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9]">
      <DistrictAffiliationHero />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Main Form Column */}
        <div className="w-full lg:w-2/3">
          <DistrictAffiliationForm />
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/3 relative">
          <div className="space-y-6">
            <DistrictAffiliationSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
