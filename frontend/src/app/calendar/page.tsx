"use client";

import React, { useEffect, useState } from "react";
import { listEvents, EventData } from "@/lib/api";
import { Calendar as CalendarIcon, MapPin, Trophy, Star, Globe, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    listEvents()
      .then((res) => {
        if (res.success) setEvents(res.events);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEventStatus = (event: EventData) => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (end < today) return "PAST";
    if (start <= today && end >= today) return "ONGOING";
    return "UPCOMING";
  };

  const getIcon = (id: number) => {
    switch (id % 3) {
      case 0: return <Trophy className="w-12 h-12 text-[#d97c55]/30 stroke-[1]" />;
      case 1: return <Globe className="w-12 h-12 text-[#d97c55]/30 stroke-[1]" />;
      case 2: return <Star className="w-12 h-12 text-[#d97c55]/30 stroke-[1]" />;
      default: return <Trophy className="w-12 h-12 text-[#d97c55]/30 stroke-[1]" />;
    }
  };

  // Categories extraction
  const eventsByStatus = events.reduce((acc, e) => {
    const status = getEventStatus(e);
    acc[status] = (acc[status] || 0) + 1;
    acc["ALL"] = (acc["ALL"] || 0) + 1;
    return acc;
  }, { ALL: 0, UPCOMING: 0, ONGOING: 0, PAST: 0 } as Record<string, number>);

  const filteredEvents = events.filter((e) => {
    const status = getEventStatus(e);
    if (filter !== "ALL" && status !== filter) return false;

    const searchMatch = !searchQuery || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  // Sort by date (Upcoming: ascending, Past: descending)
  filteredEvents.sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    if (filter === "PAST") return dateB - dateA;
    return dateA - dateB;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#fcfbf9] w-full">
      {/* Hero Section */}
      <section className="bg-[#111827] text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#d97c55] font-semibold text-xs tracking-widest uppercase mb-8 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> BACK TO HOME
          </Link>
          <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-4">
            TOURNAMENTS & FIXTURES
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            EVENTS <span className="text-[#d97c55]">CALENDAR</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-lg max-w-2xl mb-12">
            The complete schedule for upcoming selections, district trials, state championships, and association meetings.
          </p>

          <div className="flex flex-wrap gap-12 border-t border-gray-800 pt-8">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">TOTAL EVENTS</div>
              <div className="font-bold font-mono text-xl">{events.length}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">UPCOMING</div>
              <div className="font-bold font-mono text-xl">{eventsByStatus.UPCOMING}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">PAST EVENTS</div>
              <div className="font-bold font-mono text-xl">{eventsByStatus.PAST}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="border-b border-gray-200 bg-white relative z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
            {["UPCOMING", "ONGOING", "PAST", "ALL"].map(cat => {
              const count = eventsByStatus[cat] || 0;
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${
                    isActive ? "bg-[#111827] text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] ${isActive ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#d97c55] text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827]">
            {filter} <span className="text-[#d97c55]">EVENTS</span>
          </h2>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            SHOWING {filteredEvents.length} MATCHES
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-sm h-[320px]"></div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-32 text-gray-500 border border-dashed border-gray-300 rounded bg-white min-h-[300px] flex flex-col items-center justify-center">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <div className="text-sm font-bold text-[#111827] mb-1">No events found</div>
            <div className="text-xs">Try adjusting your filters or search query.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const startDate = new Date(event.start_date);
              const endDate = new Date(event.end_date);
              const regDate = new Date(event.registration_end_date);
              
              const day = startDate.getDate().toString().padStart(2, '0');
              const month = startDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              const formattedDate = `${startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
              const formattedRegDate = regDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
              
              const status = getEventStatus(event);
              let statusBadge = "";
              if (status === "UPCOMING") statusBadge = "bg-[#d97c55] text-white";
              else if (status === "ONGOING") statusBadge = "bg-green-600 text-white";
              else statusBadge = "bg-gray-200 text-gray-600";

              return (
                <div key={event.id} className="border border-gray-200 rounded-sm bg-white flex flex-col overflow-hidden hover:border-[#d97c55] transition-colors shadow-sm group">
                  <div className="bg-[#111827] h-48 relative flex items-center justify-center overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                        <div className="z-10 group-hover:scale-110 transition-transform duration-500">
                          {getIcon(event.id)}
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className={`absolute top-4 left-4 ${statusBadge} text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm z-10 shadow-sm`}>
                      {status}
                    </div>
                    <div className="absolute bottom-0 right-4 bg-white text-[#111827] p-3 shadow-md font-heading text-center w-16 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border-t-2 border-[#d97c55]">
                      <div className="text-3xl font-bold leading-none">{day}</div>
                      <div className="text-[#d97c55] text-[10px] font-bold tracking-widest uppercase mt-1">{month}</div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[#d97c55] text-[10px] font-bold tracking-widest uppercase mb-2">
                        {event.category || "TOURNAMENT"}
                      </div>
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wide leading-tight text-[#111827] mb-4">
                        {event.name}
                      </h3>
                      <div className="flex items-start gap-2 text-xs text-gray-500 mb-3 font-medium">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /> 
                        <span className="leading-snug">{event.venue ? `${event.venue}, ${event.location}` : (event.location || "Location TBA")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
                        <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" /> 
                        {formattedDate}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        REG. CLOSES <span className={regDate < today ? "text-red-500" : "text-[#111827]"}>{formattedRegDate}</span>
                      </span>
                      {status === "UPCOMING" || status === "ONGOING" ? (
                        <span className="text-accent text-[10px] font-bold uppercase tracking-widest">
                          {status}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                          CONCLUDED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
