"use client";

import { X, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { EventData, listEvents, uploadTournamentResults, deleteTournamentResult } from "@/lib/api";

export default function UploadResultsModal() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [scoresheetFile, setScoresheetFile] = useState<File | null>(null);
  const [scoresheetError, setScoresheetError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [standings, setStandings] = useState([
    { id: 1, team: "", notes: "" },
    { id: 2, team: "", notes: "" },
    { id: 3, team: "", notes: "" },
    { id: 4, team: "", notes: "" },
  ]);
  const nextId = standings.length > 0 ? Math.max(...standings.map(s => s.id)) + 1 : 1;

  // Form field refs
  const eventSelectRef = useRef<HTMLSelectElement>(null);
  const finalDateRef = useRef<HTMLInputElement>(null);
  const totalMatchesRef = useRef<HTMLInputElement>(null);
  const topScorerRef = useRef<HTMLInputElement>(null);
  const bestPlayerRef = useRef<HTMLInputElement>(null);
  const bestGoalkeeperRef = useRef<HTMLInputElement>(null);
  const mostPromisingJuniorRef = useRef<HTMLInputElement>(null);

  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchEvents = () => {
    listEvents().then((res) => {
      if (res.success) setEvents(res.events);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const eventId = eventSelectRef.current?.value;
    if (!eventId) {
      setErrorMsg("Please select a tournament first.");
      return;
    }

    const filledStandings = standings.filter(s => s.team.trim() !== "");
    if (filledStandings.length === 0) {
      setErrorMsg("Please add at least one standing (team name required).");
      return;
    }

    setLoading(true);
    try {
      const res = await uploadTournamentResults(eventId, {
        standings: filledStandings,
        final_date: finalDateRef.current?.value || undefined,
        total_matches: totalMatchesRef.current?.value || undefined,
        top_scorer: topScorerRef.current?.value || undefined,
        best_player: bestPlayerRef.current?.value || undefined,
        best_goalkeeper: bestGoalkeeperRef.current?.value || undefined,
        most_promising_junior: mostPromisingJuniorRef.current?.value || undefined,
        scoresheet: scoresheetFile,
      });
      setSuccessMsg(`Results for "${res.event_name}" published successfully! (${res.standings_saved} standing${res.standings_saved !== 1 ? 's' : ''} saved)`);
      // Reset form
      setScoresheetFile(null);
      setStandings([{ id: 1, team: "", notes: "" }, { id: 2, team: "", notes: "" }, { id: 3, team: "", notes: "" }, { id: 4, team: "", notes: "" }]);
      if (eventSelectRef.current) eventSelectRef.current.value = "";
      if (finalDateRef.current) finalDateRef.current.value = "";
      if (totalMatchesRef.current) totalMatchesRef.current.value = "";
      if (topScorerRef.current) topScorerRef.current.value = "";
      if (bestPlayerRef.current) bestPlayerRef.current.value = "";
      if (bestGoalkeeperRef.current) bestGoalkeeperRef.current.value = "";
      if (mostPromisingJuniorRef.current) mostPromisingJuniorRef.current.value = "";
      fetchEvents();
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId: number, eventName: string) {
    if (!window.confirm(`Are you sure you want to delete the uploaded results for "${eventName}"?`)) return;
    setDeleting(eventId);
    try {
      const res = await deleteTournamentResult(eventId);
      if (res.success) {
        setSuccessMsg(`Results for "${eventName}" deleted successfully.`);
        fetchEvents();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete results.");
    } finally {
      setDeleting(null);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|xls|xlsx|csv|png|jpg|jpeg)$/i)) {
      setScoresheetError("Please upload a PDF, Excel, CSV, or image file.");
      setScoresheetFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setScoresheetError("File is too large. Maximum size is 10 MB.");
      setScoresheetFile(null);
      return;
    }
    setScoresheetError("");
    setScoresheetFile(file);
  }

  function addStanding() {
    setStandings(prev => [...prev, { id: nextId, team: "", notes: "" }]);
  }

  function removeStanding(id: number) {
    setStandings(prev => prev.filter(s => s.id !== id));
  }

  function updateStanding(id: number, field: "team" | "notes", value: string) {
    setStandings(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function getPositionLabel(index: number) {
    const labels = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH"];
    return labels[index] ?? `${index + 1}TH`;
  }

  function getPositionStyle(index: number) {
    if (index === 0) return "bg-[#d19b67] text-[#111827]";
    if (index === 1) return "bg-[#b3b0a7] text-[#111827]";
    if (index === 2) return "bg-[#9e6d4c] text-white";
    return "bg-[#18202f] text-white";
  }

  return (
    <div className="bg-white w-full rounded shadow-sm border border-gray-200 relative">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div>
          <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
            ADMIN &middot; RESULTS
          </div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-[#111827]">
            UPLOAD TOURNAMENT <span className="text-[#d97c55]">RESULTS</span>
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Success / Error banners */}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded p-4 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}
        <div className="p-6 space-y-8">
          {/* 01 TOURNAMENT */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">01</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                TOURNAMENT
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                  SELECT TOURNAMENT *
                </label>
                <select
                  ref={eventSelectRef}
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 appearance-none"
                >
                  <option value="">Select a completed event...</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.location})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    FINAL DATE PLAYED
                  </label>
                  <input
                    ref={finalDateRef}
                    type="date"
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    TOTAL MATCHES PLAYED
                  </label>
                  <input
                    ref={totalMatchesRef}
                    type="text"
                    placeholder="e.g. 24"
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 02 FINAL STANDINGS */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">02</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                FINAL STANDINGS *
              </h3>
            </div>
            <div className="space-y-3">
              {standings.map((standing, index) => (
                <div key={standing.id} className="flex gap-3 items-center bg-[#fcfbf9] p-2 border border-gray-100 rounded">
                  <div className={`w-16 text-center py-2.5 rounded text-sm font-bold tracking-widest shadow-sm shrink-0 ${getPositionStyle(index)}`}>
                    {getPositionLabel(index)}
                  </div>
                  <input
                    type="text"
                    value={standing.team}
                    onChange={(e) => updateStanding(standing.id, "team", e.target.value)}
                    placeholder="Team / District name"
                    className="flex-1 bg-white border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                  <input
                    type="text"
                    value={standing.notes}
                    onChange={(e) => updateStanding(standing.id, "notes", e.target.value)}
                    placeholder="e.g. 5 wins, 1 loss"
                    className="flex-[1.5] bg-white border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                  <button
                    type="button"
                    onClick={() => removeStanding(standing.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 shrink-0"
                    title="Remove this standing"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {standings.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
                  No standings added yet. Click "+ ADD STANDING" below.
                </div>
              )}

              {/* Add Standing Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={addStanding}
                  className="border border-dashed border-[#d97c55]/50 text-[#d97c55] px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-[#d97c55]/5 transition-colors"
                >
                  + ADD STANDING
                </button>
              </div>
            </div>
          </section>

          {/* 03 INDIVIDUAL AWARDS */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">03</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                INDIVIDUAL AWARDS
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  TOP SCORER
                </label>
                <input
                  ref={topScorerRef}
                  type="text"
                  placeholder="Name - District - Goals"
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  BEST PLAYER (MVP)
                </label>
                <input
                  ref={bestPlayerRef}
                  type="text"
                  placeholder="Name - District"
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  BEST GOALKEEPER
                </label>
                <input
                  ref={bestGoalkeeperRef}
                  type="text"
                  placeholder="Name - District"
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  MOST PROMISING JUNIOR
                </label>
                <input
                  ref={mostPromisingJuniorRef}
                  type="text"
                  placeholder="Name - District"
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                />
              </div>
            </div>
          </section>

          {/* 04 DOCUMENTS & PUBLICATION */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">04</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                DOCUMENTS & PUBLICATION
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  MATCH-BY-MATCH SCORESHEET (PDF / Image)
                </label>

                {/* Clickable upload zone — wraps a real hidden file input */}
                <label
                  htmlFor="scoresheet-upload"
                  className={`border border-dashed rounded-md p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                    scoresheetFile
                      ? "border-[#d97c55] bg-orange-50"
                      : "border-gray-300 bg-[#fcfbf9] hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 shrink-0 shadow-sm">
                    {scoresheetFile ? (
                      <Upload className="w-4 h-4 text-[#d97c55]" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {scoresheetFile ? (
                      <>
                        <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">FILE SELECTED</div>
                        <div className="text-xs text-gray-800 mt-0.5 truncate">{scoresheetFile.name}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5">{(scoresheetFile.size / 1024).toFixed(0)} KB</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[10px] font-bold tracking-widest text-[#111827] uppercase">CLICK TO UPLOAD SCORESHEET</div>
                        <div className="text-[9px] font-mono text-gray-500 uppercase mt-0.5">PDF, IMAGE, EXCEL OR CSV · MAX 10 MB</div>
                      </>
                    )}
                  </div>
                  {scoresheetFile && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setScoresheetFile(null); }}
                      className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </label>

                {/* Hidden actual file input */}
                <input
                  id="scoresheet-upload"
                  type="file"
                  accept=".pdf,.xls,.xlsx,.csv,.png,.jpg,.jpeg,application/pdf,image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {scoresheetError && (
                  <p className="text-xs text-red-500 mt-1.5">{scoresheetError}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    STATUS
                  </label>
                  <select className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 appearance-none">
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    NOTIFY MEMBERS
                  </label>
                  <select className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 appearance-none">
                    <option>Yes, send notification</option>
                    <option>No, do not notify</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col gap-4">
          <div className="text-[10px] text-gray-500 font-mono">
            Results sync to public website & affected member dashboards on publish
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="border border-gray-300 text-gray-800 px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              className="border border-gray-300 text-gray-800 px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              SAVE DRAFT
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#5ea993] text-white px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#4d907d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ml-auto"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {loading ? "PUBLISHING..." : "PUBLISH RESULTS"}
            </button>
          </div>
        </div>
      </form>

      {/* 05 PUBLISHED RESULTS (DELETE SECTION) */}
      <div className="p-6 border-t border-gray-100 bg-[#fcfbf9] rounded-b">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
          <span className="text-[10px] font-bold text-[#d97c55]">05</span>
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
            PUBLISHED RESULTS
          </h3>
        </div>
        
        <div className="space-y-3">
          {events.filter(ev => ev.has_tournament_result).length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
              No tournament results have been published yet.
            </div>
          ) : (
            events.filter(ev => ev.has_tournament_result).map(ev => (
              <div key={ev.id} className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded shadow-sm">
                <div>
                  <div className="font-bold text-sm text-[#111827]">{ev.name}</div>
                  <div className="text-xs text-gray-500">{ev.location} &middot; {ev.category.toUpperCase()}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(ev.id, ev.name)}
                  disabled={deleting === ev.id}
                  className="border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  {deleting === ev.id ? "DELETING..." : "DELETE RESULTS"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
