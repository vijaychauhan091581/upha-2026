"use client";

import React from "react";
import { AdminStatsData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Clock, CheckCircle2, Calendar, Image as ImageIcon } from "lucide-react";

export type AdminTabType =
  | "dashboard"
  | "applications"
  | "create_event"
  | "upload_results"
  | "upload_gallery"
  | "invite_admin"
  | "publish_notice"
  | "council_members"
  | "manage_achievements"
  | "system_settings"
  | "issue_certificates"
  | "manage_agm"
  | "manage_forms"
  | "manage_coaches";

const TAB_TITLES: Record<AdminTabType, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Overview Dashboard",
    subtitle: "Federation overview, real-time statistics, and recent activity log.",
  },
  applications: {
    title: "Approve Applications",
    subtitle: "Review and approve pending registrations for players, coaches, referees, academies, and districts.",
  },
  council_members: {
    title: "Council Members",
    subtitle: "Manage office bearers displayed on the official council page and homepage.",
  },
  manage_coaches: {
    title: "Licensed Coaches",
    subtitle: "Official roster of licensed coaches, certificates, and district assignments.",
  },
  create_event: {
    title: "Create / Modify Event",
    subtitle: "Set up tournaments, state trials, coaching clinics, and selection camps.",
  },
  upload_results: {
    title: "Tournament Results",
    subtitle: "Publish final rankings, team standings, scoresheets, and best player awards.",
  },
  issue_certificates: {
    title: "Issue Certificates",
    subtitle: "Generate and issue official participation and merit certificates to players.",
  },
  upload_gallery: {
    title: "Media Gallery",
    subtitle: "Upload tournament photos, state championship highlights, and album albums.",
  },
  publish_notice: {
    title: "Announcements & Notices",
    subtitle: "Manage, publish, edit, and broadcast official circulars across the homepage ticker and member dashboards.",
  },
  manage_achievements: {
    title: "Achievements & Awards",
    subtitle: "Record national medals, state honors, and federation milestones.",
  },
  manage_agm: {
    title: "AGM Letters",
    subtitle: "Upload signed Annual General Meeting letters and official resolutions.",
  },
  manage_forms: {
    title: "Forms & Affiliation Letters",
    subtitle: "Manage official affiliation application forms, rulebooks, and PDF downloads.",
  },
  invite_admin: {
    title: "Invite Admin",
    subtitle: "Grant admin access and role-based permissions to federation staff.",
  },
  system_settings: {
    title: "System Settings",
    subtitle: "Configure official registration fees and the federation UPI payment QR code.",
  },
};

export default function AdminDashboardHeader({
  stats = null,
  loading = false,
  activeTab = "applications",
  onTabChange,
}: {
  stats?: AdminStatsData | null;
  loading?: boolean;
  activeTab?: AdminTabType;
  onTabChange?: (tab: AdminTabType) => void;
}) {
  const { authUser } = useAuth();

  const today = new Date();
  const dayName = today
    .toLocaleDateString("en-IN", { weekday: "long" })
    .toUpperCase();
  const dateStr = today
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.applications;

  return (
    <div className="mb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              ADMIN PANEL
            </span>
            <span className="text-gray-300">&bull;</span>
            <span className="bg-[#111827] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-sm">
              FEDERATION OFFICE
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide text-primary">
            WELCOME,{" "}
            <span className="text-accent">
              {authUser?.name?.toUpperCase() || "ADMIN"}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            {currentTabInfo.subtitle}
          </p>
        </div>

        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase sm:text-right shrink-0">
          <div>{dayName}</div>
          <div className="text-gray-800 text-sm font-bold font-mono mt-0.5">
            {dateStr}
          </div>
        </div>
      </div>

      {/* Main Stats Row - ONLY shown on Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Total Pending */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-accent shadow-sm rounded-lg p-5 flex items-start justify-between">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                TOTAL PENDING
              </div>
              <div className="font-heading text-3xl font-bold text-primary">
                {loading ? "—" : stats?.total_pending ?? 0}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Applications awaiting review
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Stat 2: Approved Today */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-emerald-600 shadow-sm rounded-lg p-5 flex items-start justify-between">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                APPROVED TODAY
              </div>
              <div className="font-heading text-3xl font-bold text-primary">
                {loading ? "—" : stats?.approved_today ?? 0}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-1">
                Recent approvals
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Stat 3: Active Events */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-blue-600 shadow-sm rounded-lg p-5 flex items-start justify-between">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                ACTIVE EVENTS
              </div>
              <div className="font-heading text-3xl font-bold text-primary">
                {loading
                  ? "—"
                  : (stats?.active_events || 0).toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {stats?.draft_events || 0} in draft status
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          {/* Stat 4: Gallery Albums */}
          <div className="bg-white border border-gray-200 border-l-4 border-l-purple-600 shadow-sm rounded-lg p-5 flex items-start justify-between">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                GALLERY ALBUMS
              </div>
              <div className="font-heading text-3xl font-bold text-primary">
                {loading
                  ? "—"
                  : (stats?.gallery_albums || 0).toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                Published photo sets
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
