"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function RefereeAccreditationHero() {
  const { settings } = useSettings();
  const fee = settings?.referee_fee ?? 300;

  return (
    <div className="bg-[#111827] text-white pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/register" className="hover:text-white transition-colors">REGISTER</Link>
          <span>/</span>
          <span className="text-white">REFEREE</span>
        </div>
        
        {/* Title */}
        <h1 className="font-heading text-6xl md:text-7xl font-bold uppercase tracking-wide mb-6">
          REFEREE <span className="text-accent">ACCREDITATION</span>
        </h1>
        
        {/* Subtext */}
        <p className="font-serif italic text-xl md:text-2xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
          Join the UPHA officiating panel. Accredited referees are eligible to officiate district, state, and zonal handball tournaments across Uttar Pradesh.
        </p>
        
        <div className="border-t border-white/10 pt-6"></div>
        
        {/* Meta Data Row */}
        <div className="flex flex-wrap gap-12 mt-6">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">FORM</div>
            <div className="font-bold font-mono text-sm tracking-wider">REF / RFR-2026</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACCREDITATION FEE</div>
            <div className="font-bold font-mono text-sm tracking-wider">₹ {fee}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ESTIMATED TIME</div>
            <div className="font-bold font-mono text-sm tracking-wider">6 - 8 minutes</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">REVIEWED BY</div>
            <div className="font-bold font-mono text-sm tracking-wider">UPHA Referee Board</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
