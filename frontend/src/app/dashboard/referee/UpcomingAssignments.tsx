"use client";

import { MapPin, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMyAssignments, EventAssignmentData } from "@/lib/api";

export default function UpcomingAssignments() {
  const [assignments, setAssignments] = useState<EventAssignmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await getMyAssignments();
        if (res.success && res.assignments) {
          const upcoming = res.assignments
            .filter((a) => new Date(a.event.start_date) >= new Date())
            .slice(0, 3);
          setAssignments(upcoming);
        }
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm h-full flex flex-col">
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">UPCOMING MATCH ASSIGNMENTS</h3>
        <Link href="/calendar" className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors">
          VIEW ALL
        </Link>
      </div>
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No upcoming assignments.
          </div>
        ) : (
          assignments.map((assignment, idx) => {
            const event = assignment.event;
            const dateObj = new Date(event.start_date);
            const dateDay = dateObj.getDate().toString().padStart(2, "0");
            const dateMonth = dateObj.toLocaleString("en-IN", { month: "short" }).toUpperCase();
            
            return (
              <Link href="/calendar" key={assignment.id} className={`flex flex-col md:flex-row gap-5 items-start md:items-center p-6 md:p-8 ${idx < assignments.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 cursor-pointer transition-colors group`}>
                
                <div className="w-14 h-16 bg-[#111827] rounded-sm flex flex-col items-center justify-center shrink-0">
                  <span className="font-heading text-xl font-bold text-white leading-none">{dateDay}</span>
                  <span className="text-[8px] font-bold tracking-widest text-[#d97c55] uppercase mt-1">
                    {dateMonth}
                  </span>
                  <div className="mt-2 text-[6px] text-gray-400 font-mono tracking-widest">TBD</div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-heading text-base font-bold text-primary uppercase mb-1 group-hover:text-[#d97c55] transition-colors">{event.name}</h4>
                  <div className="text-[10px] text-gray-600 mb-2">{event.category} - {assignment.role}</div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#d97c55]" /> {event.location}</div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <div className={`bg-[#e8c69f] text-[#8e5c2b] px-3 py-1.5 rounded-sm text-[9px] font-bold tracking-widest uppercase`}>
                    {assignment.status}
                  </div>
                  <button className="text-[8px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors pointer-events-none">
                    VIEW MATCH BRIEF &rarr;
                  </button>
                </div>

              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
