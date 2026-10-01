"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  Radio,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  AnnouncementData,
} from "@/lib/api";

export default function ManageAnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementData | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements();
      if (res && res.success && res.announcements) {
        setAnnouncements(res.announcements);
      }
    } catch (err) {
      console.error("Failed to load announcements:", err);
      setFeedback({ type: "error", message: "Failed to fetch notices from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormTitle("");
    setFormMessage("");
    setFeedback(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (item: AnnouncementData) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormMessage(item.message);
    setFeedback(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) {
      setFeedback({ type: "error", message: "Please provide both title and notice message." });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await createAnnouncement({
        title: formTitle.trim(),
        message: formMessage.trim(),
      });
      if (res && res.success && res.announcement) {
        setAnnouncements([res.announcement, ...announcements]);
        setIsCreateModalOpen(false);
        setFeedback({
          type: "success",
          message: "New announcement published successfully! It is now live on homepage marquee & member dashboards.",
        });
      } else {
        setFeedback({ type: "error", message: res?.message || "Failed to publish notice." });
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to publish notice.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!formTitle.trim() || !formMessage.trim()) {
      setFeedback({ type: "error", message: "Title and message cannot be empty." });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await updateAnnouncement(editingItem.id, {
        title: formTitle.trim(),
        message: formMessage.trim(),
      });
      if (res && res.success && res.announcement) {
        setAnnouncements(
          announcements.map((a) => (a.id === editingItem.id ? res.announcement : a))
        );
        setEditingItem(null);
        setFeedback({
          type: "success",
          message: "Announcement updated successfully! Live tickers reflect the latest changes.",
        });
      } else {
        setFeedback({ type: "error", message: res?.message || "Failed to update notice." });
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update notice.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await deleteAnnouncement(id);
      if (res && res.success) {
        setAnnouncements(announcements.filter((a) => a.id !== id));
        setDeletingId(null);
        setFeedback({
          type: "success",
          message: "Announcement deleted successfully from all portals.",
        });
      } else {
        setFeedback({ type: "error", message: res?.message || "Failed to delete notice." });
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete notice.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = announcements.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header Strip ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              ADMINISTRATION &middot; COMMUNICATIONS
            </span>
            <span className="text-gray-300">&bull;</span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE BROADCAST SYSTEM
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111827]">
            PUBLISH NOTICE &amp; <span className="text-accent">ANNOUNCEMENTS</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Broadcast official circulars, tournament notices, and technical updates. All published notices
            stream automatically on the homepage scrolling ticker, public notices directory, and member dashboards.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadData}
            title="Refresh list"
            disabled={loading}
            className="p-2.5 rounded-lg border border-gray-300 text-gray-600 hover:text-accent hover:border-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-accent/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Publish New Notice</span>
          </button>
        </div>
      </div>

      {/* ── Feedback Notification ── */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Quick Stats Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              TOTAL NOTICES
            </div>
            <div className="font-heading text-3xl font-bold text-[#111827]">
              {announcements.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              HOMEPAGE TICKER
            </div>
            <div className="font-heading text-xl font-bold text-emerald-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              ACTIVE
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              PUBLIC NOTICES PAGE
            </div>
            <a
              href="/announcements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1 mt-1"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notice by title or message..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white rounded-lg text-xs outline-none transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-gray-400 font-bold uppercase">
          Showing {filtered.length} of {announcements.length}
        </div>
      </div>

      {/* ── Announcements Table / List ── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-3"></div>
            <span>Loading official announcements...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="font-heading text-lg font-bold uppercase text-gray-700 mb-1">
              No Announcements Found
            </h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              {searchQuery
                ? "No notices match your search criteria. Try clearing the search."
                : "No announcements have been published yet. Click the button above to publish your first notice."}
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-accent hover:underline uppercase tracking-wider"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 bg-accent text-white text-xs font-bold uppercase rounded-lg hover:bg-accent/90"
              >
                Publish Notice Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
                  <th className="py-3.5 px-4 w-16">#ID</th>
                  <th className="py-3.5 px-4 w-32">Date</th>
                  <th className="py-3.5 px-4 w-1/4">Notice Title</th>
                  <th className="py-3.5 px-4">Message / Details</th>
                  <th className="py-3.5 px-4 w-28 text-center">Status</th>
                  <th className="py-3.5 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-gray-400">
                        #{item.id}
                      </td>

                      <td className="py-4 px-4 font-mono text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-heading font-bold text-sm uppercase text-[#111827] group-hover:text-accent transition-colors">
                          {item.title}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-600 leading-relaxed max-w-md">
                        <div className="line-clamp-2">{item.message}</div>
                      </td>

                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Live
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            title="Edit Notice"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-accent hover:border-accent transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(item.id)}
                            title="Delete Notice"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE NOTICE MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase text-[#111827]">
                    PUBLISH NEW ANNOUNCEMENT
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Live broadcast to homepage ticker and member portals
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Notice / Announcement Title <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. State Senior Championship 2026 Selection Trials"
                  className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white rounded-lg px-4 py-2.5 text-xs text-gray-900 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Notice Content / Circular Message <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Enter full details, dates, venues, eligibility rules, or official guidelines..."
                  className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white rounded-lg p-4 text-xs text-gray-900 outline-none transition-colors resize-y leading-relaxed"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                <Radio className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Broadcast:</strong> Once submitted, this notice will immediately scroll
                  on the Homepage Marquee Strip and appear under <em>/announcements</em>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? "PUBLISHING…" : "PUBLISH NOTICE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT NOTICE MODAL ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase text-[#111827]">
                    EDIT ANNOUNCEMENT #{editingItem.id}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Update notice title and content across the network
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Notice Title <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white rounded-lg px-4 py-2.5 text-xs text-gray-900 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Notice Content <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white rounded-lg p-4 text-xs text-gray-900 outline-none transition-colors resize-y leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? "SAVING…" : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION DIALOG ── */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-gray-900 mb-2">
              CONFIRM DELETION
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete Notice #{deletingId}? It will be removed
              from the Homepage ticker, public circulars, and all dashboards immediately.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 rounded-lg border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(deletingId)}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
              >
                {actionLoading ? "DELETING…" : "YES, DELETE NOTICE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
