"use client";

import React, { useEffect, useState } from "react";
import { MapPin, AlertCircle, Eye, X, ShieldCheck, Lock, UserCheck, CreditCard } from "lucide-react";
import { listReferees, RefereeData } from "@/lib/api";

function maskMobile(mobile?: string | null) {
  if (!mobile) return "Not Provided";
  const cleaned = mobile.replace(/\D/g, "");
  if (cleaned.length >= 4) {
    const last4 = cleaned.slice(-4);
    return `+91 •••••• ${last4}`;
  }
  return "••••••••••";
}

function formatAadhar(num?: string | null) {
  if (!num) return "—";
  const clean = num.replace(/\s+/g, "");
  if (clean.length === 12) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`;
  }
  return num;
}

export default function RefereePanelGrid() {
  const [referees, setReferees] = useState<RefereeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReferee, setSelectedReferee] = useState<RefereeData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listReferees();
        if (res && res.success && Array.isArray(res.referees)) {
          setReferees(res.referees.filter((r) => r && r.paid));
        } else {
          setError("Failed to load referees.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching referees.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredReferees = (referees || []).filter((r) => {
    if (!r) return false;
    const name = r.user?.name || "";
    const district = r.district || "";
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
          SHOWING <span className="text-gray-800">ALL {filteredReferees.length}</span> REGISTERED REFEREES
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-12 bg-white border border-gray-100 p-2 rounded-sm shadow-sm">
        <input
          type="text"
          placeholder="Search by referee name or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-gray-50 border-none px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 placeholder:text-gray-400 rounded-sm w-full"
        />
        <div className="hidden md:block shrink-0 px-6 py-3 border-l border-gray-100 text-[9px] font-bold tracking-widest text-gray-500 uppercase">
          {filteredReferees.length} REFEREES
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
      ) : filteredReferees.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-12 text-center text-gray-500">
          <p className="text-lg">No approved referees found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredReferees.map((referee) => {
            const name = referee.user?.name || "Official";
            const photoUrl = referee.user?.passport_image || referee.passport_image;
            const initials = name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase() || "RF";

            return (
              <div
                key={referee.id}
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
                    UPHA-REF-{referee.id.toString().padStart(4, "0")}
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold uppercase text-primary mb-1 line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 uppercase">
                      Grade: <span className="font-semibold text-gray-700">{referee.grade_applying_for || "Accredited"}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-accent uppercase mb-4">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{referee.district || "Uttar Pradesh"}</span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedReferee(referee)}
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

      {/* REFEREE PROFILE MODAL */}
      {selectedReferee && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedReferee(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#111827] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#d97c55]" />
                <span className="font-heading font-bold text-sm tracking-widest uppercase">
                  Match Official Identity Card
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReferee(null)}
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
                  {(selectedReferee.user?.passport_image || selectedReferee.passport_image) ? (
                    <img
                      src={selectedReferee.user?.passport_image || selectedReferee.passport_image || ""}
                      alt={selectedReferee.user?.name || "Referee"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111827] text-white flex items-center justify-center font-heading text-2xl font-bold">
                      {(selectedReferee.user?.name || "RF").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <span className="inline-block bg-[#111827] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    UPHA-REF-{selectedReferee.id.toString().padStart(4, "0")}
                  </span>
                  <h3 className="font-heading text-xl font-bold uppercase text-[#111827]">
                    {selectedReferee.user?.name}
                  </h3>
                  <p className="text-xs text-[#d97c55] font-bold flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedReferee.district || "Uttar Pradesh"} District
                  </p>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                      <ShieldCheck className="w-3 h-3" /> OFFICIAL ACCREDITED REFEREE
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Grade / Level</span>
                  <span className="text-gray-800 font-semibold">{selectedReferee.grade_applying_for || "Accredited State Referee"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Gender</span>
                  <span className="text-gray-800 font-semibold capitalize">{selectedReferee.user?.gender || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Date of Birth</span>
                  <span className="text-gray-800 font-semibold">{selectedReferee.user?.date_of_birth || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Father's Name</span>
                  <span className="text-gray-800 font-semibold">{selectedReferee.user?.father_name || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Aadhar No.</span>
                  <span className="text-gray-800 font-semibold font-mono">
                    {formatAadhar(selectedReferee.user?.adhar_number || selectedReferee.adhar_number)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Mobile / Contact</span>
                  <span className="text-gray-700 font-mono font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#d97c55]" />
                    {maskMobile(selectedReferee.user?.mobile || selectedReferee.user?.phone_number)}
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
