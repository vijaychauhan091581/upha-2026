"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Award, Medal } from "lucide-react";
import { listAchievements, NationalMedalData } from "@/lib/api";

export default function AchievementsSection() {
  const [medals, setMedals] = useState<NationalMedalData[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [featured, setFeatured] = useState<NationalMedalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listAchievements();
        if (res.success) {
          if (res.medals) setMedals(res.medals);
          if (res.players) setPlayers(res.players);
          if (res.coaches) setCoaches(res.coaches);
          if (res.awards) setAwards(res.awards);
          
          const goldMedals = (res.medals || []).filter(m => m.medal_type === 'GOLD');
          if (goldMedals.length > 0) {
            setFeatured(goldMedals[0]);
          } else if (res.medals && res.medals.length > 0) {
            setFeatured(res.medals[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const goldCount = medals.filter(m => m.medal_type === 'GOLD').length;
  const silverCount = medals.filter(m => m.medal_type === 'SILVER').length;
  const bronzeCount = medals.filter(m => m.medal_type === 'BRONZE').length;

  return (
    <section id="achievements" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <div className="text-accent text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-accent inline-block"></span> HONOUR ROLL
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900">
            ACHIEVEMENTS & <span className="text-accent">MEDAL TALLY</span>
          </h2>
          <p className="text-gray-600 max-w-xl mt-4 text-base sm:text-lg leading-relaxed">
            A legacy built one match at a time. UPHA athletes have brought honours to Uttar Pradesh on every stage — from district leagues to international podiums.
          </p>
        </div>
        <Link 
          href="/achievements" 
          className="group inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest border-b-2 border-primary pb-1.5 hover:text-accent hover:border-accent transition-colors whitespace-nowrap"
        >
          <span>ALL ACHIEVEMENTS</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side: Medal Tally */}
          <div className="bg-[#111927] p-8 sm:p-10 rounded-2xl text-white relative border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Top Metallic Border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
              <div className="flex-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
              <div className="flex-1 bg-gradient-to-r from-amber-700 to-amber-800"></div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-10 pt-2">
                <div>
                  <div className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
                    NATIONAL CHAMPIONSHIP
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide">
                    UTTAR PRADESH TALLY
                  </h3>
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-accent bg-white/5 px-4 py-1.5 rounded-lg border border-white/10">
                  ALL
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                {/* Gold */}
                <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-xl flex flex-col items-center hover:border-amber-400/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center font-black text-[#111927] mb-3 text-xl shadow-lg shadow-amber-500/20">
                    G
                  </div>
                  <div className="font-heading text-4xl sm:text-5xl font-black mb-1 text-white">
                    {goldCount < 10 && goldCount > 0 ? `0${goldCount}` : goldCount}
                  </div>
                  <div className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">
                    GOLD
                  </div>
                </div>

                {/* Silver */}
                <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-xl flex flex-col items-center hover:border-gray-300/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center font-black text-[#111927] mb-3 text-xl shadow-lg shadow-gray-300/20">
                    S
                  </div>
                  <div className="font-heading text-4xl sm:text-5xl font-black mb-1 text-white">
                    {silverCount < 10 && silverCount > 0 ? `0${silverCount}` : silverCount}
                  </div>
                  <div className="text-[10px] tracking-widest text-gray-300 font-bold uppercase">
                    SILVER
                  </div>
                </div>

                {/* Bronze */}
                <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-xl flex flex-col items-center hover:border-amber-700/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-white mb-3 text-xl shadow-lg shadow-amber-800/20">
                    B
                  </div>
                  <div className="font-heading text-4xl sm:text-5xl font-black mb-1 text-white">
                    {bronzeCount < 10 && bronzeCount > 0 ? `0${bronzeCount}` : bronzeCount}
                  </div>
                  <div className="text-[10px] tracking-widest text-amber-600 font-bold uppercase">
                    BRONZE
                  </div>
                </div>
              </div>
            </div>

            {featured && (
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-accent shrink-0" />
                <div className="text-xs text-gray-300">
                  <strong className="text-white">{featured.title}</strong> — {featured.description || "State Performance Milestone"}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Roll of Honour Showcase */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
                    ROLL OF HONOUR
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-gray-900">
                    EXCELLENCE IN HANDBALL
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Award className="w-6 h-6 stroke-[2]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">State Championships & Qualifiers</div>
                    <div className="text-xs text-gray-500">Official tournament records across all categories</div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-accent uppercase">ACTIVE</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Federation & Special Citations</div>
                    <div className="text-xs text-gray-500">Honouring coaches, referees and grassroots champions</div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-accent uppercase">RECOGNISED</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">National Athlete Pipeline</div>
                    <div className="text-xs text-gray-500">UP representatives in Indian national squads</div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-accent uppercase">INDIA ROSTER</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Updated for Current Session 2025–26</span>
              <Link 
                href="/achievements" 
                className="text-xs font-bold uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
              >
                VIEW FULL ARCHIVE &rarr;
              </Link>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
