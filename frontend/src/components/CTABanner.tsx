import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-br from-[#b35431] via-[#d97c55] to-[#c16744] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/20">
        
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Graphic Schematic */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-14 relative flex items-center justify-center min-h-[380px] min-w-0 z-10">
          <div className="relative w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden border border-white/40">
            <Image 
              src="/handball-ground.png" 
              alt="Handball Ground Schematic" 
              width={600} 
              height={600} 
              className="w-full h-auto object-contain filter drop-shadow-md" 
            />
          </div>
        </div>

        {/* Right Side: Text & Actions */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm self-start border border-white/30">
            OFFICIAL AFFILIATION PORTAL
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
            READY TO TAKE THE COURT?
          </h2>
          
          <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg mb-10 font-normal">
            Whether you&apos;re a player, coach, or referee, your journey with UPHA starts with a single registration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/register" 
              className="group bg-white hover:bg-gray-100 text-[#111827] px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 inline-flex items-center justify-center rounded-xl shadow-xl shadow-black/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
            </Link>
            
            <Link 
              href="/about#contact" 
              className="bg-transparent border-2 border-white/80 hover:border-white text-white hover:bg-white/10 px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 inline-flex items-center justify-center rounded-xl backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              CONTACT US
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
