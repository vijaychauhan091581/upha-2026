"use client";

import { Check, Plus } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { PlayerData } from "@/lib/api";

interface CheckItem {
  label: string;
  done: boolean;
}

export default function ProfileStatus() {
  const { authUser, meData, loading } = useAuth();
  const player = meData as PlayerData | null;

  const items: CheckItem[] = [
    { label: "Personal details", done: !!(authUser?.name && authUser?.email) },
    { label: "Aadhar verified", done: !!(authUser?.adhar_number) },
    { label: "Passport photo", done: !!(authUser?.passport_image) },
    { label: "Annual fee paid", done: !!(player?.paid) },
    { label: "Sport profile (club/coach)", done: !!(player?.club_name && player?.coach_name) },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 animate-pulse">
        <div className="h-6 bg-gray-100 rounded mb-4 w-40" />
        <div className="h-16 bg-gray-100 rounded mb-8" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 rounded mb-3" />
        ))}
      </div>
    );
  }

  // Build the circle stroke-dasharray
  const circumference = 100;
  const dash = `${pct}, ${circumference}`;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 h-full flex flex-col">

      <div className="mb-6">
        <h3 className="font-heading text-xl font-bold uppercase text-primary mb-1">PROFILE STATUS</h3>
        <p className="text-xs text-gray-500">Complete your profile to unlock event registration.</p>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#d97c55"
              strokeWidth="3"
              strokeDasharray={dash}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-lg font-bold text-primary">{pct}%</span>
          </div>
        </div>
        <div>
          <div className="font-bold text-sm text-gray-800 mb-1">
            {pct === 100 ? "Profile complete!" : "Almost there"}
          </div>
          <div className="text-xs text-gray-500">
            {items.length - doneCount} item{items.length - doneCount !== 1 ? "s" : ""} remaining
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 flex flex-col gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between ${i < items.length - 1 ? "border-b border-gray-100 pb-3" : "pt-1"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? "bg-emerald-100" : "bg-orange-100"}`}>
                {item.done
                  ? <Check className="w-2.5 h-2.5 text-emerald-600" />
                  : <Plus className="w-3 h-3 text-accent" />
                }
              </div>
              <span className={`text-sm ${item.done ? "text-gray-600" : "font-medium text-gray-800"}`}>{item.label}</span>
            </div>
            <span className={`text-[9px] font-bold tracking-widest uppercase ${item.done ? "text-emerald-600" : "text-accent"}`}>
              {item.done ? "DONE" : "PENDING"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
