import Link from "next/link";
import React from "react";

export default function CoachCTA() {
  return (
    <div className="bg-gradient-to-br from-[#b35431] via-[#d97c55] to-[#c16744] rounded-2xl p-12 md:p-16 mb-24 relative overflow-hidden shadow-2xl mt-24 border border-white/20">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-white max-w-2xl">
          <div className="text-[10px] font-bold tracking-widest uppercase mb-4 text-white/80">
            &mdash; EMPOWER THE NEXT GENERATION
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 leading-tight">
            UPHA COACHING DIRECTORY &amp; CADRE.
          </h2>
          <p className="text-white/90 text-lg leading-relaxed font-serif">
            Certified coaches drive the development of youth and senior handball talent across Uttar Pradesh. Official coach accreditations and district placements are maintained and verified by the Uttar Pradesh Handball Association.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-end w-full md:w-auto">
          <Link
            href="/contact"
            className="w-full md:w-auto bg-[#111827] hover:bg-black text-white px-8 py-5 text-sm font-bold tracking-widest uppercase transition-all duration-200 rounded-xl text-center shadow-xl shadow-black/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            CONTACT TECHNICAL COMMITTEE &rarr;
          </Link>
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/80 mt-4">
            ACCREDITATION &middot; UPHA TECHNICAL BOARD
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
