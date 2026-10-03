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
    <div className="group bg-[#111927] p-5 sm:p-7 md:p-9 rounded-2xl text-white flex flex-col items-start justify-between h-full min-h-[360px] sm:min-h-[400px] border border-white/10 hover:border-accent/50 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden w-full">
      {/* Top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-[#ff8f6b] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="w-full">
        <div className="flex items-center justify-between w-full mb-3.5 sm:mb-6">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-accent text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/5 border border-white/5">
              — {data.id}
            </span>
            <span className="text-emerald-300 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-emerald-500/20 border border-emerald-500/30">
              {data.count.toLocaleString()} {data.countBadge}
            </span>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-accent/40 transition-all duration-300 shrink-0">
            {data.icon}
          </div>
        </div>

        <h3 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide mb-2 sm:mb-2.5 text-white group-hover:text-accent transition-colors leading-snug">
          {data.title}
        </h3>

        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-normal">
          {data.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full pt-3.5 sm:pt-4 border-t border-white/10">
        <Link 
          href={data.databaseHref} 
          className="inline-flex items-center justify-center sm:justify-between gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg bg-accent text-white text-xs font-bold tracking-wider uppercase hover:bg-[#e06644] transition-all shadow-sm group/btn flex-1 text-center"
        >
          <span>{data.databaseText}</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
        <Link 
          href={data.registerHref} 
          className="inline-flex items-center justify-center sm:justify-between gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold tracking-wider uppercase transition-all flex-1 text-center"
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
      icon: <Shield className="text-accent w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
      title: "Referee Accreditation",
      count: stats?.referees ?? 0,
      countBadge: "Referees",
      description: "For licensed match officials. Register, take the annual qualifier, and join the UPHA officiating roster for state, zonal, and national-level matches.",
      databaseHref: "/database/referees",
      databaseText: "View Database",
      registerHref: "/register/referee",
      registerText: "Apply as Referee",
    },
    {
      id: "02",
      icon: <User className="text-accent w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
      title: "Player Registration",
      count: stats?.players ?? 0,
      countBadge: "Players",
      description: "Open to all athletes between 12-35 years. Get your official UPHA player ID, district affiliation, and eligibility to compete in state and national tournaments.",
      databaseHref: "/database/players",
      databaseText: "View Database",
      registerHref: "/register/player",
      registerText: "Register as Player",
    },
    {
      id: "03",
      icon: <Building2 className="text-accent w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
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
      icon: <MapPin className="text-accent w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
      title: "District Affiliation",
      count: stats?.districts ?? 0,
      countBadge: "District Units",
      description: "For district handball associations. File for official affiliation, submit committee details, and become a recognized unit under UPHA's state-wide network.",
      databaseHref: "/districts",
      databaseText: "View Database",
      registerHref: "/register/district",
      registerText: "Apply as District",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      onSelect();
      setScrollSnaps(emblaApi.scrollSnapList());
    });
  }, [emblaApi, onSelect]);

  return (
    <section id="database" className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-6">
        <div className="max-w-2xl">
          <div className="text-accent text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3 flex items-center gap-2">
            <span className="w-6 sm:w-8 h-[2px] bg-accent inline-block"></span> OFFICIAL PORTAL
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-3 sm:mb-4">
            REGISTRATIONS &amp; <span className="text-accent">AFFILIATIONS</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Join the official roster of Uttar Pradesh&apos;s handball community. Whether you play, coach, officiate, or manage a district unit — your registration unlocks access to events, accreditation, and grant programs.
          </p>
        </div>

        {/* Carousel Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-gray-300 hover:border-accent flex items-center justify-center text-gray-700 hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent text-white hover:bg-[#e06644] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all shadow-md shadow-accent/20"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6">
          {registrationData.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 shrink-0">
              <RegistrationCard data={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:hidden">
        {registrationData.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "w-6 bg-accent" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
