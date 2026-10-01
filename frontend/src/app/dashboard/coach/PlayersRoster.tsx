"use client";

import React, { useEffect, useState } from "react";
import { listPlayers, PlayerData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function PlayersRoster() {
  const { authUser } = useAuth();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyPlayers() {
      if (!authUser?.name) return;
      try {
        const res = await listPlayers();
        if (res.success && res.players) {
          // Filter players whose coach matches the current coach's name exactly
          const myPlayers = res.players.filter(p => p.coach_name?.toLowerCase() === authUser.name.toLowerCase());
          setPlayers(myPlayers);
        }
      } catch (error) {
        console.error("Failed to load players roster:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPlayers();
  }, [authUser?.name]);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">PLAYERS I COACH</h3>
        <button className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors">
          {players.length > 0 ? `VIEW ALL ${players.length} ⇗` : "VIEW ALL"}
        </button>
      </div>

      {/* Roster List */}
      <div className="flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
            Loading roster...
          </div>
        ) : players.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No players assigned yet.
          </div>
        ) : (
          players.map((player) => {
            const initials = player.user.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "PL";
            return (
              <div key={player.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 border-b border-gray-50 hover:bg-gray-50/50 transition-colors gap-6">
                
                {/* Player Info */}
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className={`w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center shrink-0 shadow-inner`}>
                    <span className="font-heading text-sm font-bold text-white">{initials}</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-800">{player.user.name}</div>
                    <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">
                      PLR-2026-{String(player.id).padStart(5, "0")}
                    </div>
                  </div>
                </div>

                {/* District */}
                <div className="flex-1 md:text-center w-full md:w-auto">
                  <div className="text-[10px] font-bold tracking-widest text-gray-600 uppercase font-mono">{player.district || "Unknown District"}</div>
                </div>

                {/* Club */}
                <div className="flex-1 md:text-center w-full md:w-auto">
                  <div className="text-sm text-gray-600">{player.club_name || "-"}</div>
                </div>

                {/* Status */}
                <div className="shrink-0 w-full md:w-auto flex md:justify-end">
                  <div className={`border px-3 py-1.5 rounded-sm flex items-center gap-1.5 ${player.paid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${player.paid ? "bg-emerald-500" : "bg-orange-500"}`}></span>
                    <span className="text-[9px] font-bold tracking-widest uppercase">{player.paid ? "ACTIVE" : "PENDING"}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
