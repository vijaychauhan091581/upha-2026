"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Search, AlertCircle, Phone, Eye, X, MapPin, Building, Lock, CheckCircle2, User } from "lucide-react";
import { listAcademies, AcademyData } from "@/lib/api";

function maskPhone(phone?: string | null) {
  if (!phone) return "Not Provided";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 4) {
    const last4 = cleaned.slice(-4);
    return `+91 •••••• ${last4}`;
  }
  return "••••••••••";
}

export default function AcademiesDatabasePage() {
  const [academies, setAcademies] = useState<AcademyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcademy, setSelectedAcademy] = useState<AcademyData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listAcademies();
        if (res.success) {
          // Only show approved/paid academies
          setAcademies(res.academies.filter((a) => a.paid));
        } else {
          setError("Failed to load academies.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching academies.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAcademies = academies.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#fcfbf9] text-[#111827] flex flex-col py-16">
      <div className="max-w-6xl w-full mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d97c55]/10 text-[#d97c55] text-xs font-bold tracking-widest uppercase rounded-full mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              UPHA Official Training Centers
            </div>
            <h1 className="text-4xl font-heading font-black uppercase tracking-wider text-[#111827]">
              Academies Database
            </h1>
            <p className="text-gray-500 text-base mt-1">
              Official roster of affiliated handball academies and grassroots training centres in Uttar Pradesh.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/database"
              className="border border-gray-300 text-gray-700 px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors rounded-sm shadow-sm text-center"
            >
              &larr; Back
            </Link>
            <Link
              href="/register/academy"
              className="bg-[#d97c55] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-[#c16744] transition-colors rounded-sm shadow-md text-center"
            >
              Register Academy
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-5 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by academy name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] transition-colors text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 bg-white border border-gray-200 rounded-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#d97c55]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-sm border border-red-100 flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
            <p className="font-bold">{error}</p>
          </div>
        ) : filteredAcademies.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-sm p-16 text-center text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-heading text-lg font-bold uppercase text-gray-700">No academies found</h3>
            <p className="text-sm text-gray-500 mt-1">No registered academies match your criteria.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111827] text-white">
                    <th className="py-4 px-4 font-bold uppercase tracking-wider text-[11px] w-28 text-center">LOGO</th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">ACADEMY NAME & ID</th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">DISTRICT</th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">ESTABLISHED</th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">PLAYERS</th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">HEAD COACH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAcademies.map((academy) => {
                    const initials = academy.name
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "AC";

                    return (
                      <tr key={academy.id} className="hover:bg-[#fcfbf9] transition-colors group">
                        {/* 1. LOGO & VIEW BUTTON */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shadow-xs">
                              {academy.logo ? (
                                <img
                                  src={academy.logo}
                                  alt={academy.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#111827] text-white flex items-center justify-center font-heading text-xs font-bold">
                                  {initials}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedAcademy(academy)}
                              className="mt-2 inline-flex items-center justify-center gap-1 w-full max-w-[90px] px-2 py-1 text-[10px] font-bold text-[#d97c55] bg-[#d97c55]/10 hover:bg-[#d97c55] hover:text-white rounded transition-colors shadow-xs"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Profile</span>
                            </button>
                          </div>
                        </td>

                        {/* 2. NAME & ID */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-sm text-[#111827] group-hover:text-[#d97c55] transition-colors">
                            {academy.name}
                          </div>
                          <div className="font-mono text-xs font-bold text-gray-400 mt-0.5">
                            UPHA-A-{academy.id.toString().padStart(4, "0")}
                          </div>
                        </td>

                        {/* 3. DISTRICT */}
                        <td className="py-4 px-5">
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded">
                            <MapPin className="w-3 h-3 text-[#d97c55] shrink-0" />
                            <span>{academy.district || "Uttar Pradesh"}</span>
                          </div>
                        </td>

                        {/* 4. ESTABLISHED */}
                        <td className="py-4 px-5 text-xs text-gray-600 font-medium">
                          {academy.year_of_establishment ? `Est. ${academy.year_of_establishment}` : "—"}
                        </td>

                        {/* 5. PLAYERS */}
                        <td className="py-4 px-5 text-xs font-bold text-gray-800">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {academy.no_of_players || 0} Athletes
                          </span>
                        </td>

                        {/* 6. HEAD COACH */}
                        <td className="py-4 px-5 text-xs text-gray-600">
                          {academy.coach_name ? (
                            <div>
                              <span className="font-bold text-gray-800">{academy.coach_name}</span>
                              {academy.coach_experience ? (
                                <div className="text-[10px] text-gray-400">{academy.coach_experience} yrs experience</div>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACADEMY PROFILE MODAL */}
        {selectedAcademy && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedAcademy(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#111827] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#d97c55]" />
                  <span className="font-heading font-bold text-sm tracking-widest uppercase">
                    Academy Official Profile
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAcademy(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6 pb-6 border-b border-gray-100">
                  {/* Logo */}
                  <div className="w-24 h-24 rounded-lg border-2 border-[#d97c55] overflow-hidden bg-gray-100 shadow-md shrink-0 flex items-center justify-center">
                    {selectedAcademy.logo ? (
                      <img
                        src={selectedAcademy.logo}
                        alt={selectedAcademy.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111827] text-white flex items-center justify-center font-heading text-2xl font-bold">
                        {selectedAcademy.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <span className="inline-block bg-[#111827] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      UPHA-A-{selectedAcademy.id.toString().padStart(4, "0")}
                    </span>
                    <h3 className="font-heading text-xl font-bold uppercase text-[#111827]">
                      {selectedAcademy.name}
                    </h3>
                    <p className="text-xs text-[#d97c55] font-bold flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedAcademy.district} District
                    </p>

                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                        <CheckCircle2 className="w-3 h-3" /> OFFICIAL RECOGNIZED ACADEMY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Established</span>
                    <span className="text-gray-800 font-semibold">{selectedAcademy.year_of_establishment || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Registered Athletes</span>
                    <span className="text-gray-800 font-semibold">{selectedAcademy.no_of_players || 0} Players</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Head Coach</span>
                    <span className="text-gray-800 font-semibold">{selectedAcademy.coach_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Training Venue</span>
                    <span className="text-gray-800 font-semibold">{selectedAcademy.training_venue || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Office Address</span>
                    <span className="text-gray-800 font-semibold">{selectedAcademy.office_address || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Contact Phone</span>
                    <span className="text-gray-700 font-mono font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#d97c55]" />
                      {maskPhone(selectedAcademy.office_phone_number)}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Hidden for privacy</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Coach Mobile</span>
                    <span className="text-gray-700 font-mono font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#d97c55]" />
                      {maskPhone(selectedAcademy.coach_mobile)}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Hidden for privacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
