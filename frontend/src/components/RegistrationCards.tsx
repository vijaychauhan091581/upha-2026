"use client";

import { User, Shield, Building2, MapPin, GraduationCap, ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { getGlobalStats, GlobalStatsData } from "@/lib/api";

interface RegistrationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  countBadge: string;
  count: number;
  description: string;
  registerHref: string;
  registerText: string;
  databaseHref: string;
  databaseText: string;
}

function RegistrationCard({ data }: { data: RegistrationItem }) {
  return (
    <div className="group bg-[#111927] p-8 sm:p-10 rounded-xl text-white flex flex-col items-start justify-between h-full min-h-[440px] border border-white/10 hover:border-accent/50 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      {/* Top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-[#ff8f6b] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2">
            <span className="text-accent text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-white/5 border border-white/5">
              — {data.id}
            </span>
            <span className="text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {data.count.toLocaleString()} {data.countBadge}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-accent/40 transition-all duration-300">
            {data.icon}
          </div>
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-3 text-white group-hover:text-accent transition-colors leading-tight">
          {data.title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-normal">
          {data.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full pt-4 border-t border-white/10">
        <Link 
          href={data.databaseHref} 
          className="inline-flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-md bg-accent text-white text-xs font-bold tracking-wider uppercase hover:bg-[#e06644] transition-all shadow-sm group/btn flex-1 text-center"
        >
          <span>{data.databaseText}</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
        <Link 
          href={data.registerHref} 
          className="inline-flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold tracking-wider uppercase transition-all flex-1 text-center"
        >
          <span>{data.registerText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function RegistrationCards() {
  const [stats, setStats] = useState<GlobalStatsData | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  useEffect(() => {
    getGlobalStats()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => {
        console.error("Failed to load registration stats:", err);
      });
  }, []);

  const registrationData: RegistrationItem[] = [
    {
      id: "01",
      icon: <Shield className="text-accent w-6 h-6 stroke-[2]" />,
      title: "Referee Accreditation",
      count: stats?.referees ?? 15,
      countBadge: "Referees",
      description: "For licensed match officials. Register, take the annual qualifier, and join the UPHA officiating roster for state, zonal, and national-level matches.",
      databaseHref: "/database/referees",
      databaseText: "View Database",
      registerHref: "/register/referee",
      registerText: "Apply as Referee",
    },
    {
      id: "02",
      icon: <User className="text-accent w-6 h-6 stroke-[2]" />,
      title: "Player Registration",
      count: stats?.players ?? 150,
      countBadge: "Players",
      description: "Open to all athletes between 12-35 years. Get your official UPHA player ID, district affiliation, and eligibility to compete in state and national tournaments.",
      databaseHref: "/database/players",
      databaseText: "View Database",
      registerHref: "/register/player",
      registerText: "Register as Player",
    },
    {
      id: "03",
      icon: <Building2 className="text-accent w-6 h-6 stroke-[2]" />,
      title: "Academy Affiliation",
      count: stats?.academies ?? 0,
      countBadge: "Academies",
      description: "For sports academies and clubs. File for official affiliation, submit committee details, and become a recognized unit under UPHA's network.",
      databaseHref: "/database/academies",
      databaseText: "View Database",
      registerHref: "/register/academy",
      registerText: "Apply as Academy",
    },
    {
      id: "04",
      icon: <MapPin className="text-accent w-6 h-6 stroke-[2]" />,
      title: "District Affiliation",
      count: (stats?.districts && stats.districts > 0) ? stats.districts : 75,
      countBadge: "District Units",
      description: "For district handball associations. File for official affiliation, submit committee details, and become a recognized unit under UPHA's state-wide network.",
      databaseHref: "/districts",
      databaseText: "View Database",
      registerHref: "/register/district",
      registerText: "Apply as District",
    },
  ];

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="database" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <div className="text-accent text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-accent inline-block"></span> OFFICIAL PORTAL
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-4">
            REGISTRATIONS & <span className="text-accent">AFFILIATIONS</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Join the official roster of Uttar Pradesh&apos;s handball community. Whether you play, coach, officiate, or manage a district unit — your registration unlocks access to events, accreditation, and grant programs.
          </p>
        </div>

        {/* Carousel Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous"
            className="w-12 h-12 rounded-lg border border-gray-300 hover:border-accent flex items-center justify-center text-gray-700 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next"
            className="w-12 h-12 rounded-lg bg-accent text-white hover:bg-[#e06644] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all shadow-md shadow-accent/20"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4" ref={emblaRef}>
        <div className="flex gap-6">
          {registrationData.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
              <RegistrationCard data={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
