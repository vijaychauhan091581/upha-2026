import { TrendingUp, Award, Trophy } from "lucide-react";

export default function MandateSection() {
  const mandates = [
    {
      num: "01",
      title: "DEVELOP",
      icon: TrendingUp,
      text: "Identify and nurture talent through district-level scouting, junior leagues, and structured training pathways from grassroots to national.",
    },
    {
      num: "02",
      title: "CERTIFY",
      icon: Award,
      text: "Standardise the sport across the state with accredited coaches, qualified referees, and verified player registries that meet HAI norms.",
    },
    {
      num: "03",
      title: "COMPETE",
      icon: Trophy,
      text: "Host state, zonal, and selection tournaments — and represent Uttar Pradesh at every national and international fixture on the calendar.",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="bg-[#0f172a] rounded-2xl p-8 sm:p-12 lg:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background Accent Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
          {mandates.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.num}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-accent/40 rounded-xl p-8 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-accent text-xs font-bold tracking-widest uppercase">
                      <span className="text-white/60">— {m.num}</span> / MANDATE
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-wide text-white mb-4 group-hover:text-accent transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-normal">
                    {m.text}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent/60 group-hover:bg-accent transition-colors"></span>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">UPHA State Directive</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
