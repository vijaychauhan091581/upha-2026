import DatabaseCards from "@/components/DatabaseCards";
import DatabaseStatsBar from "@/components/DatabaseStatsBar";

export default function DatabaseSelectionPage() {
  return (
    <div className="flex-1 bg-background text-foreground flex flex-col py-12">
      <div className="text-center mb-12 mt-12 px-6">
        <h1 className="text-5xl font-heading font-bold uppercase tracking-widest text-primary">Databases</h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Select a category to view the respective official database of Uttar Pradesh Handball Association.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 w-full mb-8">
        <DatabaseStatsBar />
      </div>

      <DatabaseCards />
    </div>
  );
}
