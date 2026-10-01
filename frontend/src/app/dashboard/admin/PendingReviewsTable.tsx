"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Check,
  CheckCheck,
  X,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  FileSpreadsheet,
  Trash2,
  MoreVertical,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import {
  listPlayers,
  listCoaches,
  listReferees,
  listAcademies,
  listDistricts,
  approvePlayerPayment,
  approveCoachPayment,
  approveRefereePayment,
  approveAcademyPayment,
  approveDistrictPayment,
  deleteRegistration,
  PlayerData,
  CoachData,
  RefereeData,
  AcademyData,
  DistrictData,
} from "@/lib/api";
import EditRegistrationModal from "./EditRegistrationModal";
import CsvImportExportModal, { exportApplicantsToCsv } from "./CsvImportExportModal";

type CategoryFilter = "ALL" | "PLAYERS" | "REFEREES" | "ACADEMIES" | "DISTRICTS" | "COACHES";
type StatusFilter = "ALL" | "PENDING" | "APPROVED";

export type Applicant =
  | { type: "player"; data: PlayerData }
  | { type: "coach"; data: CoachData }
  | { type: "referee"; data: RefereeData }
  | { type: "academy"; data: AcademyData }
  | { type: "district"; data: DistrictData };

function getName(a: Applicant) {
  if (!a || !a.data) return "—";
  if (a.type === "academy" || a.type === "district") return a.data.name || "—";
  return a.data.user?.name || "—";
}
function getEmail(a: Applicant) {
  if (!a || !a.data) return "—";
  if (a.type === "academy" || a.type === "district") return (a.data as any).email || "—";
  return a.data.user?.email || "—";
}
function getDistrict(a: Applicant) {
  if (!a || !a.data) return "—";
  return a.data.district || "—";
}
function getId(a: Applicant) {
  if (!a || !a.data) return 0;
  return a.data.id;
}
function isPaid(a: Applicant) {
  return Boolean(a?.data && (a.data as any).paid);
}
function getReference(a: Applicant) {
  if (!a || !a.data) return "—";
  const prefix =
    a.type === "player"
      ? "APP-PLR"
      : a.type === "coach"
      ? "APP-CCH"
      : a.type === "referee"
      ? "APP-RFR"
      : a.type === "academy"
      ? "APP-ACA"
      : "APP-DST";
  return `${prefix}-${String(a.data.id || 0).padStart(5, "0")}`;
}

