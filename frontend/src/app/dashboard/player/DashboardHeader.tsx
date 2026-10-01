"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { PlayerData } from "@/lib/api";

export default function DashboardHeader() {
  const { authUser, meData, loading } = useAuth();

  const player = meData as PlayerData | null;
  const firstName = authUser?.name?.split(" ")[0]?.toUpperCase() ?? "—";
  const today = new Date();
  const dayName = today.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const createdAt = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }).toUpperCase()
    : null;

  if (loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-16 bg-gray-100 rounded-sm mb-8" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Welcome Title area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">PLAYER DASHBOARD</div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide text-primary">
            WELCOME BACK, <span className="text-accent">{firstName}</span>
          </h1>
        </div>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-4 md:mt-0 md:text-right">
          {dayName}<br />
          <span className="text-gray-800">{dateStr}</span>
        </div>
      </div>

      {/* Status Cards Grid - adjusted cols based on available items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Membership Status */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 flex flex-col justify-center">
          <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">MEMBERSHIP STATUS</div>
          <div className={`font-heading text-2xl font-bold uppercase mb-1 ${player?.paid ? "text-emerald-600" : "text-orange-500"}`}>
            &bull; {player?.paid ? "ACTIVE" : "PENDING"}
          </div>
          <div className="text-[11px] text-gray-500">{player?.paid ? "Fee paid" : "Payment not verified"}</div>
        </div>

        {/* Player ID */}
        {player?.id ? (
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 flex flex-col justify-center">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">PLAYER ID</div>
            <div className="font-heading text-xl font-bold uppercase text-primary mb-1">
              PLR-{String(player.id).padStart(5, "0")}
            </div>
            <div className="text-[11px] text-gray-500">{player.district ?? "—"} District</div>
          </div>
        ) : null}

        {/* Member Since */}
        {createdAt ? (
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 flex flex-col justify-center">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">MEMBER SINCE</div>
            <div className="font-heading text-2xl font-bold uppercase text-primary mb-1">{createdAt}</div>
            <div className="text-[11px] text-gray-500">Registration date</div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
