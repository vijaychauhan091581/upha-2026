"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDistrictStats, DistrictStats } from "@/lib/api";

export default function AffiliatedDistrictsHero() {
  const [stats, setStats] = useState<DistrictStats | null>(null);

  useEffect(() => {
    getDistrictStats()
      .then((res) => { if (res.success) setStats(res); })
      .catch(() => {});
  }, []);

  const total = stats?.total_districts ?? null;
  const affiliated = stats?.affiliated ?? null;
  const open = stats?.open ?? null;

  return (
    <div className="bg-[#111827] text-white pt-12 pb-32 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <span className="hover:text-white transition-colors cursor-pointer">MEMBERS UNIT</span>
          <span>/</span>
          <span className="text-white">AFFILIATED DISTRICTS</span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-6xl md:text-7xl font-bold uppercase tracking-wide mb-6">
          AFFILIATED <span className="text-accent">DISTRICT UNITS</span>
        </h1>

        {/* Subtext */}
        <p className="font-serif italic text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
          The complete directory of district handball associations affiliated with UPHA &mdash; every president, every secretary, every contact across Uttar Pradesh.
        </p>

      </div>

      {/* Overlapping Stat Cards */}
      <div className="absolute left-0 right-0 -bottom-16 w-full z-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-gray-200 border border-gray-200 shadow-xl shadow-black/5 rounded-sm overflow-hidden">

          <div className="bg-white p-8">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> UP DISTRICTS
            </div>
            <div className="font-heading text-6xl font-bold text-primary mb-2">
              {total ?? <span className="animate-pulse text-gray-300">—</span>}
            </div>
            <div className="text-xs text-gray-500">Total districts in the state of Uttar Pradesh</div>
          </div>

          <div className="bg-white p-8">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> AFFILIATED
            </div>
            <div className="font-heading text-6xl font-bold text-primary mb-2">
              {affiliated !== null
                ? <>{affiliated}<span className="text-3xl text-gray-300 font-normal">/{total}</span></>
                : <span className="animate-pulse text-gray-300">—</span>}
            </div>
            <div className="text-xs text-gray-500">District units currently affiliated with UPHA</div>
          </div>

          <div className="bg-white p-8">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> OPEN
            </div>
            <div className="font-heading text-6xl font-bold text-primary mb-2">
              {open ?? <span className="animate-pulse text-gray-300">—</span>}
            </div>
            <div className="text-xs text-gray-500">Districts open for affiliation applications</div>
          </div>

        </div>
      </div>
    </div>
  );
}
