"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDashboardHeader, { AdminTabType } from "./AdminDashboardHeader";
import AdminSidebar from "./AdminSidebar";
import PendingReviewsTable from "./PendingReviewsTable";
import RecentDecisionsLog from "./RecentDecisionsLog";

import InviteAdminModal from "./InviteAdminModal";
import ManageAnnouncementsPanel from "./ManageAnnouncementsPanel";
import CreateEventModal from "./CreateEventModal";
import UploadResultsModal from "./UploadResultsModal";
import UploadGalleryModal from "./UploadGalleryModal";
import CouncilMembersTable from "./CouncilMembersTable";
import ManageAchievements from "./ManageAchievements";
import SystemSettingsPanel from "./SystemSettingsPanel";
import IssueCertificatesPanel from "./IssueCertificatesPanel";
import ManageAGMLetters from "./ManageAGMLetters";
import ManageFormsPanel from "./ManageFormsPanel";
import ManageCoachesPanel from "./ManageCoachesPanel";
import ManageEnquiriesPanel from "./ManageEnquiriesPanel";

import { createEvent, CreateEventPayload, getAdminStats, AdminStatsData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Menu, ArrowLeft, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabType>("dashboard");
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchStats = useCallback(() => {
    setStatsLoading(true);
    getAdminStats()
      .then((res) => {
        if (res.success) {
          setStats(res.stats);
        }
      })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, [fetchStats]);

  const handleTabChange = (tab: AdminTabType) => {
    setActiveTab(tab);
    if (tab === "dashboard") {
      fetchStats();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateEvent = async (form: CreateEventPayload | FormData) => {
    try {
      await createEvent(form);
      setToast("Event created successfully!");
      fetchStats();
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast(`Error: ${err.message || "Failed to create event"}`);
      setTimeout(() => setToast(null), 4000);
    }
  };

  useEffect(() => {
    if (!loading && (!authUser || authUser.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [loading, authUser, router]);

  if (!mounted || loading || !authUser || authUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#fcfbf9] flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#111827] text-white px-6 py-3.5 rounded-lg text-xs font-bold tracking-widest shadow-2xl border border-gray-700">
          {toast}
        </div>
      )}

      {/* Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        stats={stats}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Control Bar for Admin Area */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Info */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">ADMIN WORKSPACE</span>
              <span className="text-gray-300">/</span>
              <span className="text-primary font-bold">{activeTab.replace(/_/g, " ")}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:text-accent hover:bg-gray-50 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statsLoading ? "animate-spin text-accent" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {activeTab !== "dashboard" && (
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent hover:text-white bg-orange-50 hover:bg-accent border border-orange-200 px-3 py-1.5 rounded-md transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Page Content Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Header Banner (Cards shown only when activeTab === 'dashboard') */}
          <AdminDashboardHeader
            stats={stats}
            loading={statsLoading}
            activeTab={activeTab}
          />

          {/* Workspace Tab Contents */}
          <div className="mt-6">
            {/* View 1: Overview Dashboard (Stats Cards + Quick Actions + Recent Activity) */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">APPLICATIONS</span>
                      <span className="text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </div>
                    <div className="text-sm font-bold text-primary">Approve Registrations</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{stats?.total_pending ?? 0} pending review</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("create_event")}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">EVENTS</span>
                      <span className="text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </div>
                    <div className="text-sm font-bold text-primary">Create Tournament</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{stats?.active_events ?? 0} active tournaments</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("upload_results")}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-amber-500 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">RESULTS</span>
                      <span className="text-xs font-bold text-amber-500 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </div>
                    <div className="text-sm font-bold text-primary">Publish Results</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Post scores & standings</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("system_settings")}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SETTINGS</span>
                      <span className="text-xs font-bold text-purple-500 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </div>
                    <div className="text-sm font-bold text-primary">System Config</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">UPI QR & Fee settings</div>
                  </button>
                </div>

                {/* Recent Activity */}
                <div>
                  <RecentDecisionsLog />
                </div>
              </div>
            )}

            {/* View 2: Approve Applications Table with Pagination */}
            {activeTab === "applications" && (
              <div id="recent-applications">
                <PendingReviewsTable />
              </div>
            )}

            {/* View 3: Sub-panels for other toolkit options */}
            {activeTab !== "dashboard" && activeTab !== "applications" && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-12">
                {/* Panel Top Navigation Bar */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-heading text-lg font-bold uppercase tracking-wider text-primary">
                      {activeTab.replace(/_/g, " ")}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-accent border border-gray-200 bg-white px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                  </button>
                </div>

                {/* Embedded Tool Panel */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {activeTab === "invite_admin" && (
                    <InviteAdminModal onClose={() => setActiveTab("dashboard")} />
                  )}
                  {activeTab === "publish_notice" && <ManageAnnouncementsPanel />}
                  {activeTab === "create_event" && (
                    <CreateEventModal
                      onSubmit={async (form) => {
                        await handleCreateEvent(form);
                        setActiveTab("dashboard");
                      }}
                    />
                  )}
                  {activeTab === "upload_results" && <UploadResultsModal />}
                  {activeTab === "upload_gallery" && <UploadGalleryModal />}
                  {activeTab === "council_members" && <CouncilMembersTable />}
                  {activeTab === "manage_achievements" && <ManageAchievements />}
                  {activeTab === "system_settings" && <SystemSettingsPanel />}
                  {activeTab === "issue_certificates" && <IssueCertificatesPanel />}
                  {activeTab === "manage_agm" && <ManageAGMLetters />}
                  {activeTab === "manage_forms" && <ManageFormsPanel />}
                  {activeTab === "manage_coaches" && (
                    <ManageCoachesPanel onClose={() => setActiveTab("dashboard")} />
                  )}
                  {activeTab === "enquiries" && <ManageEnquiriesPanel />}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
