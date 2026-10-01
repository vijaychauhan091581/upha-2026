"use client";

import { useEffect, useState } from "react";
import { Megaphone, CalendarDays } from "lucide-react";
import { getAnnouncements, AnnouncementData } from "@/lib/api";
import Link from "next/link";

export default function AnnouncementsSection() {
  const [notices, setNotices] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await getAnnouncements();
        if (res.success && res.announcements) {
          // Display top 3 announcements on the homepage
          setNotices(res.announcements.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  if (loading || notices.length === 0) {
    return null; // Don't render the section if there are no announcements
  }

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-accent inline-block"></span> OFFICIAL NOTICES
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#111827]">
              PUBLIC <span className="text-accent">ANNOUNCEMENTS</span>
            </h2>
            <p className="text-gray-500 max-w-lg mt-4 text-sm leading-relaxed">
              Stay up to date with the latest official notices, circulars, and announcements from the Uttar Pradesh Handball Association.
            </p>
          </div>
          <Link href="/announcements" className="bg-transparent border border-gray-200 hover:border-[#111827] text-[#111827] px-6 py-3 rounded-sm text-xs font-bold tracking-widest uppercase transition-colors shrink-0 inline-block text-center">
            VIEW ALL NOTICES &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notices.map((notice) => {
            const dateStr = new Date(notice.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            });
            
            return (
              <div 
                key={notice.id} 
                className="bg-gray-50 border border-gray-100 p-8 rounded-sm hover:shadow-lg hover:border-gray-200 transition-all group flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-100 text-accent flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Megaphone className="w-5 h-5" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-heading text-xl font-bold text-[#111827] mb-3 leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-4">
                    {notice.message}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase pt-6 border-t border-gray-200/50 mt-auto">
                  <CalendarDays className="w-3.5 h-3.5 text-accent" />
                  {dateStr}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
