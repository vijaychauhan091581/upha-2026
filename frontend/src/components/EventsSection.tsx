"use client";

import { useEffect, useState } from "react";
import { Globe, Trophy, Star, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { listEvents, EventData } from "@/lib/api";

export default function EventsSection() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await listEvents();
        if (res.success && res.events) {
          setEvents(res.events.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getIcon = (index: number) => {
    switch (index % 3) {
      case 0: return <Trophy className="w-14 h-14 text-accent/50 stroke-[1.5]" />;
      case 1: return <Globe className="w-14 h-14 text-accent/50 stroke-[1.5]" />;
      case 2: return <Star className="w-14 h-14 text-accent/50 stroke-[1.5]" />;
      default: return <Trophy className="w-14 h-14 text-accent/50 stroke-[1.5]" />;
    }
  };

  return (
    <section id="events" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <div className="text-accent text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-accent inline-block"></span> TOURNAMENT CALENDAR
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900">
            UPCOMING <span className="text-accent">EVENTS</span>
          </h2>
          <p className="text-gray-600 max-w-xl mt-4 text-base sm:text-lg leading-relaxed">
            From district selections to national qualifiers, follow every fixture on the UPHA calendar and register your participation in time.
          </p>
        </div>
        <Link 
          href="/calendar" 
          className="group inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest border-b-2 border-primary pb-1.5 hover:text-accent hover:border-accent transition-colors whitespace-nowrap"
        >
          <span>VIEW FULL CALENDAR</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-16 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        ) : (
          Array.from({ length: Math.max(3, events.length) }).map((_, index) => {
            const event = events[index];
            if (event) {
              const startDate = new Date(event.start_date);
              const endDate = new Date(event.end_date);
              const regDate = new Date(event.registration_end_date);
              
              const day = startDate.getDate().toString().padStart(2, '0');
              const month = startDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              
              const formattedDate = `${startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
              const formattedRegDate = regDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });

              return (
                <div 
                  key={event.id} 
                  className="group bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Top Graphic Banner */}
                  <div className="bg-[#111927] h-52 relative flex items-center justify-center overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="transform group-hover:scale-110 transition-transform duration-500">
                        {getIcon(index)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest rounded shadow-sm z-10">
                      UPCOMING
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-4 right-4 bg-white text-primary p-3 shadow-lg rounded-md font-heading text-center min-w-[4rem] border-t-2 border-accent z-10">
                      <div className="text-3xl font-black leading-none">{day}</div>
                      <div className="text-accent text-[11px] font-bold tracking-widest mt-0.5">{month}</div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
                        {event.category || "TOURNAMENT"}
                      </div>
                      
                      <h3 className="font-heading text-2xl font-bold uppercase text-gray-900 mb-4 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                        {event.name}
                      </h3>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span className="truncate">{event.venue ? `${event.venue}, ${event.location}` : (event.location || "TBA")}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-accent shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Reg. closes <strong className="text-gray-800">{formattedRegDate}</strong>
                      </span>
                      <Link 
                        href={`/calendar`} 
                        className="text-accent font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        DETAILS &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div 
                  key={`empty-${index}`} 
                  className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[380px]"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                    <Trophy className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-500 uppercase tracking-wide mb-1">
                    FIXTURE PENDING
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xs">
                    State calendar fixture to be announced shortly by the competition committee.
                  </p>
                </div>
              );
            }
          })
        )}
      </div>
    </section>
  );
}
