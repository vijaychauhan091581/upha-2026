"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listEventResults, EventResultData, PlayerData } from "@/lib/api";

export default function TournamentRecord() {
  const { meData, loading } = useAuth();
  const player = meData as PlayerData | null;
  const [results, setResults] = useState<EventResultData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (loading || !player) return;
      try {
        const res = await listEventResults();
        if (res.success) {
          const myResults = res.results.filter(r => r.player.id === player.id);
          setResults(myResults);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResults();
  }, [player, loading]);

  const tournamentsPlayed = results.length;
  
  // Assuming medals are positions 1, 2, and 3
  const gold = results.filter(r => r.position === 1).length;
  const silver = results.filter(r => r.position === 2).length;
  const bronze = results.filter(r => r.position === 3).length;
  const medalsWon = gold + silver + bronze;

  return (
    <div className="bg-[#111827] rounded-sm p-8 md:p-10 mb-6 shadow-md relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 border-b border-gray-800 pb-4">
        <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wider">
          TOURNAMENT RECORD
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          CAREER &middot; AS <span className="text-accent">PLAYER</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-800 relative z-10">
        
        {/* Stat 1 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-6xl md:text-7xl font-bold text-accent mb-2 tracking-tight">
            {isLoading ? "..." : String(tournamentsPlayed).padStart(2, '0')}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">TOURNAMENTS PLAYED</div>
          <div className="text-[10px] text-gray-500">recorded events</div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-6xl md:text-7xl font-bold text-accent mb-2 tracking-tight">—</div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">MATCHES PLAYED</div>
          <div className="text-[10px] text-gray-500">not tracked</div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-6xl md:text-7xl font-bold text-accent mb-2 tracking-tight">—</div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">GOALS SCORED</div>
          <div className="text-[10px] text-gray-500">not tracked</div>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col items-center justify-center text-center py-4 lg:py-0">
          <div className="font-heading text-6xl md:text-7xl font-bold text-accent mb-2 tracking-tight">
            {isLoading ? "..." : String(medalsWon).padStart(2, '0')}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">MEDALS WON</div>
          <div className="text-[10px] text-gray-500">{gold}G &middot; {silver}S &middot; {bronze}B</div>
        </div>

      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
}
