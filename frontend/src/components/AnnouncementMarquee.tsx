"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, Bell } from "lucide-react";
import { getAnnouncements, AnnouncementData } from "@/lib/api";

export default function AnnouncementMarquee() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchNotices() {
      try {
        const res = await getAnnouncements();
        if (isMounted && res && res.success && res.announcements && res.announcements.length > 0) {
          setAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn("Announcement marquee fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || announcements.length === 0) {
    return null;
  }

  // Duplicate items for continuous smooth seamless loop
  const marqueeItems = [...announcements, ...announcements];

  return (
    <div className="w-full bg-[#111827] border-b border-white/10 text-white relative z-20 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center h-10 sm:h-11 px-3 sm:px-6">
        
        {/* Fixed Left Badge */}
        <div className="shrink-0 flex items-center gap-2 bg-[#d97c55] text-white px-2.5 sm:px-3 py-1 rounded-sm text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shadow-sm z-10 mr-3 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <Megaphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ANNOUNCEMENTS</span>
          <span className="sm:hidden">NOTICES</span>
        </div>

        {/* Scrolling Marquee Container */}
        <div className="flex-1 overflow-hidden relative group cursor-pointer mask-gradient">
          <div className="animate-marquee py-1">
            {marqueeItems.map((item, idx) => {
              const formattedDate = item.created_at
                ? new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })
                : null;

              return (
                <Link
                  key={`${item.id}-${idx}`}
                  href="/announcements"
                  className="inline-flex items-center gap-2.5 mx-6 text-xs text-gray-200 hover:text-accent transition-colors shrink-0"
                >
                  {formattedDate && (
                    <span className="bg-white/10 text-gray-300 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                      {formattedDate}
                    </span>
                  )}
                  <span className="font-bold text-white uppercase tracking-wide">
                    {item.title}
                  </span>
                  {item.message && (
                    <span className="text-gray-400 font-normal max-w-md truncate hidden md:inline">
                      &mdash; {item.message}
                    </span>
                  )}
                  <span className="text-accent/60 font-bold ml-2">•</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Fixed Right CTA Link */}
        <div className="shrink-0 pl-3 z-10 hidden sm:flex items-center">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
