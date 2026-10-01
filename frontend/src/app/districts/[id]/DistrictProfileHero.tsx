import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { DistrictData } from "@/lib/api";

export default function DistrictProfileHero({ district }: { district: DistrictData }) {
  const shortName = district.district.substring(0, 2).toUpperCase();
  const formatRef = (id: number) => String(id).padStart(3, '0');

  return (
    <div className="bg-[#111827] text-white pt-12 pb-32 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/districts" className="hover:text-white transition-colors">MEMBERS UNIT</Link>
          <span>/</span>
          <Link href="/districts" className="hover:text-white transition-colors">AFFILIATED DISTRICTS</Link>
          <span>/</span>
          <span className="text-white">{district.district}</span>
        </div>
        
        {/* Title */}
        <h1 className="font-heading text-6xl md:text-7xl font-bold uppercase tracking-wide mb-6">
          {district.district} <span className="text-accent">HANDBALL ASSOCIATION</span>
        </h1>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-sm bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span className="text-[9px] font-bold tracking-widest text-white uppercase">AFFILIATED</span>
          </div>
          <div className="border border-white/20 px-3 py-1.5 rounded-sm bg-white/5">
            <span className="text-[9px] font-bold tracking-widest text-white uppercase">MEMBER UNIT &middot; {formatRef(district.id)}</span>
          </div>
          <div className="border border-transparent px-3 py-1.5 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
            {district.district}, UTTAR PRADESH
          </div>
        </div>
        
      </div>

      {/* Overlapping Identity Card */}
      <div className="absolute left-0 right-0 -bottom-20 w-full z-20 px-6">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl shadow-black/10 rounded-sm border border-gray-100 flex flex-col md:flex-row items-center relative overflow-hidden">
          
          <div className="p-8 md:p-12 shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
            {district.logo ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-white flex items-center justify-center p-2">
                <Image src={district.logo} alt={`${district.district} Logo`} fill unoptimized className="object-contain p-2" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#111827] flex items-center justify-center border-4 border-white shadow-md">
                <span className="font-heading text-2xl font-bold text-white tracking-wider">{shortName}</span>
              </div>
            )}
          </div>
          
          <div className="p-8 md:p-12 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-emerald-600 uppercase mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> OFFICIALLY RECOGNIZED BY UPHA
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-2">
              {district.district} HANDBALL ASSOCIATION
            </h2>
            <p className="font-serif italic text-gray-600 leading-relaxed text-sm max-w-xl">
              An affiliated district unit of the Uttar Pradesh Handball Association, serving handball in the district of {district.district}.
            </p>
          </div>
          
          <div className="p-8 md:p-12 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col items-center justify-center bg-gray-50/50 self-stretch">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">MEMBER REF</div>
            <div className="font-heading text-6xl font-bold text-accent leading-none">{formatRef(district.id)}</div>
            <div className="text-[9px] text-gray-400 uppercase mt-2">of affiliated units</div>
          </div>

          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
