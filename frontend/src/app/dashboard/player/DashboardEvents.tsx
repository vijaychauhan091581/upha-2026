"use client";

import { MapPin, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { listEvents, EventData } from "@/lib/api";

export default function DashboardEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEvents()
      .then((res) => {
        // Show upcoming events only (start_date >= today)
        const today = new Date().toISOString().split("T")[0];
        const upcoming = res.events
          .filter((e) => e.start_date >= today)
          .slice(0, 5);
        setEvents(upcoming);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  }

  function dayNum(d: string) {
    return new Date(d).getDate();
  }

  function monthShort(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm h-full flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">UPCOMING EVENTS</h3>
        <Link href="/calendar" className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors">
          VIEW ALL
        </Link>
      </div>

      {/* Events List */}
      <div className="flex-1 flex flex-col">

        {loading && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-sm text-gray-400 animate-pulse">Loading events…</div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="text-3xl mb-3">🏐</div>
              <div className="text-sm text-gray-500">No upcoming events scheduled.</div>
            </div>
          </div>
        )}

        {!loading && events.map((event, idx) => (
          <Link
            href="/calendar"
            key={event.id}
            className={`flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 md:p-8 hover:bg-gray-50/50 cursor-pointer transition-colors ${idx < events.length - 1 ? "border-b border-gray-50" : ""}`}
          >
            <div className="w-16 h-16 bg-[#111827] rounded-sm flex flex-col items-center justify-center shrink-0">
              <span className="font-heading text-2xl font-bold text-white leading-none">{dayNum(event.start_date)}</span>
              <span className="text-[9px] font-bold tracking-widest text-accent uppercase mt-1">{monthShort(event.start_date)}</span>
            </div>

            <div className="flex-1">
              <h4 className="font-heading text-lg font-bold text-primary uppercase mb-2 group-hover:text-accent transition-colors">{event.name}</h4>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" /> {event.location}</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {formatDate(event.start_date)}{event.end_date !== event.start_date ? ` – ${formatDate(event.end_date)}` : ""}</div>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase">{event.category}</span>
              </div>
            </div>

          </Link>
        ))}

      </div>
    </div>
  );
}
