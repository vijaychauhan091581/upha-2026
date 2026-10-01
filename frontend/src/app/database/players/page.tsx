"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  AlertCircle,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Filter,
  Eye,
  ShieldCheck,
  UserCheck,
  Lock,
} from "lucide-react";
import { listPlayers, PlayerData } from "@/lib/api";

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

export default function PlayersDatabasePage() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listPlayers();
        if (res.success && Array.isArray(res.players)) {
          setPlayers(res.players);
        } else {
          setError("Failed to load players.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching players.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Distinct districts for dropdown
  const districts = useMemo(() => {
    const set = new Set<string>();
    players.forEach((p) => {
      if (p.district) set.add(p.district.trim());
    });
    return Array.from(set).sort();
  }, [players]);

  // Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      // Status filter
      if (statusFilter === "VERIFIED" && !p.paid) return false;
      if (statusFilter === "PENDING" && p.paid) return false;

      // District filter
      if (districtFilter !== "ALL" && p.district?.toLowerCase() !== districtFilter.toLowerCase()) {
        return false;
      }

      // Search term
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase().trim();
      const name = p.user?.name?.toLowerCase() || "";
      const district = p.district?.toLowerCase() || "";
      const club = p.club_name?.toLowerCase() || "";
      const school = p.school_name?.toLowerCase() || "";
      const coach = p.coach_name?.toLowerCase() || "";
      const aadhar = (p.user?.adhar_number || p.adhar_number || "").replace(/\s+/g, "").toLowerCase();
      const playerId = `upha-p-${p.id.toString().padStart(4, "0")}`.toLowerCase();

      return (
        name.includes(term) ||
        district.includes(term) ||
        club.includes(term) ||
        school.includes(term) ||
        coach.includes(term) ||
        aadhar.includes(term.replace(/\s+/g, "")) ||
        playerId.includes(term)
      );
    });
  }, [players, statusFilter, districtFilter, searchTerm]);

  // Summary stats
  const totalCount = players.length;
  const verifiedCount = players.filter((p) => p.paid).length;
  const pendingCount = totalCount - verifiedCount;

  return (
    <div className="flex-1 bg-[#fcfbf9] text-[#111827] flex flex-col py-12">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-gray-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d97c55]/10 text-[#d97c55] text-xs font-bold tracking-widest uppercase rounded-full mb-3">
              <Users className="w-3.5 h-3.5" />
              UPHA Official Registry
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-wider text-[#111827]">
              Players Database
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Official roster of registered and approved handball athletes in Uttar Pradesh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/database"
              className="border border-gray-300 text-gray-700 px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors rounded-sm shadow-sm"
            >
              &larr; Back
            </Link>
            <Link
              href="/register/player"
              className="bg-[#d97c55] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-[#c16744] transition-colors rounded-sm shadow-sm flex items-center gap-1.5"
            >
              <span>Register as Player</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Total Registered</div>
            <div className="text-2xl font-black text-[#111827] mt-0.5">{totalCount}</div>
          </div>
          <div className="bg-white p-4 border border-emerald-200 rounded-sm shadow-sm">
            <div className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified (Paid)
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{verifiedCount}</div>
          </div>
          <div className="bg-white p-4 border border-amber-200 rounded-sm shadow-sm">
            <div className="text-[10px] font-bold tracking-widest uppercase text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending Review
            </div>
            <div className="text-2xl font-black text-amber-700 mt-0.5">{pendingCount}</div>
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Districts</div>
            <div className="text-2xl font-black text-[#111827] mt-0.5">{districts.length}</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-5 mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by player name, Aadhar number, district, club, school, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] transition-colors text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* District Filter Dropdown */}
              <div className="flex items-center gap-1.5 border border-gray-200 rounded px-2.5 py-1.5 bg-[#fcfbf9]">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Districts ({districts.length})</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex border border-gray-200 rounded overflow-hidden p-0.5 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    statusFilter === "ALL"
                      ? "bg-white text-[#111827] shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("VERIFIED")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    statusFilter === "VERIFIED"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Verified ({verifiedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("PENDING")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                    statusFilter === "PENDING"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Pending ({pendingCount})
                </button>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              Showing <strong>{filteredPlayers.length}</strong> of <strong>{players.length}</strong> players
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-[#d97c55] hover:underline font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#d97c55] mb-4"></div>
            <p className="text-sm font-semibold text-gray-500">Loading players roster...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-sm border border-red-200 flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
            <p className="font-bold text-base">{error}</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-sm p-16 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-heading text-lg font-bold uppercase text-gray-700">No players found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              No registered athletes match your search or filter criteria. Try adjusting your query or filter.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111827] text-white">
                    <th className="py-4 px-4 font-bold uppercase tracking-wider text-[11px] w-28 text-center">
                      PHOTO
                    </th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">
                      ID &amp; AADHAR NO.
                    </th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">
                      PLAYER NAME
                    </th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">
                      DISTRICT
                    </th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">
                      CLUB / SCHOOL
                    </th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px]">
                      COACH &amp; STATS
                    </th>
                    <th className="py-4 px-5 font-bold uppercase tracking-wider text-[11px] text-center">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlayers.map((player) => {
                    const photoUrl = player.user?.passport_image || player.passport_image;
                    const aadharNum = player.user?.adhar_number || player.adhar_number;
                    const aadharScan = player.user?.adhar_image || player.adhar_image;
                    const initials = (player.user?.name || "Player")
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "PL";

                    return (
                      <tr key={player.id} className="hover:bg-[#fcfbf9] transition-colors group">
                        
                        {/* 1. PHOTO */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setSelectedPlayer(player)}
                              className="relative w-12 h-14 rounded-md border border-gray-200 overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center cursor-pointer group-hover:border-[#d97c55] group-hover:ring-2 group-hover:ring-[#d97c55]/20 transition-all"
                              title="Click to view full photo & profile"
                            >
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={player.user?.name || "Player"}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#111827] text-white flex items-center justify-center font-heading text-xs font-bold tracking-wider">
                                  {initials}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-4 h-4 drop-shadow" />
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedPlayer(player)}
                              className="mt-2 inline-flex items-center justify-center gap-1 w-full max-w-[90px] px-2 py-1 text-[10px] font-bold text-[#d97c55] bg-[#d97c55]/10 hover:bg-[#d97c55] hover:text-white rounded transition-colors shadow-xs"
                              title="View Full Profile"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Profile</span>
                            </button>
                          </div>
                        </td>

                        {/* 2. ID & AADHAR */}
                        <td className="py-3 px-5">
                          <div className="font-mono text-xs font-bold text-[#111827] whitespace-nowrap">
                            UPHA-P-{player.id.toString().padStart(4, "0")}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider">
                              <CreditCard className="w-3 h-3 text-[#d97c55]" />
                              {formatAadhar(aadharNum)}
                            </span>
                          </div>
                          {aadharScan && (
                            <a
                              href={aadharScan}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-[#d97c55] hover:underline mt-1 font-semibold"
                            >
                              <span>Aadhar Card</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>

                        {/* 3. NAME & DETAILS */}
                        <td className="py-3 px-5">
                          <div className="font-bold text-sm text-[#111827] group-hover:text-[#d97c55] transition-colors">
                            {player.user?.name || "Unknown Player"}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                            {player.user?.gender && (
                              <span className="capitalize">{player.user.gender}</span>
                            )}
                            {player.user?.date_of_birth && (
                              <>
                                <span>&middot;</span>
                                <span>DOB: {player.user.date_of_birth}</span>
                              </>
                            )}
                            {player.dominant_hand && (
                              <>
                                <span>&middot;</span>
                                <span className="capitalize">{player.dominant_hand} hand</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* 4. DISTRICT */}
                        <td className="py-3 px-5">
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded">
                            <MapPin className="w-3 h-3 text-[#d97c55] shrink-0" />
                            <span>{player.district || "Uttar Pradesh"}</span>
                          </div>
                        </td>

                        {/* 5. CLUB / SCHOOL */}
                        <td className="py-3 px-5">
                          <div className="text-xs text-gray-800 font-medium">
                            {player.club_name || "—"}
                          </div>
                          {player.school_name && (
                            <div className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[200px]" title={player.school_name}>
                              {player.school_name}
                            </div>
                          )}
                        </td>

                        {/* 6. COACH & STATS */}
                        <td className="py-3 px-5 text-xs text-gray-600">
                          {player.coach_name && (
                            <div className="font-medium text-gray-800">
                              Coach: {player.coach_name}
                            </div>
                          )}
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                            {player.height ? `${player.height} cm` : "—"} &middot; {player.weight ? `${player.weight} kg` : "—"}
                          </div>
                        </td>

                        {/* 7. STATUS */}
                        <td className="py-3 px-5 text-center">
                          {player.paid ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                              <ShieldCheck className="w-3 h-3" />
                              VERIFIED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                              <Clock className="w-3 h-3" />
                              PENDING
                            </span>
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
      </div>

      {/* LIGHTBOX / FULL PLAYER DETAIL MODAL */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#111827] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#d97c55]" />
                <span className="font-heading font-bold text-sm tracking-widest uppercase">
                  Player Identity Card
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlayer(null)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6 pb-6 border-b border-gray-100">
                
                {/* Large Passport Photo */}
                <div className="w-32 h-40 rounded-lg border-2 border-[#d97c55] overflow-hidden bg-gray-100 shadow-md shrink-0 flex items-center justify-center">
                  {(selectedPlayer.user?.passport_image || selectedPlayer.passport_image) ? (
                    <img
                      src={selectedPlayer.user?.passport_image || selectedPlayer.passport_image || ""}
                      alt={selectedPlayer.user?.name || "Player"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111827] text-white flex items-center justify-center font-heading text-2xl font-bold">
                      {(selectedPlayer.user?.name || "PL").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Main Details */}
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <span className="inline-block bg-[#111827] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    UPHA-P-{selectedPlayer.id.toString().padStart(4, "0")}
                  </span>
                  <h3 className="font-heading text-xl font-bold uppercase text-[#111827]">
                    {selectedPlayer.user?.name}
                  </h3>
                  <p className="text-xs text-[#d97c55] font-bold flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedPlayer.district} District
                  </p>

                  {/* Aadhar Highlight */}
                  <div className="pt-2">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                      Aadhar Card Number
                    </div>
                    <div className="text-sm font-mono font-bold text-gray-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded inline-block mt-0.5">
                      {formatAadhar(selectedPlayer.user?.adhar_number || selectedPlayer.adhar_number)}
                    </div>
                  </div>

                  <div className="pt-1">
                    {selectedPlayer.paid ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED ATHLETE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                        <Clock className="w-3 h-3" /> PENDING VERIFICATION
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid of Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Date of Birth</span>
                  <span className="text-gray-800 font-semibold">{selectedPlayer.user?.date_of_birth || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Gender</span>
                  <span className="text-gray-800 font-semibold capitalize">{selectedPlayer.user?.gender || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Father's Name</span>
                  <span className="text-gray-800 font-semibold">{selectedPlayer.user?.father_name || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Blood Group</span>
                  <span className="text-gray-800 font-semibold">{selectedPlayer.user?.blood_group || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Club / Academy</span>
                  <span className="text-gray-800 font-semibold">{selectedPlayer.club_name || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">School / College</span>
                  <span className="text-gray-800 font-semibold">{selectedPlayer.school_name || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Height &amp; Weight</span>
                  <span className="text-gray-800 font-semibold font-mono">
                    {selectedPlayer.height ? `${selectedPlayer.height} cm` : "—"} / {selectedPlayer.weight ? `${selectedPlayer.weight} kg` : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Playing Hand</span>
                  <span className="text-gray-800 font-semibold capitalize">{selectedPlayer.dominant_hand || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Mobile / Contact</span>
                  <span className="text-gray-700 font-mono font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#d97c55]" />
                    {maskMobile(selectedPlayer.user?.mobile || selectedPlayer.user?.phone_number)}
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Hidden for privacy</span>
                </div>
              </div>

              {/* Aadhar Document Button */}
              {(selectedPlayer.user?.adhar_image || selectedPlayer.adhar_image) && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <a
                    href={selectedPlayer.user?.adhar_image || selectedPlayer.adhar_image || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#111827] px-4 py-2 rounded text-xs font-bold tracking-widest uppercase transition-colors"
                  >
                    <span>View Aadhar Card Scan</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d97c55]" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
