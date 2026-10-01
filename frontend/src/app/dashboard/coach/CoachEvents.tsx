"use client";

import { MapPin, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { listEvents, EventData } from "@/lib/api";

export default function CoachEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await listEvents();
        if (res.success && res.events) {
          // Get future events, sort by date
          const futureEvents = res.events
            .filter(e => new Date(e.start_date) >= new Date())
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .slice(0, 3);
          setEvents(futureEvents);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  const dayNum = (date: string) => new Date(date).getDate().toString().padStart(2, "0");
  const monthShort = (date: string) => new Date(date).toLocaleString("en-US", { month: "short" }).toUpperCase();

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm h-full flex flex-col">
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">UPCOMING EVENTS</h3>
        <Link href="/calendar" className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors">
          VIEW ALL
        </Link>
      </div>
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No upcoming tournaments found.
          </div>
        ) : (
          events.map((event, idx) => (
            <Link
              href="/calendar"
              key={event.id}
              className={`flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 md:p-8 hover:bg-gray-50/50 cursor-pointer transition-colors ${idx < events.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="w-16 h-16 bg-[#111827] rounded-sm flex flex-col items-center justify-center shrink-0">
                <span className="font-heading text-2xl font-bold text-white leading-none">{dayNum(event.start_date)}</span>
                <span className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mt-1">{monthShort(event.start_date)}</span>
              </div>

              <div className="flex-1">
                <h4 className="font-heading text-lg font-bold text-primary uppercase mb-2 group-hover:text-[#d97c55] transition-colors">{event.name}</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#d97c55]" /> {event.location}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {formatDate(event.start_date)}{event.end_date !== event.start_date ? ` – ${formatDate(event.end_date)}` : ""}</div>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase">{(event as any).category || 'Tournament'}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
