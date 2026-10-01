"use client";

import { useEffect, useState } from "react";
import { Megaphone, CalendarDays } from "lucide-react";
import { getAnnouncements, AnnouncementData } from "@/lib/api";

export default function AnnouncementsPage() {
  const [notices, setNotices] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await getAnnouncements();
        if (res.success && res.announcements) {
          setNotices(res.announcements);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  return (
    <main className="flex-1 bg-background flex flex-col pt-16 md:pt-24 min-h-screen">
      
      {/* Page Header */}
      <section className="bg-primary pt-24 pb-16 px-6 relative border-b-4 border-accent">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-accent text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-accent inline-block"></span> OFFICIAL NOTICES
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide text-white">
              PUBLIC <span className="text-accent">ANNOUNCEMENTS</span>
            </h1>
            <p className="text-gray-300 max-w-xl mt-6 text-lg leading-relaxed">
              Stay up to date with the latest official notices, circulars, and announcements from the Uttar Pradesh Handball Association.
            </p>
          </div>
          <div className="text-gray-400 font-mono text-sm tracking-wider uppercase bg-[#151e2b] p-4 rounded-sm border border-gray-800">
            {notices.length} NOTICES PUBLISHED
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16 md:py-24 bg-white flex-1">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-mono text-sm uppercase">
              No announcements published yet.
            </div>
          ) : (
            notices.map((notice) => {
              const dateObj = new Date(notice.created_at);
              const day = dateObj.toLocaleDateString("en-IN", { day: "2-digit" });
              const month = dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
              const year = dateObj.getFullYear();
              
              return (
                <div 
                  key={notice.id} 
                  className="bg-white border border-gray-200 rounded-sm hover:shadow-lg transition-shadow flex flex-col md:flex-row overflow-hidden group"
                >
                  {/* Date Column */}
                  <div className="bg-gray-50 border-r border-gray-100 p-6 md:p-8 flex md:flex-col items-center justify-center shrink-0 min-w-[140px] gap-2 md:gap-0">
                    <div className="text-4xl font-heading font-bold text-primary group-hover:text-accent transition-colors">{day}</div>
                    <div className="text-sm font-bold tracking-widest text-gray-500 uppercase">{month}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">{year}</div>
                  </div>
                  
                  {/* Content Column */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                        NOTICE
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-[#111827] mb-3 leading-snug group-hover:text-primary transition-colors">
                      {notice.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                      {notice.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </section>

    </main>
  );
}
