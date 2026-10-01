"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Trophy, X } from "lucide-react";
import {
  listEvents,
  createEvent,
  deleteEvent,
  addEventResult,
  deleteEventResult,
  listPlayers,
  EventData,
  PlayerData,
  CreateEventPayload,
} from "@/lib/api";

export default function AdminEventsManager() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Create form state
  const [form, setForm] = useState<CreateEventPayload>({
    name: "",
    location: "",
    start_date: "",
    end_date: "",
    registration_end_date: "",
    category: "senior",
  });
  const [creating, setCreating] = useState(false);

  // Result form
  const [resultEvent, setResultEvent] = useState<number | null>(null);
  const [resultPlayer, setResultPlayer] = useState<string>("");
  const [resultPosition, setResultPosition] = useState<string>("1");
  const [addingResult, setAddingResult] = useState(false);

  useEffect(() => {
    Promise.all([listEvents(), listPlayers()])
      .then(([e, p]) => {
        setEvents(e.events);
        setPlayers(p.players);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createEvent({
        ...form,
        registration_end_date: form.registration_end_date || form.start_date || "",
      });
      setEvents((prev) => [res.event, ...prev]);
      setShowCreate(false);
      setForm({ name: "", location: "", start_date: "", end_date: "", registration_end_date: "", category: "Senior" });
      showToast(`Event "${res.event.name}" created!`);
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : "Could not create event"}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(eventId: number, eventName: string) {
    if (!window.confirm(`Delete event "${eventName}"? This cannot be undone.`)) return;
    setDeleting(eventId);
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToast(`Event "${eventName}" deleted.`);
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : "Could not delete"}`);
    } finally {
      setDeleting(null);
    }
  }

  async function handleAddResult(e: React.FormEvent) {
    e.preventDefault();
    if (!resultEvent || !resultPlayer) return;
    setAddingResult(true);
    try {
      const res = await addEventResult(resultEvent, {
        player_id: parseInt(resultPlayer),
        position: parseInt(resultPosition),
      });
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === resultEvent
            ? { ...ev, results: [...ev.results, res.result] }
            : ev
        )
      );
      setResultEvent(null);
      setResultPlayer("");
      setResultPosition("1");
      showToast("Result added successfully!");
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : "Could not add result"}`);
    } finally {
      setAddingResult(false);
    }
  }

  async function handleDeleteResult(eventId: number, resultId: number) {
    if (!window.confirm("Delete this result?")) return;
    try {
      await deleteEventResult(eventId, resultId);
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId
            ? { ...ev, results: ev.results.filter((r) => r.id !== resultId) }
            : ev
        )
      );
      showToast("Result deleted.");
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : "Could not delete result"}`);
    }
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm relative">

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 right-4 z-10 bg-[#111827] text-white text-xs font-bold tracking-wide px-5 py-3 rounded-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">EVENT MANAGEMENT</h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#111827] hover:bg-[#1f2937] text-white px-5 py-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> CREATE EVENT
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="p-8 border-b border-accent/20 bg-[#fff8f6]">
          <div className="text-[11px] font-bold tracking-widest text-accent uppercase mb-6">NEW EVENT</div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Event Name", key: "name", type: "text", placeholder: "e.g. State Senior Cup" },
              { label: "Location", key: "location", type: "text", placeholder: "e.g. Lucknow" },
              { label: "Start Date", key: "start_date", type: "date" },
              { label: "End Date", key: "end_date", type: "date" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key as keyof CreateEventPayload]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-accent transition-colors"
              >
                {[
                  "Federation / National Championship",
                  "Senior",
                  "Junior",
                  "Youth",
                  "U17",
                  "U15",
                  "U13",
                  "U11",
                  "Mini Handball",
                  "Beach Handball",
                  "Masters / Veterans",
                  "School / College",
                  "Corporate / Institutional",
                  "Wheelchair Handball",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">
                CANCEL
              </button>
              <button type="submit" disabled={creating} className="bg-[#111827] text-white px-8 py-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase hover:bg-[#1f2937] disabled:opacity-50 transition-colors">
                {creating ? "CREATING…" : "CREATE EVENT"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Result Form */}
      {resultEvent && (
        <div className="p-8 border-b border-accent/20 bg-[#fff8f6]">
          <div className="text-[11px] font-bold tracking-widest text-accent uppercase mb-6 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" />
            ADD RESULT — {events.find((e) => e.id === resultEvent)?.name}
          </div>
          <form onSubmit={handleAddResult} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">Player</label>
              <select
                required
                value={resultPlayer}
                onChange={(e) => setResultPlayer(e.target.value)}
                className="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Select player…</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>{p.user.name} — {p.district}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1.5">Position</label>
              <input
                type="number"
                required
                min={1}
                value={resultPosition}
                onChange={(e) => setResultPosition(e.target.value)}
                className="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-sm text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <button type="submit" disabled={addingResult} className="bg-[#d97c55] text-white px-6 py-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase hover:bg-[#c16744] disabled:opacity-50 transition-colors">
              {addingResult ? "ADDING…" : "ADD RESULT"}
            </button>
            <button type="button" onClick={() => setResultEvent(null)} className="border border-gray-200 text-gray-700 px-4 py-2.5 rounded-sm text-[9px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors">
              CANCEL
            </button>
          </form>
        </div>
      )}

      {/* Events Table */}
      <div className="overflow-x-auto">
        {loading && (
          <div className="p-12 text-center text-sm text-gray-400 animate-pulse">Loading events…</div>
        )}

        {!loading && events.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">🏐</div>
            <div className="text-sm text-gray-500">No events found. Create one above.</div>
          </div>
        )}

        {!loading && events.length > 0 && (
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-[9px] font-bold tracking-widest text-gray-500 uppercase">EVENT</th>
                <th className="py-3 px-6 text-[9px] font-bold tracking-widest text-gray-500 uppercase">LOCATION</th>
                <th className="py-3 px-6 text-[9px] font-bold tracking-widest text-gray-500 uppercase">DATES</th>
                <th className="py-3 px-6 text-[9px] font-bold tracking-widest text-gray-500 uppercase">CATEGORY</th>
                <th className="py-3 px-6 text-[9px] font-bold tracking-widest text-gray-500 uppercase">RESULTS</th>
                <th className="py-3 px-6 text-[9px] font-bold tracking-widest text-gray-500 uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-gray-800">{event.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">#{event.id}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div>{event.location}</div>
                    {event.venue && (
                      <div className="text-xs text-gray-400 mt-0.5">{event.venue}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700">{event.start_date}</div>
                    <div className="text-[10px] text-gray-400">to {event.end_date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase capitalize">
                      {event.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700">{event.results.length} result{event.results.length !== 1 ? "s" : ""}</div>
                    {event.results.map((r) => (
                      <div key={r.id} className="text-[10px] text-gray-400 font-mono flex items-center justify-between group">
                        <span>#{r.position} {r.player.user.name}</span>
                        <button
                          onClick={() => handleDeleteResult(event.id, r.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2 transition-opacity"
                          title="Delete Result"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setResultEvent(resultEvent === event.id ? null : event.id)}
                        className="border border-[#d97c55]/40 text-accent hover:bg-[#d97c55]/10 px-3 py-1.5 rounded-sm text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 transition-colors"
                      >
                        <Trophy className="w-3 h-3" /> RESULT
                      </button>
                      <button
                        disabled={deleting === event.id}
                        onClick={() => handleDelete(event.id, event.name)}
                        className="border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 px-3 py-1.5 rounded-sm text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deleting === event.id ? "…" : "DELETE"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
