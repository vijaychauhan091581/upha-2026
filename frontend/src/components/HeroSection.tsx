import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-[#0c1424] text-white overflow-hidden border-b border-white/10">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-14 lg:pt-20 pb-12 lg:pb-16 flex flex-col lg:flex-row items-center lg:items-end justify-between relative z-10">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 lg:pr-10 z-20">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent text-[11px] font-bold tracking-widest uppercase">
              EST. 1972 · AFFILIATED WITH HAI
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold uppercase tracking-tight leading-[0.92] mb-5">
            KHELEGA INDIA<br />
            <span className="text-accent drop-shadow-sm">
              KHILEGA INDIA
            </span>
          </h1>

          {/* Slogan */}
          <p className="text-gold text-xl sm:text-2xl font-serif italic mb-6 tracking-wide text-[#fbbf24]">
            &quot;When India plays, India blooms.&quot;
          </p>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mb-9 font-normal">
            The Uttar Pradesh Handball Association is the official governing body for the sport across the state — fostering grassroots talent, world-class athletes, and the spirit of the game in every district.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link 
              href="/register" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wider uppercase text-white bg-accent hover:bg-accent/90 rounded-sm transition-all duration-300 shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>BECOME A MEMBER</span>
              <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-200">&rarr;</span>
            </Link>
            
            <Link 
              href="/#events" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-wider uppercase text-white bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-sm transition-all duration-200 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              UPCOMING TOURNAMENTS
            </Link>
          </div>

          <div className="w-full max-w-xl h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent mb-8"></div>

          {/* Affiliations Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
            {/* HAI */}
            <div className="bg-white/5 border border-white/10 rounded-sm p-3.5 backdrop-blur-sm hover:border-accent/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-1">AFFILIATED WITH</div>
                <div className="font-bold text-xs text-white line-clamp-1">Handball Association India</div>
              </div>
              <div className="mt-3 flex items-center h-12">
                <Image src="/HAI.png" alt="HAI Logo" width={64} height={64} className="object-contain max-h-12 w-auto filter drop-shadow" />
              </div>
            </div>

            {/* UPOA */}
            <div className="bg-white/5 border border-white/10 rounded-sm p-3.5 backdrop-blur-sm hover:border-accent/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-1">RECOGNIZED BY</div>
                <div className="font-bold text-xs text-white line-clamp-1">UP Olympic Association</div>
              </div>
              <div className="mt-3 flex items-center h-12">
                <Image src="/UPOA.png" alt="UPOA Logo" width={64} height={64} className="object-contain max-h-12 w-auto filter drop-shadow" />
              </div>
            </div>

            {/* UP GOV */}
            <div className="bg-white/5 border border-white/10 rounded-sm p-3.5 backdrop-blur-sm hover:border-accent/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mb-1">AFFILIATED TO</div>
                <div className="font-bold text-xs text-white line-clamp-1">Sports Directorate, UP</div>
              </div>
              <div className="mt-3 flex items-center h-12">
                <Image src="/up-gov.png" alt="UP Govt Logo" width={64} height={64} className="object-contain max-h-12 w-auto filter drop-shadow" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Content / Player Silhouette */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative flex justify-center lg:justify-end items-end z-10 min-w-0">
          <div className="relative w-full max-w-lg lg:max-w-2xl flex justify-center lg:justify-end items-end">
            <div className="absolute -inset-4 bg-gradient-to-t from-accent/30 to-transparent blur-3xl opacity-50 rounded-full" />
            <Image 
              src="/hero-section.png" 
              alt="Handball Player Silhouette" 
              width={800} 
              height={800} 
              className="relative object-contain object-bottom w-full h-auto max-h-[500px] lg:max-h-[720px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" 
              priority 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
