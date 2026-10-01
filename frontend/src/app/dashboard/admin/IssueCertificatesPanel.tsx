"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FileBadge,
  ChevronLeft,
  MapPin,
  Calendar,
  Search,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Users,
} from "lucide-react";
import {
  getEventParticipantsForCertificates,
  issueEventCertificates,
  searchPlayersForCert,
  EventWithCertData,
  IssuedCertEntry,
  CertificateType,
  CertificateAssignment,
  PlayerSearchResult,
  IssuedCertResult,
  SkippedCertResult,
} from "@/lib/api";

const CERT_TYPES: CertificateType[] = [
  "1st Position Certificate",
  "2nd Position Certificate",
  "3rd Position Certificate",
  "Runner-Up Certificate",
  "Participation Certificate",
];

interface PendingRow {
  player: PlayerSearchResult;
  certType: CertificateType;
}

type Step = "events" | "assign" | "result";

export default function IssueCertificatesPanel() {
  // ── Step router ─────────────────────────────────────────────
  const [step, setStep] = useState<Step>("events");

  // ── Step 1 state ─────────────────────────────────────────────
  const [events, setEvents] = useState<EventWithCertData[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // ── Step 2 state ─────────────────────────────────────────────
  const [selectedEvent, setSelectedEvent] = useState<EventWithCertData | null>(null);
  const [pendingRows, setPendingRows] = useState<PendingRow[]>([]);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSearchPlayer, setSelectedSearchPlayer] = useState<PlayerSearchResult | null>(null);
  const [selectedCertType, setSelectedCertType] = useState<CertificateType>("Participation Certificate");
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Issue
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  // ── Step 3 state ─────────────────────────────────────────────
  const [issuedResult, setIssuedResult] = useState<IssuedCertResult[]>([]);
  const [skippedResult, setSkippedResult] = useState<SkippedCertResult[]>([]);
  const [issuedCount, setIssuedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  // ── Load events ──────────────────────────────────────────────
  const loadEvents = useCallback(() => {
    setLoadingEvents(true);
    setEventsError(null);
    getEventParticipantsForCertificates()
      .then((res) => {
        if (res.success) setEvents(res.events);
        else setEventsError("Failed to load events.");
      })
      .catch((e) => setEventsError(e.message || "Error loading events."))
      .finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ── Live player search ───────────────────────────────────────
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchPlayersForCert(searchQuery.trim());
        if (res.success) {
          setSearchResults(res.players);
          setShowDropdown(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Already-issued player IDs for selected event ─────────────
  const alreadyIssuedIds = new Set(
    (selectedEvent?.issued_certs ?? []).map((c) => c.player_id).filter(Boolean)
  );

  // ── Handlers ─────────────────────────────────────────────────
  function handleSelectEvent(event: EventWithCertData) {
    setSelectedEvent(event);
    setPendingRows([]);
    setSearchQuery("");
    setSelectedSearchPlayer(null);
    setSelectedCertType("Participation Certificate");
    setIssueError(null);
    setStep("assign");
  }

  function handlePickSearchResult(player: PlayerSearchResult) {
    setSelectedSearchPlayer(player);
    setSearchQuery(player.name);
    setShowDropdown(false);
  }

  function handleAddToList() {
    if (!selectedSearchPlayer) return;
    // Prevent duplicate in pending list
    if (pendingRows.some((r) => r.player.id === selectedSearchPlayer.id)) {
      setIssueError(`${selectedSearchPlayer.name} is already in the list.`);
      return;
    }
    // Prevent adding already-issued player
    if (alreadyIssuedIds.has(selectedSearchPlayer.id)) {
      setIssueError(`${selectedSearchPlayer.name} already has a certificate for this event.`);
      return;
    }
    setIssueError(null);
    setPendingRows((prev) => [
      ...prev,
      { player: selectedSearchPlayer, certType: selectedCertType },
    ]);
    setSelectedSearchPlayer(null);
    setSearchQuery("");
    setSelectedCertType("Participation Certificate");
    setSearchResults([]);
  }

  function handleRemoveRow(playerId: number) {
    setPendingRows((prev) => prev.filter((r) => r.player.id !== playerId));
  }

  function handleChangeCertType(playerId: number, newType: CertificateType) {
    setPendingRows((prev) =>
      prev.map((r) => (r.player.id === playerId ? { ...r, certType: newType } : r))
    );
  }

  async function handleIssue() {
    if (!selectedEvent || pendingRows.length === 0) return;
    const assignments: CertificateAssignment[] = pendingRows.map((r) => ({
      player_id: r.player.id,
      cert_type: r.certType,
    }));
    setIssuing(true);
    setIssueError(null);
    try {
      const res = await issueEventCertificates(selectedEvent.id, assignments);
      setIssuedCount(res.issued_count);
      setSkippedCount(res.skipped_count);
      setIssuedResult(res.issued);
      setSkippedResult(res.skipped);
      setStep("result");
    } catch (e: any) {
      setIssueError(e.message || "Failed to issue certificates.");
    } finally {
      setIssuing(false);
    }
  }

  function handleBack() {
    setStep("events");
    setSelectedEvent(null);
    setPendingRows([]);
    setIssueError(null);
    loadEvents();
  }

  // ────────────────────────────────────────────────────────────
  // STEP 1 — EVENT LIST
  // ────────────────────────────────────────────────────────────
  if (step === "events") {
    return (
      <div className="p-8 bg-white min-h-[600px]">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#d97c55]/10 flex items-center justify-center text-[#d97c55]">
            <FileBadge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-widest uppercase text-[#111827]">
              Issue Event Certificates
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select an event, manually add players, and issue their certificates
            </p>
          </div>
        </div>

        {loadingEvents ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-5 h-5 text-[#d97c55] animate-spin" />
            <span className="ml-3 text-sm text-gray-500">Loading events...</span>
          </div>
        ) : eventsError ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded p-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{eventsError}</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileBadge className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold tracking-widest uppercase">No Events Found</p>
            <p className="text-xs mt-1">Create events first from the Admin Toolkit.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded shadow-sm p-6 hover:border-[#d97c55]/50 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[9px] font-bold tracking-widest uppercase bg-[#111827] text-white px-2 py-0.5 rounded-sm">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-base tracking-wide uppercase text-[#111827] mb-2 truncate">
                      {event.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.start_date} – {event.end_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[150px]">
                    <div className="text-right">
                      <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                        CERTS ISSUED
                      </div>
                      <div className="font-heading text-2xl font-bold text-[#111827]">
                        {event.certs_issued}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectEvent(event)}
                      className="text-[9px] font-bold tracking-widest uppercase bg-[#111827] text-white px-4 py-2 rounded hover:bg-[#d97c55] transition-colors whitespace-nowrap"
                    >
                      MANAGE CERTIFICATES →
                    </button>
                  </div>
                </div>

                {/* Already issued preview */}
                {event.issued_certs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                      ALREADY ISSUED
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.issued_certs.slice(0, 4).map((c, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {c.player_name}
                        </span>
                      ))}
                      {event.issued_certs.length > 4 && (
                        <span className="text-[10px] text-gray-400 px-2 py-1">
                          +{event.issued_certs.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // STEP 2 — MANUAL PLAYER ASSIGNMENT
  // ────────────────────────────────────────────────────────────
  if (step === "assign" && selectedEvent) {
    return (
      <div className="p-8 bg-white min-h-[600px]">
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-[#d97c55] hover:text-[#d97c55] transition-colors mt-1 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase">
              ISSUE CERTIFICATES · {selectedEvent.category}
            </div>
            <h2 className="font-bold text-base tracking-wide uppercase text-[#111827]">
              {selectedEvent.name}
            </h2>
            <div className="flex gap-4 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{selectedEvent.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {selectedEvent.start_date} – {selectedEvent.end_date}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 mb-6 mt-4" />

        {/* ── Search & Add Row ─────────────────────────────── */}
        <div className="bg-[#f9f7f5] border border-gray-200 rounded p-5 mb-6">
          <div className="text-[9px] font-bold tracking-widest uppercase text-gray-500 mb-3">
            ADD PLAYER TO CERTIFICATE LIST
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSearchPlayer(null);
                  }}
                  placeholder="Search player by name or ID..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:border-[#d97c55] focus:ring-1 focus:ring-[#d97c55]"
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-52 overflow-y-auto">
                  {searchResults.map((player) => {
                    const alreadyIssued = alreadyIssuedIds.has(player.id);
                    const inPending = pendingRows.some((r) => r.player.id === player.id);
                    return (
                      <button
                        key={player.id}
                        onClick={() => !alreadyIssued && !inPending && handlePickSearchResult(player)}
                        disabled={alreadyIssued || inPending}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${
                          alreadyIssued || inPending
                            ? "opacity-40 cursor-not-allowed bg-gray-50"
                            : "hover:bg-[#fff8f6] cursor-pointer"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-[#111827]">{player.name}</div>
                          <div className="text-[10px] text-gray-400">
                            {player.player_id_str} · {player.district} · {player.club_name}
                          </div>
                        </div>
                        {alreadyIssued && (
                          <span className="text-[9px] font-bold tracking-widest uppercase text-green-600 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> ISSUED
                          </span>
                        )}
                        {inPending && !alreadyIssued && (
                          <span className="text-[9px] font-bold tracking-widest uppercase text-[#d97c55]">
                            IN LIST
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {showDropdown && searchResults.length === 0 && !searching && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded shadow-lg px-4 py-3 text-xs text-gray-400">
                  No registered players found for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Cert type select */}
            <select
              value={selectedCertType}
              onChange={(e) => setSelectedCertType(e.target.value as CertificateType)}
              className="sm:w-56 text-xs border border-gray-200 rounded px-3 py-2.5 bg-white text-[#111827] font-medium focus:outline-none focus:border-[#d97c55] focus:ring-1 focus:ring-[#d97c55] cursor-pointer"
            >
              {CERT_TYPES.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>

            {/* Add button */}
            <button
              onClick={handleAddToList}
              disabled={!selectedSearchPlayer}
              className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase bg-[#111827] text-white px-5 py-2.5 rounded hover:bg-[#d97c55] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD TO LIST
            </button>
          </div>

          {selectedSearchPlayer && (
            <div className="mt-2 text-xs text-[#d97c55] font-semibold">
              Selected: {selectedSearchPlayer.name} ({selectedSearchPlayer.player_id_str})
            </div>
          )}
        </div>

        {/* ── Pending list ─────────────────────────────────── */}
        {pendingRows.length > 0 ? (
          <div className="mb-6">
            <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-3">
              CERTIFICATE LIST — {pendingRows.length} PLAYER{pendingRows.length !== 1 ? "S" : ""}
            </div>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-[9px] font-bold tracking-widest uppercase text-gray-400 px-4 py-3">Player</th>
                    <th className="text-left text-[9px] font-bold tracking-widest uppercase text-gray-400 px-4 py-3">District</th>
                    <th className="text-left text-[9px] font-bold tracking-widest uppercase text-gray-400 px-4 py-3 min-w-[220px]">Certificate Type</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {pendingRows.map((row, idx) => (
                    <tr
                      key={row.player.id}
                      className={`border-b border-gray-100 last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#111827] text-xs">{row.player.name}</div>
                        <div className="text-[10px] text-gray-400">{row.player.player_id_str}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{row.player.district}</td>
                      <td className="px-4 py-3">
                        <select
                          value={row.certType}
                          onChange={(e) => handleChangeCertType(row.player.id, e.target.value as CertificateType)}
                          className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-[#111827] font-medium focus:outline-none focus:border-[#d97c55] w-full cursor-pointer"
                        >
                          {CERT_TYPES.map((ct) => (
                            <option key={ct} value={ct}>{ct}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRemoveRow(row.player.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mb-6 border-2 border-dashed border-gray-200 rounded p-10 text-center text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-semibold tracking-widest uppercase">No Players Added Yet</p>
            <p className="text-xs mt-1">Search above and add players who participated in this event.</p>
          </div>
        )}

        {/* ── Already Issued (locked) ──────────────────────── */}
        {selectedEvent.issued_certs.length > 0 && (
          <div className="mb-6">
            <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-3 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              ALREADY ISSUED — {selectedEvent.issued_certs.length} CERTIFICATE{selectedEvent.issued_certs.length !== 1 ? "S" : ""}
            </div>
            <div className="border border-gray-200 rounded overflow-hidden opacity-70">
              {selectedEvent.issued_certs.map((cert: IssuedCertEntry, idx: number) => (
                <div
                  key={cert.cert_id}
                  className={`flex items-center justify-between px-4 py-2.5 ${idx !== selectedEvent.issued_certs.length - 1 ? "border-b border-gray-100" : ""} bg-green-50/50`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#111827]">{cert.player_name}</div>
                      <div className="text-[10px] text-gray-400">{cert.district}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold tracking-widest uppercase text-green-700">
                      {cert.cert_type}
                    </div>
                    <div className="text-[9px] text-gray-400">
                      {new Date(cert.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {issueError && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {issueError}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {pendingRows.length > 0 ? (
              <span>
                <span className="font-bold text-[#111827]">{pendingRows.length}</span> player{pendingRows.length !== 1 ? "s" : ""} ready to receive certificates
              </span>
            ) : (
              "Add at least one player to proceed."
            )}
          </p>
          <button
            onClick={handleIssue}
            disabled={issuing || pendingRows.length === 0}
            className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase bg-[#d97c55] text-white px-6 py-3 rounded hover:bg-[#c46a45] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {issuing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                ISSUING...
              </>
            ) : (
              <>
                <FileBadge className="w-3 h-3" />
                ISSUE ALL CERTIFICATES
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // STEP 3 — RESULT SUMMARY
  // ────────────────────────────────────────────────────────────
  if (step === "result") {
    return (
      <div className="p-8 bg-white min-h-[600px]">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              issuedCount > 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
            }`}
          >
            {issuedCount > 0 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-widest uppercase text-[#111827]">
              {issuedCount > 0 ? "Certificates Issued!" : "Nothing New Issued"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {issuedCount} issued · {skippedCount} skipped
              {selectedEvent ? ` for ${selectedEvent.name}` : ""}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-green-200 bg-green-50 rounded p-5 text-center">
            <div className="text-[9px] font-bold tracking-widest uppercase text-green-600 mb-1">ISSUED</div>
            <div className="font-heading text-4xl font-bold text-green-700">{issuedCount}</div>
          </div>
          <div className="border border-gray-200 bg-gray-50 rounded p-5 text-center">
            <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-1">SKIPPED</div>
            <div className="font-heading text-4xl font-bold text-gray-400">{skippedCount}</div>
          </div>
        </div>

        {/* Issued list */}
        {issuedResult.length > 0 && (
          <div className="mb-6">
            <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-3">
              CERTIFICATES ISSUED
            </div>
            <div className="border border-gray-200 rounded overflow-hidden">
              {issuedResult.map((item, idx) => (
                <div
                  key={item.player_id}
                  className={`flex items-center justify-between px-4 py-3 ${idx !== issuedResult.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#111827]">{item.player_name}</div>
                      <div className="text-[10px] text-gray-400">PLR-{String(item.player_id).padStart(5, "0")}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#d97c55] bg-[#d97c55]/10 px-2 py-1 rounded">
                    {item.cert_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skipped list */}
        {skippedResult.length > 0 && (
          <div className="mb-8">
            <div className="text-[9px] font-bold tracking-widest uppercase text-gray-400 mb-3">SKIPPED</div>
            <div className="border border-gray-200 rounded overflow-hidden">
              {skippedResult.map((item, idx) => (
                <div
                  key={`${item.player_id}-${idx}`}
                  className={`flex items-center justify-between px-4 py-3 ${idx !== skippedResult.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600">
                      {item.player_name || `Player #${item.player_id}`}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-400 italic">{item.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase border border-[#111827] text-[#111827] px-6 py-3 rounded hover:bg-[#111827] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          BACK TO EVENTS
        </button>
      </div>
    );
  }

  return null;
}
