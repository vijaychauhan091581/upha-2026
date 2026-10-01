"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AcademyData, getMyAcademyPlayers } from "@/lib/api";

export default function AcademyRecord() {
  const { meData, loading } = useAuth();
  const academy = meData as AcademyData | null;
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await getMyAcademyPlayers();
        if (res.success && res.players) {
          setPlayerCount(res.players.length);
        }
      } catch {
        // silently fall back to no_of_players from model
      }
    }
    fetchCount();
  }, []);

  if (loading) {
    return <div className="bg-[#111827] rounded-sm p-10 mb-6 animate-pulse h-48"></div>;
  }

  const displayedPlayers = playerCount !== null ? playerCount : (academy?.no_of_players ?? 0);

  return (
    <div className="bg-[#111827] rounded-sm p-8 md:p-10 mb-6 shadow-md relative overflow-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 border-b border-gray-800 pb-4">
        <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wider">
          ACADEMY RECORD
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          ACADEMY &middot; <span className="text-[#d97c55]">ESTABLISHED {academy?.year_of_establishment || "N/A"}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-800 relative z-10">

        {/* Stat 1 – Registered Players */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-6xl md:text-7xl font-bold text-[#d97c55] mb-2 tracking-tight truncate w-full px-2">
            {displayedPlayers}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">REGISTERED PLAYERS</div>
          <div className="text-[10px] text-gray-500 uppercase">ACTIVE ROSTER</div>
        </div>

        {/* Stat 2 – Coaches */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-6xl md:text-7xl font-bold text-[#d97c55] mb-2 tracking-tight truncate w-full px-2">
            {academy?.coaches_employed ?? (academy?.coach_name ? 1 : 0)}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">COACHES REGISTERED</div>
          <div className="text-[10px] text-gray-500 uppercase">ACTIVE STAFF</div>
        </div>

        {/* Stat 3 – District */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-3xl md:text-4xl font-bold text-[#d97c55] mb-2 tracking-tight uppercase truncate w-full px-2">
            {academy?.district || "N/A"}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">DISTRICT</div>
          <div className="text-[10px] text-gray-500 uppercase">AFFILIATION</div>
        </div>

        {/* Stat 4 – Year Established */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-5xl md:text-6xl font-bold text-[#d97c55] mb-2 tracking-tight truncate w-full px-2">
            {academy?.year_of_establishment || "N/A"}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">YEAR ESTABLISHED</div>
          <div className="text-[10px] text-gray-500 uppercase">FOUNDATION</div>
        </div>

      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
}
