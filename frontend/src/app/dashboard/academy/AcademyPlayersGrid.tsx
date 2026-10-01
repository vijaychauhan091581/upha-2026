"use client";
import { Plus, User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMyAcademyPlayers, PlayerData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AcademyPlayersGrid() {
  const { authUser } = useAuth();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;
    async function fetchMyPlayers() {
      try {
        const res = await getMyAcademyPlayers();
        if (res.success && res.players) {
          setPlayers(res.players);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load players";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPlayers();
  }, [authUser]);

  const HAND_COLORS: Record<string, string> = {
    right: "text-emerald-600",
    left: "text-blue-600",
    both: "text-purple-600",
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <div>
          <h3 className="font-heading text-xl font-bold uppercase text-primary">OUR PLAYERS</h3>
          {!loading && !error && (
            <p className="text-xs text-gray-500 mt-1">{players.length} registered player{players.length !== 1 ? "s" : ""}</p>
          )}
        </div>
        <Link
          href="/register/player"
          className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:text-primary transition-colors"
        >
          <Plus className="w-3 h-3" /> ADD PLAYER
        </Link>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-100 bg-gray-50 p-4 rounded-sm animate-pulse h-20" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-8">{error}</div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <User2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No players yet</p>
            <p className="text-xs text-gray-400">Players registered under this academy will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {players.map((player) => {
              const initials = player.user.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "PL";
              const handColor = HAND_COLORS[player.dominant_hand?.toLowerCase()] || "text-gray-600";
              return (
                <div
                  key={player.id}
                  className="border border-gray-100 bg-[#f9fafb] p-4 rounded-sm flex items-start gap-3 hover:border-gray-200 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center shrink-0 shadow-inner mt-0.5 group-hover:bg-[#1f2937] transition-colors">
                    <span className="font-heading text-sm font-bold text-white tracking-wider">{initials}</span>
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-800 truncate">{player.user.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-wider truncate mt-0.5">
                      PLR-2026-{String(player.id).padStart(5, "0")}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                        {player.district || "—"}
                      </span>
                      {player.dominant_hand && (
                        <span className={`text-[9px] font-bold tracking-widest uppercase ${handColor}`}>
                          {player.dominant_hand} hand
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold tracking-widest uppercase ${
                          player.paid ? "text-emerald-600" : "text-[#d97c55]"
                        }`}
                      >
                        {player.paid ? "ACTIVE" : "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Player Action */}
        <div className="border-t border-gray-100 pt-6 flex justify-center">
          <Link
            href="/register/player"
            className="border border-[#d97c55]/30 bg-[#d97c55]/5 hover:bg-[#d97c55]/10 text-accent font-bold tracking-widest uppercase text-[10px] py-4 px-8 rounded-sm flex items-center gap-2 transition-colors w-full md:w-auto md:min-w-[300px] justify-center"
          >
            <Plus className="w-4 h-4" /> REGISTER A NEW PLAYER
          </Link>
        </div>
      </div>
    </div>
  );
}
