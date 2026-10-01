"use client";
import React, { useEffect, useState } from "react";
import { listEvents, EventData, AcademyData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Mail, Phone, Briefcase } from "lucide-react";

export default function AcademyStaffAndSchedule() {
  const { meData, loading: authLoading } = useAuth();
  const academy = meData as AcademyData | null;
  const [sessions, setSessions] = useState<EventData[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await listEvents();
        if (res.success && res.events) {
          const upcoming = res.events
            .filter((e) => new Date(e.start_date) >= new Date())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .slice(0, 4);
          setSessions(upcoming);
        }
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setSessionsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const hasCoach = academy?.coach_name && academy.coach_name.trim().length > 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Our Coaches Column */}
      <div className="w-full lg:w-1/2 bg-white border border-gray-200 shadow-sm rounded-sm flex flex-col">
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
          <h3 className="font-heading text-xl font-bold uppercase text-primary">OUR COACHES</h3>
          <button className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors">
            MANAGE
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          {authLoading ? (
            <div className="p-8 space-y-3">
              <div className="h-16 bg-gray-100 rounded-sm animate-pulse" />
            </div>
          ) : hasCoach ? (
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 p-4 bg-[#f9fafb] border border-gray-100 rounded-sm hover:border-gray-200 transition-colors">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#111827] flex items-center justify-center shrink-0 shadow-inner">
                  <span className="font-heading text-base font-bold text-white tracking-wide">
                    {academy!.coach_name!.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-800 truncate">{academy!.coach_name}</div>
                  <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mt-0.5 mb-3">
                    HEAD COACH
                    {academy!.coach_experience > 0 && ` · ${academy!.coach_experience} YRS EXP.`}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {academy!.coach_mobile && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{academy!.coach_mobile}</span>
                      </div>
                    )}
                    {academy!.coach_email && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{academy!.coach_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No coach registered yet.</p>
              <p className="text-xs text-gray-400 mt-1">Register an academy and include coach details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Sessions Column */}
      <div className="w-full lg:w-1/2 bg-white border border-gray-200 shadow-sm rounded-sm flex flex-col">
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
          <h3 className="font-heading text-xl font-bold uppercase text-primary">UPCOMING SESSIONS</h3>
          <button className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors">
            FULL SCHEDULE
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          {sessionsLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-sm animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No upcoming sessions.</div>
          ) : (
            sessions.map((session, index) => {
              const dateObj = new Date(session.start_date);
              const dateDay = dateObj.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
              const dateMonth = dateObj.toLocaleDateString("en-IN", { month: "short", day: "2-digit" }).toUpperCase();

              return (
                <div
                  key={session.id}
                  className={`flex items-center gap-6 p-6 hover:bg-gray-50/50 transition-colors ${
                    index < sessions.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center shrink-0">
                    <span className="font-heading text-lg font-bold text-gray-800 leading-none">{dateDay}</span>
                    <span className="text-[8px] font-bold tracking-widest text-[#d97c55] uppercase mt-1">{dateMonth}</span>
                  </div>

                  <div className="flex-1 truncate">
                    <h4 className="font-bold text-sm text-gray-800 mb-1 truncate">{session.name}</h4>
                    <div className="text-[10px] font-mono tracking-wider text-gray-500 truncate">{session.location}</div>
                    <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mt-1">{session.category}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
