"use client";

import { Megaphone } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAnnouncements, AnnouncementData } from "@/lib/api";

export default function RefereeNotices() {
  const [notices, setNotices] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await getAnnouncements();
        if (res.success && res.announcements) {
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

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm h-full flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">ANNOUNCEMENTS</h3>
        <Link href="/announcements" className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors">
          ALL NOTICES
        </Link>
      </div>

      {/* Notices List */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
            Loading announcements...
          </div>
        ) : notices.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No new announcements.
          </div>
        ) : (
          notices.map((notice, idx) => {
            const dateStr = new Date(notice.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            }).toUpperCase();

            return (
              <Link href="/announcements" key={notice.id} className={`flex gap-4 p-6 md:p-8 hover:bg-gray-50/50 cursor-pointer transition-colors ${idx < notices.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-orange-50 text-[#d97c55] flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-primary transition-colors">{notice.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    {notice.message}
                  </p>
                  <div className="text-[8px] font-bold tracking-widest text-[#d97c55] uppercase">
                    POSTED {dateStr}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
