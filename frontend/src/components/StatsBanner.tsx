"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Shield, GraduationCap, Building2, MapPin, ArrowUpRight } from "lucide-react";
import { getGlobalStats, GlobalStatsData } from "@/lib/api";

export default function StatsBanner() {
  const [stats, setStats] = useState<GlobalStatsData | null>(null);

  useEffect(() => {
    getGlobalStats()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => {
        console.error("Failed to load live stats:", err);
      });
  }, []);

  const items = [
    {
      id: "referees",
      title: "ACCREDITED REFEREES",
      count: stats?.referees ?? 0,
      icon: Shield,
      href: "/database/referees",
      actionText: "View Database",
      accentColor: "from-blue-500 to-indigo-500",
      badge: "Match Officials",
    },
    {
      id: "players",
      title: "REGISTERED PLAYERS",
      count: stats?.players ?? 0,
      icon: Users,
      href: "/database/players",
      actionText: "View Database",
      accentColor: "from-orange-500 to-amber-500",
      badge: "State Talent",
    },
    {
      id: "coaches",
      title: "CERTIFIED COACHES",
      count: stats?.coaches ?? 0,
      icon: GraduationCap,
      href: "/database/coaches",
      actionText: "View Database",
      accentColor: "from-emerald-500 to-teal-500",
      badge: "Mentors",
    },
    {
      id: "academies",
      title: "AFFILIATED ACADEMIES",
      count: stats?.academies ?? 0,
      icon: Building2,
      href: "/database/academies",
      actionText: "View Database",
      accentColor: "from-purple-500 to-pink-500",
      badge: "Training Hubs",
    },
    {
      id: "districts",
      title: "DISTRICT UNITS",
      count: stats?.districts ?? 0,
      icon: MapPin,
      href: "/districts",
      actionText: "View Database",
      accentColor: "from-amber-500 to-yellow-500",
      badge: "Across UP",
    },
  ];

  return (
    <section className="relative z-30 -mt-10 max-w-7xl mx-auto px-6">
      <div className="bg-[#111927] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Top Header Strip */}
        <div className="bg-white/[0.03] border-b border-white/10 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">
              LIVE REGISTRATION DATABASE COUNTER
            </span>
          </div>
          <div className="text-[11px] font-semibold tracking-wider text-accent uppercase">
            Official Uttar Pradesh Handball Association Roster
          </div>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="group relative p-6 sm:p-7 flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Subtle top indicator bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-[#d97c55] to-amber-400" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:border-accent/40 transition-all duration-300">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                      {item.badge}
                    </span>
                  </div>

                  <div className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-1 group-hover:text-accent transition-colors">
                    {item.count.toLocaleString()}
                  </div>

                  <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase leading-snug mb-5">
                    {item.title}
                  </div>
                </div>

                <Link
                  href={item.href}
                  className="mt-2 inline-flex items-center justify-between w-full px-3 py-2.5 rounded-md bg-white/5 hover:bg-accent text-gray-300 hover:text-white border border-white/10 hover:border-accent text-xs font-bold tracking-wider uppercase transition-all duration-200 group/btn shadow-sm"
                >
                  <span>{item.actionText}</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
