"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function DistrictAffiliationHero() {
  const { settings } = useSettings();
  const fee = settings?.district_fee ?? 1100;
  return (
    <div className="bg-[#111827] text-white pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/register" className="hover:text-white transition-colors">REGISTER</Link>
          <span>/</span>
          <span className="text-white">DISTRICT UNIT</span>
        </div>
        
        {/* Title */}
        <h1 className="font-heading text-6xl md:text-7xl font-bold uppercase tracking-wide mb-6">
          DISTRICT UNIT <span className="text-accent">AFFILIATION</span>
        </h1>
        
        {/* Subtext */}
        <p className="font-serif italic text-xl md:text-2xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
          Establish your district as an officially affiliated unit of UPHA. Earn a seat at the federation table, athlete nomination rights, and access to grants and equipment programs.
        </p>
        
        <div className="border-t border-white/10 pt-6"></div>
        
        {/* Meta Data Row */}
        <div className="flex flex-wrap gap-12 mt-6">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">FORM</div>
            <div className="font-bold font-mono text-sm tracking-wider">REF / DST-2026</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ANNUAL FEE</div>
            <div className="font-bold font-mono text-sm tracking-wider">₹ {fee}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ESTIMATED TIME</div>
            <div className="font-bold font-mono text-sm tracking-wider">12 - 15 minutes</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">OFFICE BEARERS</div>
            <div className="font-bold font-mono text-sm tracking-wider">3 required</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
