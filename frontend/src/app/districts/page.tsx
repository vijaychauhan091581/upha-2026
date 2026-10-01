import AffiliatedDistrictsHero from "./AffiliatedDistrictsHero";
import DirectoryView from "./DirectoryView";
import AffiliationCTA from "./AffiliationCTA";

export default function AffiliatedDistrictsPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pb-16">
      <AffiliatedDistrictsHero />
      
      <div className="max-w-7xl mx-auto px-6">
        <DirectoryView />
        
        {/* CTA */}
        <AffiliationCTA />
      </div>
    </main>
  );
}