export default function PendingReviewsTable() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [referees, setReferees] = useState<RefereeData[]>([]);
  const [academies, setAcademies] = useState<AcademyData[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State (10, 15, 20, 50 rows per page)
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Panels
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // CSV Import / Export Modal
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvInitialTab, setCsvInitialTab] = useState<"export" | "import">("export");

  // Action Menu Dropdown State (Three Dots)
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  // Close Action Menu when clicking anywhere outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu-dropdown-wrapper")) {
        setOpenMenuKey(null);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const fetchData = async () => {
    try {
      const [p, c, r, a, d] = await Promise.all([
        listPlayers(),
        listCoaches(),
        listReferees(),
        listAcademies(),
        listDistricts(),
      ]);
      setPlayers(p.players || []);
      setCoaches(c.coaches || []);
      setReferees(r.referees || []);
      setAcademies(a.academies || []);
      setDistricts(d.districts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combined list
  const allApplicants: Applicant[] = useMemo(() => {
    return [
      ...players.filter(Boolean).map((d): Applicant => ({ type: "player", data: d })),
      ...referees.filter(Boolean).map((d): Applicant => ({ type: "referee", data: d })),
      ...academies.filter(Boolean).map((d): Applicant => ({ type: "academy", data: d })),
      ...districts.filter(Boolean).map((d): Applicant => ({ type: "district", data: d })),
      ...coaches.filter(Boolean).map((d): Applicant => ({ type: "coach", data: d })),
    ];
  }, [players, referees, academies, districts, coaches]);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return allApplicants.filter((a) => {
      // Category filter
      if (categoryFilter === "PLAYERS" && a.type !== "player") return false;
      if (categoryFilter === "REFEREES" && a.type !== "referee") return false;
      if (categoryFilter === "ACADEMIES" && a.type !== "academy") return false;
      if (categoryFilter === "DISTRICTS" && a.type !== "district") return false;
      if (categoryFilter === "COACHES" && a.type !== "coach") return false;

      // Status filter
      if (statusFilter === "PENDING" && isPaid(a)) return false;
      if (statusFilter === "APPROVED" && !isPaid(a)) return false;

      // Search
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase().trim();
      const name = getName(a).toLowerCase();
      const email = getEmail(a).toLowerCase();
      const district = (getDistrict(a) || "").toLowerCase();
      const ref = getReference(a).toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        district.includes(term) ||
        ref.includes(term)
      );
    });
  }, [allApplicants, categoryFilter, statusFilter, searchTerm]);

  // Reset to page 1 automatically whenever filters, search term, or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, statusFilter, searchTerm, pageSize]);

  // Pagination Calculations
  const totalItems = filteredApplicants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedApplicants = useMemo(() => {
    return filteredApplicants.slice(startIndex, endIndex);
  }, [filteredApplicants, startIndex, endIndex]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (safeCurrentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  const pendingCount = allApplicants.filter((a) => !isPaid(a)).length;
  const approvedCount = allApplicants.filter((a) => isPaid(a)).length;

  function rowKey(a: Applicant) {
    return `${a.type}-${getId(a)}`;
  }

  // Delete Registration
  async function handleDelete(a: Applicant) {
    const name = getName(a);
    const typeLabel = a.type.toUpperCase();
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${typeLabel} "${name}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    const key = rowKey(a);
    const id = getId(a);
    setDeletingId(key);

    try {
      const res = await deleteRegistration(a.type, id);
      if (res.success) {
        setToast(`${typeLabel} "${name}" deleted successfully.`);
        setTimeout(() => setToast(null), 3000);
        if (a.type === "player") {
          setPlayers((prev) => prev.filter((p) => p && p.id !== id));
        } else if (a.type === "coach") {
          setCoaches((prev) => prev.filter((c) => c && c.id !== id));
        } else if (a.type === "referee") {
          setReferees((prev) => prev.filter((r) => r && r.id !== id));
        } else if (a.type === "academy") {
          setAcademies((prev) => prev.filter((ac) => ac && ac.id !== id));
        } else {
          setDistricts((prev) => prev.filter((d) => d && d.id !== id));
        }
        if (expandedId === key) {
          setExpandedId(null);
        }
        fetchData().catch(() => {});
      } else {
        setToast(`Failed to delete: ${res.message || "Unknown error"}`);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err: any) {
      setToast(`Error: ${err?.message || "Failed to delete"}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setDeletingId(null);
    }
  }

  // Single Approve
  async function handleApprove(a: Applicant, notes: string) {
    const key = rowKey(a);
    const applicantId = getId(a);
    setApproving(key);
    try {
      if (a.type === "player") {
        const res = await approvePlayerPayment(applicantId, notes);
        setPlayers((prev) =>
          prev.map((p) =>
            p && p.id === applicantId
              ? (res?.player && res.player.id ? res.player : { ...p, paid: true })
              : p
          )
        );
      } else if (a.type === "coach") {
        const res = await approveCoachPayment(applicantId, notes);
        setCoaches((prev) =>
          prev.map((c) =>
            c && c.id === applicantId
              ? (res?.coach && res.coach.id ? res.coach : { ...c, paid: true })
              : c
          )
        );
      } else if (a.type === "referee") {
        const res = await approveRefereePayment(applicantId, notes);
        setReferees((prev) =>
          prev.map((r) =>
            r && r.id === applicantId
              ? (res?.referee && res.referee.id ? res.referee : { ...r, paid: true })
              : r
          )
        );
      } else if (a.type === "academy") {
        const res = await approveAcademyPayment(applicantId, notes);
        setAcademies((prev) =>
          prev.map((ac) =>
            ac && ac.id === applicantId
              ? (res?.academy && res.academy.id ? res.academy : { ...ac, paid: true })
              : ac
          )
        );
      } else {
        const res = await approveDistrictPayment(applicantId, notes);
        setDistricts((prev) =>
          prev.map((d) =>
            d && d.id === applicantId
              ? (res?.district && res.district.id ? res.district : { ...d, paid: true })
              : d
          )
        );
      }
      setToast(`Application approved for ${getName(a)}`);
      setTimeout(() => setToast(null), 3000);
      setExpandedId(null);
      fetchData().catch(() => {});
    } catch (err) {
      setToast(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setApproving(null);
    }
  }

  // Single Reject
  async function handleReject(a: Applicant, notes: string) {
    import("@/lib/api").then(async ({ rejectApplication }) => {
      const key = rowKey(a);
      setRejecting(key);
      try {
        await rejectApplication(a.type, getId(a), notes);
        if (a.type === "player") {
          setPlayers((prev) => prev.filter((p) => p.id !== getId(a)));
        } else if (a.type === "coach") {
          setCoaches((prev) => prev.filter((c) => c.id !== getId(a)));
        } else if (a.type === "referee") {
          setReferees((prev) => prev.filter((r) => r.id !== getId(a)));
        } else if (a.type === "academy") {
          setAcademies((prev) => prev.filter((ac) => ac.id !== getId(a)));
        } else {
          setDistricts((prev) => prev.filter((d) => d.id !== getId(a)));
        }
        setToast(`Application rejected for ${getName(a)}`);
        setTimeout(() => setToast(null), 3000);
        setExpandedId(null);
      } catch (err) {
        setToast(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
        setTimeout(() => setToast(null), 4000);
      } finally {
        setRejecting(null);
      }
    });
  }

  // Handle Edit Success callback
  const handleEditSuccess = (updatedData: any) => {
    if (!editingApplicant) return;
    const type = editingApplicant.type;
    const id = getId(editingApplicant);

    if (type === "player") {
      setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    } else if (type === "referee") {
      setReferees((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r)));
    } else if (type === "academy") {
      setAcademies((prev) => prev.map((ac) => (ac.id === id ? { ...ac, ...updatedData } : ac)));
    } else if (type === "district") {
      setDistricts((prev) => prev.map((d) => (d.id === id ? { ...d, ...updatedData } : d)));
    } else if (type === "coach") {
      setCoaches((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
    }

    setToast(`Updated ${getName(editingApplicant)} successfully!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#111827] text-white text-xs font-bold tracking-wide px-5 py-3 rounded-md shadow-2xl animate-fade-in flex items-center gap-2 border border-gray-700">
          <CheckCheck className="w-4 h-4 text-[#d97c55]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Header & Controls */}
      <div className="p-6 border-b border-gray-200 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
              REGISTRATION DIRECTORY &amp; MANAGEMENT
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827]">
              All <span className="text-[#d97c55]">Registrations</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              View, review, and edit any player, referee, academy, district unit, or coach registration.
            </p>
          </div>

          {/* CSV Tools Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setCsvInitialTab("export");
                setIsCsvModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold px-3.5 py-2 rounded-lg text-xs shadow-2xs hover:border-[#d97c55] hover:text-[#d97c55] transition-all"
              title="Export Current List to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCsvInitialTab("import");
                setIsCsvModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1f2937] text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm hover:shadow transition-all"
              title="Bulk Import Players or Coaches via CSV"
            >
              <Upload className="w-3.5 h-3.5 text-[#d97c55]" />
              <span>Import CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {/* Top row: Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-1">
              CATEGORY:
            </span>
            {(
              [
                { id: "ALL", label: "All Categories", count: allApplicants.length },
                { id: "PLAYERS", label: "Players", count: players.length },
                { id: "REFEREES", label: "Referees", count: referees.length },
                { id: "ACADEMIES", label: "Academies", count: academies.length },
                { id: "DISTRICTS", label: "District Units", count: districts.length },
                { id: "COACHES", label: "Coaches", count: coaches.length },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  categoryFilter === cat.id
                    ? "bg-[#111827] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-70 font-mono">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Bottom row: Search & Status Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, district, email, or reference ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] text-gray-800"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-sm shrink-0">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  statusFilter === "ALL" ? "bg-white text-[#111827] shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All ({allApplicants.length})
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  statusFilter === "PENDING"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-amber-700 hover:text-amber-900"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter("APPROVED")}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  statusFilter === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-700 hover:text-emerald-900"
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#111827] text-white">
            <tr>
              <th className="py-3.5 px-4 text-[9px] font-bold tracking-widest uppercase text-gray-400">REFERENCE</th>
              <th className="py-3.5 px-4 text-[9px] font-bold tracking-widest uppercase text-gray-400">APPLICANT</th>
              <th className="py-3.5 px-4 text-[9px] font-bold tracking-widest uppercase text-gray-400">CATEGORY</th>
              <th className="py-3.5 px-4 text-[9px] font-bold tracking-widest uppercase text-gray-400">DISTRICT</th>
              <th className="py-3.5 px-4 text-[9px] font-bold tracking-widest uppercase text-gray-400">STATUS</th>
              <th className="py-3.5 px-4 text-[9px] font-bold tracking-widest uppercase text-gray-400 text-right w-16">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400 animate-pulse">
                  Loading applications…
                </td>
              </tr>
            )}

            {!loading && filteredApplicants.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                  No registrations found matching your filters.
                </td>
              </tr>
            )}

            {!loading &&
              paginatedApplicants.map((a) => {
                const key = rowKey(a);
                const isExpanded = expandedId === key;
                const isMenuOpen = openMenuKey === key;
                const initials = getName(a)
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const paid = isPaid(a);

                // Type badge color mapping
                let typeColor = "bg-gray-100 text-gray-600";
                if (a.type === "player") typeColor = "bg-sky-50 text-sky-700 border-sky-200";
                else if (a.type === "coach") typeColor = "bg-[#d97c55]/10 text-[#d97c55] border-[#d97c55]/20";
                else if (a.type === "academy") typeColor = "bg-amber-50 text-amber-700 border-amber-200";
                else if (a.type === "referee") typeColor = "bg-blue-50 text-blue-700 border-blue-200";
                else if (a.type === "district") typeColor = "bg-purple-50 text-purple-700 border-purple-200";

                const photoUrl =
                  a.type === "academy" || a.type === "district"
                    ? (a.data as any).logo
                    : (a.data as any)?.user?.passport_image || (a.data as any)?.passport_image;

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={`transition-colors border-l-4 ${
                        isExpanded
                          ? "bg-[#fff8f6] border-[#d97c55]"
                          : "hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      {/* 1. Reference */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-xs tracking-wider text-[#111827] font-mono">
                          {getReference(a)}
                        </div>
                      </td>

                      {/* 2. Applicant Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {photoUrl ? (
                            <div className="w-9 h-9 rounded-md overflow-hidden border border-gray-200 shrink-0 shadow-xs bg-gray-50">
                              <img
                                src={photoUrl}
                                alt={getName(a)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 shadow-xs ${
                                a.type === "coach"
                                  ? "bg-[#d97c55] text-white"
                                  : a.type === "academy"
                                  ? "bg-[#d9b855] text-white"
                                  : a.type === "referee"
                                  ? "bg-[#111827] text-white"
                                  : a.type === "district"
                                  ? "bg-purple-700 text-white"
                                  : "bg-[#111827] text-white"
                              }`}
                            >
                              <span className="font-heading text-xs font-bold tracking-wider">
                                {initials}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 max-w-[180px] sm:max-w-[220px]">
                            <div className="font-bold text-xs sm:text-sm text-[#111827] truncate">
                              {getName(a)}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono truncate lowercase">
                              {getEmail(a)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Category Type */}
                      <td className="py-3 px-4">
                        <span
                          className={`border px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${typeColor}`}
                        >
                          {a.type}
                        </span>
                      </td>

                      {/* 4. District */}
                      <td className="py-3 px-4 text-xs font-semibold text-gray-700">
                        {getDistrict(a) || "—"}
                      </td>

                      {/* 5. Status Badge */}
                      <td className="py-3 px-4">
                        {paid ? (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            APPROVED
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            PENDING
                          </div>
                        )}
                      </td>

                      {/* 6. Action: Three Dots Action Dropdown Menu */}
                      <td className="py-3 px-4 text-right relative action-menu-dropdown-wrapper">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuKey(isMenuOpen ? null : key);
                            }}
                            className={`p-1.5 rounded-md border transition-all ${
                              isMenuOpen || isExpanded
                                ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                                : "bg-white text-gray-600 border-gray-200 hover:text-[#111827] hover:bg-gray-100 hover:border-gray-300"
                            }`}
                            title="Actions Menu"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Floating Dropdown */}
                          {isMenuOpen && (
                            <div
                              className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedId(isExpanded ? null : key);
                                  setOpenMenuKey(null);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2.5 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#d97c55]" />
                                <span>{isExpanded ? "Close Review" : "Review Details"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingApplicant(a);
                                  setOpenMenuKey(null);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary flex items-center gap-2.5 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                <span>Edit Details</span>
                              </button>

                              <div className="my-1 border-t border-gray-100" />

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuKey(null);
                                  handleDelete(a);
                                }}
                                disabled={deletingId === key}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                <span>{deletingId === key ? "Deleting..." : "Delete Registration"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b-4 border-[#d97c55] bg-[#fcfbf9]">
                          <div className="p-0">
                            {typeof window !== "undefined" && (
                              <React.Suspense fallback={<div className="p-8">Loading review panel...</div>}>
                                {React.createElement(require("./ApplicationReviewPanel").default, {
                                  applicant: a,
                                  onApprove: (notes: string) => handleApprove(a, notes),
                                  onReject: (notes: string) => handleReject(a, notes),
                                  onDelete: () => handleDelete(a),
                                  onClose: () => setExpandedId(null),
                                  approving: approving === key,
                                  rejecting: rejecting === key,
                                  deleting: deletingId === key,
                                })}
                              </React.Suspense>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Bar */}
      <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        {/* Left: Showing entries info */}
        <div className="text-xs text-gray-500 font-medium">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-bold text-gray-800">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-gray-800">{endIndex}</span> of{" "}
              <span className="font-bold text-gray-800">{totalItems}</span> applications
            </>
          ) : (
            "0 applications"
          )}
        </div>

        {/* Center: Interactive Page Numbers */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {pageNumbers.map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 text-xs">
                    …
                  </span>
                );
              }
              const isCurrent = p === safeCurrentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p as number)}
                  className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-[#111827] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Next Page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Page Size Selector (10, 15, 20, 50) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Rows per page:</span>
          <div className="flex items-center gap-1 bg-white border border-gray-200 p-0.5 rounded-lg shadow-2xs">
            {[10, 15, 20, 50].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setPageSize(size)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  pageSize === size
                    ? "bg-[#d97c55] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT REGISTRATION MODAL */}
      {editingApplicant && (
        <EditRegistrationModal
          applicant={editingApplicant}
          onClose={() => setEditingApplicant(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* CSV IMPORT / EXPORT MODAL */}
      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        currentApplicants={filteredApplicants}
        onImportSuccess={() => {
          fetchData();
          setToast("CSV imported successfully!");
          setTimeout(() => setToast(null), 4000);
        }}
        initialTab={csvInitialTab}
      />
    </div>
  );
}
