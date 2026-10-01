"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { listOfficeBearers, OfficeBearerData } from "@/lib/api";

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<OfficeBearerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await listOfficeBearers();
        if (res.success && res.office_bearers) {
          setLeaders(res.office_bearers.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load office bearers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <div className="text-accent text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-accent inline-block"></span> LEADERSHIP
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900">
            OFFICE <span className="text-accent">BEARERS</span>
          </h2>
          <p className="text-gray-600 max-w-xl mt-4 text-base sm:text-lg leading-relaxed">
            Meet the team steering UPHA&apos;s mission across the state — from grassroots outreach to international representation.
          </p>
        </div>
        <Link 
          href="/council" 
          className="group inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest border-b-2 border-primary pb-1.5 hover:text-accent hover:border-accent transition-colors whitespace-nowrap"
        >
          <span>FULL COUNCIL</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {/* Leadership Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        ) : (
          Array.from({ length: Math.max(5, leaders.length) }).map((_, index) => {
            const leader = leaders[index];
            if (leader) {
              return (
                <div 
                  key={leader.id || index} 
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Photo Frame */}
                  <div className="h-64 bg-gray-50 w-full relative flex items-center justify-center p-3 border-b border-gray-100 overflow-hidden">
                    <div className="w-full h-full relative rounded-lg overflow-hidden bg-white">
                      {leader.image ? (
                        <img 
                          src={leader.image} 
                          alt={leader.name} 
                          className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                          <User className="w-10 h-10 stroke-[1.5]" />
                          <span className="text-xs font-semibold">Official Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="text-accent text-[11px] font-bold tracking-widest uppercase mb-1.5 line-clamp-1">
                        {leader.role}
                      </div>
                      <h3 className="font-heading text-lg font-bold uppercase tracking-wide leading-snug text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
                        {leader.name}
                      </h3>
                    </div>
                    
                    <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span>Term</span>
                      <span className="font-semibold text-gray-700">{leader.term || '2023 - 2027'}</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div 
                  key={`empty-${index}`} 
                  className="border border-dashed border-gray-200 rounded-xl bg-gray-50/70 p-6 flex flex-col items-center justify-center text-center opacity-70"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3 text-gray-400">
                    <User className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1">
                    POSITION VACANT
                  </div>
                  <h4 className="font-heading text-sm font-bold uppercase text-gray-400">
                    TO BE APPOINTED
                  </h4>
                </div>
              );
            }
          })
        )}
      </div>
    </section>
  );
}
