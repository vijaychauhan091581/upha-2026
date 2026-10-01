"use client";

import React, { useEffect, useState } from "react";
import { getRefereeStats, RefereeBoardMember } from "@/lib/api";

const currentYear = new Date().getFullYear();
const session = `${currentYear}-${String(currentYear + 1).slice(2)}`;

export default function RefereeBoardSection() {
  const [boardMembers, setBoardMembers] = useState<RefereeBoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRefereeStats()
      .then((res) => {
        if (res && res.success && Array.isArray(res.board_members)) {
          setBoardMembers(res.board_members);
        } else {
          setBoardMembers([]);
        }
      })
      .catch(() => {
        setBoardMembers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const members = boardMembers || [];

  return (
    <div className="mb-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-12">
        <h2 className="font-heading text-4xl font-bold uppercase tracking-wide">
          REFEREE <span className="text-accent">BOARD</span>
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          OFFICIATING LEADERSHIP &middot; SESSION {session}
        </div>
      </div>

      {/* Board Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-sm p-6 flex items-center gap-6 animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-sm shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-12 text-center text-gray-400">
          <p className="text-sm font-medium">No referee board members configured yet.</p>
          <p className="text-xs mt-1">Add them via the Admin panel → Office Bearers with role &quot;Referee Board&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {members.map((member, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-sm p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-6 relative overflow-hidden group
                ${idx === 0 ? "border-[#d97c55]/30 hover:border-[#d97c55]/50" : "border-gray-200"}`}
            >
              {idx === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}

              <div className="w-24 h-24 bg-[#111827] flex items-center justify-center shrink-0 rounded-sm relative z-10">
                <span className="font-heading text-3xl font-bold text-white tracking-wider">{member.initials}</span>
              </div>

              <div className="relative z-10">
                <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">REFEREE BOARD</div>
                <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">{member.role.replace(/referee board\s*/i, "").trim() || member.role}</div>
                <h3 className="font-heading text-2xl font-bold uppercase text-primary">{member.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
