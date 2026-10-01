"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Mail,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  Phone,
  Calendar,
  Tag,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import {
  listEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  EnquiryData,
} from "@/lib/api";

export default function ManageEnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await listEnquiries();
      if (res.success && res.enquiries) {
        setEnquiries(res.enquiries);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await updateEnquiryStatus(id, newStatus);
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number, refNum: string) => {
    if (!window.confirm(`Are you sure you want to delete enquiry ${refNum}? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await deleteEnquiry(id);
      if (res.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      alert("Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = enquiries.length;
    const pending = enquiries.filter((e) => e.status === "pending" || !e.status).length;
    const inProgress = enquiries.filter((e) => e.status === "in_progress").length;
    const resolved = enquiries.filter((e) => e.status === "resolved" || e.status === "replied").length;
    return { total, pending, inProgress, resolved };
  }, [enquiries]);

  // Filtered results
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && (e.status === "pending" || !e.status)) ||
        e.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.phone && e.phone.includes(q)) ||
        (e.subject && e.subject.toLowerCase().includes(q)) ||
        e.message.toLowerCase().includes(q) ||
        e.reference_number.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [enquiries, statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
      case "replied":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">
            TOTAL ENQUIRIES
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-gray-900">
            {stats.total}
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-5 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
          <div className="text-[10px] font-bold tracking-widest text-amber-700 uppercase mb-1 flex items-center justify-between">
            <span>PENDING</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
            {stats.pending}
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-5 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
          <div className="text-[10px] font-bold tracking-widest text-blue-700 uppercase mb-1">
            IN PROGRESS
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
            {stats.inProgress}
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-lg p-5 shadow-sm bg-gradient-to-br from-white to-green-50/30">
          <div className="text-[10px] font-bold tracking-widest text-green-700 uppercase mb-1">
            RESOLVED
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-green-700">
            {stats.resolved}
          </div>
        </div>
      </div>

      {/* Control Bar: Status Filter, Search, Refresh */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "all", label: "All Enquiries", count: stats.total },
            { id: "pending", label: "Pending", count: stats.pending },
            { id: "in_progress", label: "In Progress", count: stats.inProgress },
            { id: "resolved", label: "Resolved", count: stats.resolved },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  active
                    ? "bg-[#111827] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? "bg-white/20 text-white" : "bg-white text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:bg-white focus:outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            title="Refresh Enquiries"
            className="p-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Enquiries Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-accent animate-spin mb-3" />
            <p className="text-xs text-gray-500 font-medium">Loading contact enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
            <Inbox className="w-12 h-12 text-gray-300 mb-3 stroke-[1.5]" />
            <p className="text-sm font-bold text-gray-700 mb-1">No enquiries found</p>
            <p className="text-xs text-gray-500 max-w-sm">
              {searchQuery
                ? "No contact submissions match your search query. Try clearing the filter."
                : "No enquiries have been submitted in this category yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-[#fcfbf9] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">REF / DATE</th>
                  <th className="py-3.5 px-4">SENDER INFO</th>
                  <th className="py-3.5 px-4">CATEGORY &amp; SUBJECT</th>
                  <th className="py-3.5 px-4">MESSAGE SNIPPET</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((item) => {
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEnquiry(item)}
                    >
                      {/* Ref & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-[11px] text-gray-900 group-hover:text-accent transition-colors">
                          {item.reference_number}
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {dateStr}
                        </div>
                      </td>

                      {/* Sender Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-xs">{item.name}</div>
                        <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" /> {item.email}
                        </div>
                        {item.phone && (
                          <div className="text-gray-400 text-[10px] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {item.phone}
                          </div>
                        )}
                      </td>

                      {/* Category & Subject */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[9px] font-bold uppercase tracking-wider mb-1">
                          {item.category || "General"}
                        </span>
                        <div className="font-semibold text-gray-800 text-xs truncate">
                          {item.subject || "General Inquiry"}
                        </div>
                      </td>

                      {/* Message Snippet */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed">
                          {item.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(item)}
                            className="p-1.5 text-gray-500 hover:text-accent hover:bg-orange-50 rounded border border-gray-200 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id, item.reference_number)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Enquiry Detail Modal / Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-[#111827] text-white flex items-start justify-between border-b border-gray-800">
              <div>
                <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
                  ENQUIRY DETAILS
                </div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wide">
                  {selectedEnquiry.reference_number}
                </h3>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedEnquiry.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Sender Details Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Sender Name
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{selectedEnquiry.name}</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Category
                  </div>
                  <span className="inline-block px-2.5 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-bold uppercase">
                    {selectedEnquiry.category || "General"}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Email Address
                  </div>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=RE: ${encodeURIComponent(
                      selectedEnquiry.subject || "UPHA Enquiry"
                    )}`}
                    className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5" /> {selectedEnquiry.email}
                  </a>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Contact Phone
                  </div>
                  {selectedEnquiry.phone ? (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="text-xs text-gray-800 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {selectedEnquiry.phone}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Not provided</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Subject Line
                </div>
                <div className="text-sm font-bold text-gray-900 bg-white border border-gray-200 p-3 rounded-lg">
                  {selectedEnquiry.subject || "General Enquiry"}
                </div>
              </div>

              {/* Full Message Body */}
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Message Content
                </div>
                <div className="text-sm text-gray-800 bg-white border border-gray-200 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Updater */}
              <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Update Processing Status
                  </label>
                  <select
                    value={selectedEnquiry.status || "pending"}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                    disabled={updatingId === selectedEnquiry.id}
                    className="text-xs font-bold border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:border-accent"
                  >
                    <option value="pending">⏳ Pending Review</option>
                    <option value="in_progress">⚙️ In Progress</option>
                    <option value="resolved">✅ Resolved / Answered</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=RE: ${encodeURIComponent(
                      selectedEnquiry.subject || "UPHA Enquiry"
                    )}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply by Email
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedEnquiry.id, selectedEnquiry.reference_number)}
                    className="px-3 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded transition-colors"
                    title="Delete this message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
