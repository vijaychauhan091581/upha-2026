import { User, CheckCircle, Shield, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterSelectionPage() {
  const cards = [
    {
      id: "01",
      title: "Player Registration",
      desc: "Open to all athletes between 12-35 years. Get your official UPHA player ID, district affiliation, and eligibility to compete in state and national tournaments.",
      link: "/register/player",
      icon: User,
      color: "from-blue-600 to-blue-900",
    },
    {
      id: "02",
      title: "Referee Accreditation",
      desc: "For licensed match officials. Register, take the annual qualifier, and join the UPHA officiating roster for state, zonal, and national-level matches.",
      link: "/register/referee",
      icon: Shield,
      color: "from-[#d97c55] to-orange-900",
    },
    {
      id: "03",
      title: "Academy Affiliation",
      desc: "For sports academies and clubs. File for official affiliation, submit committee details, and become a recognized unit under UPHA's network.",
      link: "/register/academy",
      icon: Building2,
      color: "from-rose-600 to-rose-900",
    },
    {
      id: "04",
      title: "District Affiliation",
      desc: "For district handball associations. File for official affiliation, submit committee details, and become a recognized unit under UPHA's state-wide network.",
      link: "/register/district",
      icon: Building2,
      color: "from-purple-600 to-purple-900",
    },
  ];

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#111827] text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-4">
            APPLICATION PORTAL
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide mb-6">
            JOIN <span className="text-accent">UPHA</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-xl max-w-2xl mx-auto">
            Select your role to begin the registration or accreditation process. Become an official part of the state's handball network.
          </p>
        </div>
      </section>

      {/* Grid Selection */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} href={card.link} className="group h-full">
                <div className="bg-white border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-sm p-8 h-full flex flex-col justify-between overflow-hidden relative group-hover:-translate-y-2">
                  {/* Decorative Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-8 relative">
                      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                        <Icon className="w-6 h-6 text-[#111827]" />
                      </div>
                      <span className="text-accent font-bold text-sm tracking-widest">— {card.id}</span>
                    </div>
                    
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827] mb-4 relative z-10">
                      {card.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 relative z-10">
                      {card.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-widest uppercase relative z-10">
                    <span className="group-hover:mr-2 transition-all duration-300">Start Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
