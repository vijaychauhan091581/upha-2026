import AcademyAffiliationHero from "./AcademyAffiliationHero";
import AcademyAffiliationSidebar from "./AcademyAffiliationSidebar";
import AcademyAffiliationForm from "./AcademyAffiliationForm";

export default function AcademyAffiliationPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9]">
      <AcademyAffiliationHero />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Main Form Column */}
        <div className="w-full lg:w-2/3">
          <AcademyAffiliationForm />
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/3 relative">
          <div className="space-y-6">
            <AcademyAffiliationSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
