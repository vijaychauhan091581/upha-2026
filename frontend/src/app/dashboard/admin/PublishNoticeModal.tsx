"use client";

import { useState } from "react";
import { createAnnouncement } from "@/lib/api";

export default function PublishNoticeModal() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createAnnouncement({ title, message });
      setSuccess(true);
      setTitle("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish announcement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white w-full rounded shadow-sm border border-gray-200 relative mb-12">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div>
          <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
            ADMIN &middot; NOTICE
          </div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-[#111827]">
            PUBLISH <span className="text-[#d97c55]">ANNOUNCEMENT</span>
          </h2>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="mx-6 mt-6 bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wide px-4 py-3 rounded">
          ✓ Announcement published successfully! It is now visible on all member dashboards.
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 text-xs font-bold tracking-wide px-4 py-3 rounded">
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-8">
          {/* 01 ANNOUNCEMENT DETAILS */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">01</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                ANNOUNCEMENT DETAILS
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  TITLE <span className="text-[#d97c55]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. State Championship registration now open"
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  BODY <span className="text-[#d97c55]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Full announcement content shown on dashboards..."
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400 resize-none"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    PRIORITY
                  </label>
                  <select className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 appearance-none">
                    <option>Normal</option>
                    <option>High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    AUDIENCE
                  </label>
                  <select className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 appearance-none">
                    <option>All Members</option>
                    <option>Players Only</option>
                    <option>Referees Only</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 02 CHANNELS */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">02</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                CHANNELS
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="bg-[#d97c55]/10 border border-[#d97c55] text-[#d97c55] px-4 py-2 rounded text-xs font-bold cursor-pointer">
                <input type="checkbox" defaultChecked className="hidden" />
                Member Dashboards
              </label>
              <label className="bg-[#d97c55]/10 border border-[#d97c55] text-[#d97c55] px-4 py-2 rounded text-xs font-bold cursor-pointer">
                <input type="checkbox" defaultChecked className="hidden" />
                Public Website
              </label>
              <label className="bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded text-xs font-bold cursor-pointer hover:bg-gray-200">
                <input type="checkbox" className="hidden" />
                Email Blast
              </label>
              <label className="bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded text-xs font-bold cursor-pointer hover:bg-gray-200">
                <input type="checkbox" className="hidden" />
                SMS
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-gray-400 font-mono">
            Auto-archives after 30 days
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setTitle(""); setMessage(""); setSuccess(false); setError(null); }}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-800 px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              CLEAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none bg-[#d97c55] text-white px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#c16744] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              {loading ? "PUBLISHING..." : "PUBLISH ANNOUNCEMENT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
