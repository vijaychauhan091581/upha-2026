"use client";

import React, { useEffect, useState } from "react";
import { MapPin, AlertCircle, Eye, X, ShieldCheck, Lock, Award } from "lucide-react";
import { listCoaches, CoachData } from "@/lib/api";

function maskMobile(mobile?: string | null) {
  if (!mobile) return "Not Provided";
  const cleaned = mobile.replace(/\D/g, "");
  if (cleaned.length >= 4) {
    const last4 = cleaned.slice(-4);
    return `+91 •••••• ${last4}`;
  }
  return "••••••••••";
}

export default function CoachPanelGrid() {
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoach, setSelectedCoach] = useState<CoachData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listCoaches();
        if (res && res.success && Array.isArray(res.coaches)) {
          setCoaches(res.coaches.filter((c) => c && c.paid));
        } else {
          setError("Failed to load coaches.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching coaches.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCoaches = (coaches || []).filter((c) => {
    if (!c) return false;
    const name = c.user?.name || "";
    const district = c.district || "";
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || district.toLowerCase().includes(term);
  });

  return (
    <div className="mb-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-8">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-wide">
          THE <span className="text-accent">PANEL</span>
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          SHOWING <span className="text-gray-800">ALL {filteredCoaches.length}</span> REGISTERED COACHES
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-12 bg-white border border-gray-100 p-2 rounded-sm shadow-sm">
        <input
          type="text"
          placeholder="Search by coach name or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-gray-50 border-none px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 placeholder:text-gray-400 rounded-sm w-full"
        />
        <div className="hidden md:block shrink-0 px-6 py-3 border-l border-gray-100 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
          {filteredCoaches.length} COACHES
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-sm border border-red-100 flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredCoaches.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-12 text-center text-gray-500">
          <p className="text-lg">No accredited coaches found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCoaches.map((coach) => {
            const name = coach.user?.name || "Official Coach";
            const photoUrl = coach.user?.passport_image || coach.passport_image;
            const initials =
              name
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "CH";

            return (
              <div
                key={coach.id}
                className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full overflow-hidden"
              >
                {/* Top Photo / Dark Graphic */}
                <div className="h-72 bg-[#111827] flex items-center justify-center relative overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="font-heading text-6xl font-bold text-white tracking-wider z-10 group-hover:scale-110 transition-transform duration-500">
                      {initials}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-[#111827]/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10">
                    UPHA-CCH-{coach.id.toString().padStart(4, "0")}
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold uppercase text-primary mb-1 line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 uppercase">
                      Role:{" "}
                      <span className="font-semibold text-gray-700">
                        {coach.occupation || coach.highest_coaching_grade || "Certified Coach"}
                      </span>
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-accent uppercase mb-4">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{coach.district || "Uttar Pradesh"}</span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedCoach(coach)}
                    className="w-full py-2 px-3 bg-[#111827] hover:bg-[#d97c55] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COACH PROFILE MODAL (Matches Referee Modal) */}
      {selectedCoach && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCoach(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#111827] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d97c55]" />
                <span className="font-heading font-bold text-sm tracking-widest uppercase">
                  Accredited Coach Identity Card
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoach(null)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6 pb-6 border-b border-gray-100">
                {/* Photo */}
                <div className="w-32 h-40 rounded-lg border-2 border-[#d97c55] overflow-hidden bg-gray-100 shadow-md shrink-0 flex items-center justify-center">
                  {selectedCoach.user?.passport_image || selectedCoach.passport_image ? (
                    <img
                      src={selectedCoach.user?.passport_image || selectedCoach.passport_image || ""}
                      alt={selectedCoach.user?.name || "Coach"}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111827] text-white flex items-center justify-center font-heading text-2xl font-bold">
                      {(selectedCoach.user?.name || "CH").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <span className="inline-block bg-[#111827] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    UPHA-CCH-{selectedCoach.id.toString().padStart(4, "0")}
                  </span>
                  <h3 className="font-heading text-xl font-bold uppercase text-[#111827]">
                    {selectedCoach.user?.name}
                  </h3>
                  <p className="text-xs text-[#d97c55] font-bold flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedCoach.district || "Uttar Pradesh"} District
                  </p>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                      <ShieldCheck className="w-3 h-3" /> OFFICIAL ACCREDITED COACH
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">
                    Coaching Role
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {selectedCoach.occupation || "State Handball Coach"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">
                    Place / District
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {selectedCoach.district || "Uttar Pradesh"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">
                    Gender
                  </span>
                  <span className="text-gray-800 font-semibold capitalize">
                    {selectedCoach.user?.gender || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">
                    Date of Birth
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {selectedCoach.user?.date_of_birth || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">
                    Father's Name
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {selectedCoach.user?.father_name || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">
                    Mobile / Contact
                  </span>
                  <span className="text-gray-700 font-mono font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#d97c55]" />
                    {maskMobile(selectedCoach.user?.mobile || selectedCoach.user?.phone_number)}
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Hidden for privacy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
