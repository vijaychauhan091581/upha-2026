"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { PlayerData } from "@/lib/api";

export default function ProfileSummary() {
  const { authUser, meData, loading } = useAuth();
  const player = meData as PlayerData | null;

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm animate-pulse">
        <div className="p-8 border-b border-gray-100 h-16 bg-gray-50" />
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="p-8 h-20 bg-gray-50" />
          ))}
        </div>
      </div>
    );
  }

  const fmt = (v: string | number | null | undefined, fallback = "—") =>
    v ? String(v) : fallback;

  const dob = authUser?.date_of_birth
    ? new Date(authUser.date_of_birth).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">

      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">PROFILE SUMMARY</h3>
        <button className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors">
          EDIT PROFILE
        </button>
      </div>

      {/* Grid Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">

        {/* Row 1 */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">FULL NAME</div>
          <div className="text-sm font-medium text-gray-800">{fmt(authUser?.name)}</div>
        </div>
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">DATE OF BIRTH</div>
          <div className="text-sm font-medium text-gray-800">{dob}</div>
        </div>
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">GENDER</div>
          <div className="text-sm font-medium text-gray-800">{fmt(authUser?.gender)}</div>
        </div>

        {/* Row 2 */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">DISTRICT</div>
          <div className="text-sm font-medium text-gray-800">{fmt(player?.district)}</div>
        </div>
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">PLAYING HAND</div>
          <div className="text-sm font-medium text-gray-800 capitalize">{fmt(player?.dominant_hand)}</div>
        </div>
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">BLOOD GROUP</div>
          <div className="text-sm font-medium text-gray-800">{fmt(authUser?.blood_group)}</div>
        </div>

        {/* Row 3 */}
        <div className="p-6 md:p-8">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">MOBILE</div>
          <div className="text-sm font-medium text-gray-800">{authUser?.phone_number ? `+91 ${authUser.phone_number}` : "—"}</div>
        </div>
        <div className="p-6 md:p-8">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">CLUB / ACADEMY</div>
          {player?.club_name ? (
            <div className="text-sm font-medium text-gray-800">{player.club_name}</div>
          ) : (
            <div className="text-sm text-gray-400">Not yet provided</div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">COACH</div>
          {player?.coach_name ? (
            <div className="text-sm font-medium text-gray-800">{player.coach_name}</div>
          ) : (
            <div className="text-sm text-gray-400">Not yet provided</div>
          )}
        </div>

      </div>
    </div>
  );
}
