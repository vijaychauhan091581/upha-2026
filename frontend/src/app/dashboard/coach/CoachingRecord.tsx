"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CoachData } from "@/lib/api";

export default function CoachingRecord() {
  const { meData, loading } = useAuth();
  const coach = meData as CoachData | null;

  if (loading) {
    return <div className="bg-[#111827] rounded-sm p-10 mb-6 animate-pulse h-48"></div>;
  }

  return (
    <div className="bg-[#111827] rounded-sm p-8 md:p-10 mb-6 shadow-md relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 border-b border-gray-800 pb-4">
        <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wider">
          COACHING RECORD
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          CAREER &middot; AS <span className="text-gray-400">COACH</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-800 relative z-10">
        
        {/* Stat 1 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-4xl md:text-5xl font-bold text-[#d97c55] mb-2 tracking-tight uppercase">
            {coach?.highest_coaching_grade || "N/A"}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">HIGHEST GRADE</div>
          <div className="text-[10px] text-gray-500 uppercase">CERTIFICATION LEVEL</div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-4xl md:text-5xl font-bold text-[#d97c55] mb-2 tracking-tight uppercase">
            {coach?.district || "N/A"}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">REGISTERED DISTRICT</div>
          <div className="text-[10px] text-gray-500 uppercase">UPHA AFFILIATION</div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-3xl md:text-4xl font-bold text-[#d97c55] mb-2 tracking-tight uppercase">
            {coach?.occupation ? coach.occupation.replace("_", " ") : "N/A"}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">OCCUPATION</div>
          <div className="text-[10px] text-gray-500 uppercase">PROFESSIONAL STATUS</div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-4xl md:text-5xl font-bold text-[#d97c55] mb-2 tracking-tight uppercase">
            {coach?.paid ? "YES" : "NO"}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">PAYMENT STATUS</div>
          <div className="text-[10px] text-gray-500 uppercase">REGISTRATION COMPLETED</div>
        </div>

      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
}
