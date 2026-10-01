import { User, ClipboardList, ShieldCheck, Building, MapPin } from "lucide-react";
import React from "react";

export default function ApplicationCategoryTabs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      
      {/* Tab 1: Players (Active) */}
      <div className="bg-white border-2 border-accent shadow-sm rounded-sm p-4 relative cursor-pointer group">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-3.5 h-3.5 text-accent" />
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase">PLAYERS</div>
        </div>
        <div className="font-heading text-3xl font-bold text-primary mb-1">28</div>
        <div className="text-[10px] text-gray-500">Pending player registrations</div>
      </div>

      {/* Tab 2: Coaches */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-4 relative cursor-pointer hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
          <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">COACHES</div>
        </div>
        <div className="font-heading text-3xl font-bold text-primary mb-1">8</div>
        <div className="text-[10px] text-gray-500">Pending coach accreditations</div>
      </div>

      {/* Tab 3: Referees */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-4 relative cursor-pointer hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">REFEREES</div>
        </div>
        <div className="font-heading text-3xl font-bold text-primary mb-1">4</div>
        <div className="text-[10px] text-gray-500">Pending referee accreditations</div>
      </div>

      {/* Tab 4: Academies */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-4 relative cursor-pointer hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Building className="w-3.5 h-3.5 text-gray-400" />
          <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">ACADEMIES</div>
        </div>
        <div className="font-heading text-3xl font-bold text-primary mb-1">3</div>
        <div className="text-[10px] text-gray-500">Pending academy affiliations</div>
      </div>

      {/* Tab 5: Districts */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-4 relative cursor-pointer hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">DISTRICTS</div>
        </div>
        <div className="font-heading text-3xl font-bold text-primary mb-1">2</div>
        <div className="text-[10px] text-gray-500">Pending district affiliations</div>
      </div>

    </div>
  );
}
