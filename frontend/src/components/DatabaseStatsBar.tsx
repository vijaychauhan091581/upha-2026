"use client";

import { useEffect, useState } from "react";
import { Shield, Users, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { getGlobalStats } from "@/lib/api";

export default function DatabaseStatsBar() {
  const [counts, setCounts] = useState({
    referees: 0,
    coaches: 0,
    players: 0,
    academies: 0,
    districts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await getGlobalStats();
        if (res && res.success && res.stats) {
          setCounts({
            referees: res.stats.referees || 0,
            coaches: res.stats.coaches || 0,
            players: res.stats.players || 0,
            academies: res.stats.academies || 0,
            districts: res.stats.districts || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load database counts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  const stats = [
    { label: "Referees", count: counts.referees, icon: <Shield className="w-6 h-6" /> },
    { label: "Coaches", count: counts.coaches, icon: <Briefcase className="w-6 h-6" /> },
    { label: "Players", count: counts.players, icon: <Users className="w-6 h-6" /> },
    { label: "Academies", count: counts.academies, icon: <GraduationCap className="w-6 h-6" /> },
    { label: "District Units", count: counts.districts, icon: <MapPin className="w-6 h-6" /> },
  ];

  return (
    <div className="w-full bg-[#111827] py-8 rounded-xl shadow-lg border border-gray-800">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-800 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center ${
              idx > 1 ? "pt-6 sm:pt-0" : ""
            }`}
          >
            <div className="text-accent mb-3">{stat.icon}</div>
            <div className="font-heading text-4xl font-bold text-white mb-1">
              {loading ? (
                <span className="text-gray-600 animate-pulse font-mono">---</span>
              ) : (
                String(stat.count).padStart(2, "0")
              )}
            </div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
