"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckSquare,
  CalendarDays,
  Trophy,
  Image as ImageIcon,
  UserPlus,
  Megaphone,
  Users,
  Award,
  FileBadge,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  Globe,
  X,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { AdminStatsData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AdminTabType } from "./AdminDashboardHeader";

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
  stats: AdminStatsData | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  id: AdminTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: (stats: AdminStatsData | null) => React.ReactNode;
}

interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  stats,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const { authUser, logout } = useAuth();

  const navGroups: NavGroupConfig[] = [
    {
      title: "APPLICATIONS & CADRE",
      items: [
        {
          id: "applications",
          label: "Approve Applications",
          icon: CheckSquare,
          badge: (s) => {
            const count = s?.total_pending ?? 0;
            return (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono transition-colors ${
                  count > 0
                    ? "bg-accent text-white animate-pulse"
                    : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}
              >
                {count} PENDING
              </span>
            );
          },
        },
        {
          id: "council_members",
          label: "Council Members",
          icon: Users,
        },
        {
          id: "manage_coaches",
          label: "Licensed Coaches",
          icon: Briefcase,
        },
      ],
    },
    {
      title: "EVENTS & RESULTS",
      items: [
        {
          id: "create_event",
          label: "Create / Modify Event",
          icon: CalendarDays,
          badge: (s) => (
            <span className="text-[10px] font-mono text-gray-400">
              {s?.active_events ?? 0} active
            </span>
          ),
        },
        {
          id: "upload_results",
          label: "Tournament Results",
          icon: Trophy,
          badge: (s) => {
            const count = s?.results_awaiting ?? 0;
            return count > 0 ? (
              <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded">
                {count} pending
              </span>
            ) : null;
          },
        },
        {
          id: "issue_certificates",
          label: "Issue Certificates",
          icon: FileBadge,
        },
      ],
    },
    {
      title: "MEDIA & CONTENT",
      items: [
        {
          id: "upload_gallery",
          label: "Upload Gallery",
          icon: ImageIcon,
          badge: (s) => (
            <span className="text-[10px] font-mono text-gray-400">
              {s?.gallery_albums ?? 0} albums
            </span>
          ),
        },
        {
          id: "publish_notice",
          label: "Announcements & Notices",
          icon: Megaphone,
          badge: (s) => (
            <span className="text-[10px] font-mono text-gray-400">
              {s?.scheduled_notices ?? 0} live
            </span>
          ),
        },
        {
          id: "manage_achievements",
          label: "Achievements",
          icon: Award,
        },
        {
          id: "manage_agm",
          label: "AGM Letters",
          icon: FileText,
        },
        {
          id: "manage_forms",
          label: "Official Forms",
          icon: FileText,
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          id: "invite_admin",
          label: "Invite Admin",
          icon: UserPlus,
          badge: (s) => (
            <span className="text-[10px] font-mono text-gray-400">
              {s?.active_admins ?? 0} active
            </span>
          ),
        },
        {
          id: "system_settings",
          label: "System Settings",
          icon: Settings,
        },
      ],
    },
  ];

  const handleItemClick = (id: AdminTabType) => {
    onTabChange(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] text-gray-300 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800 shrink-0">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-md">
              <Image
                src="/upha.png"
                alt="UPHA Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-heading text-lg font-bold uppercase tracking-wider text-white group-hover:text-accent transition-colors leading-none">
                UPHA ADMIN
              </div>
              <div className="text-[8px] font-bold tracking-widest text-accent uppercase mt-1">
                FEDERATION PORTAL
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Admin Pill */}
        <div className="mt-5 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold font-heading shrink-0 shadow-sm">
            {authUser?.name
              ? authUser.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate leading-tight">
              {authUser?.name || "Administrator"}
            </div>
            <div className="text-[9px] text-[#d97c55] font-semibold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              SUPER ADMIN
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {/* Top-Level Dashboard Button */}
        <div>
          <button
            onClick={() => handleItemClick("dashboard")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all group ${
              activeTab === "dashboard"
                ? "bg-[#d97c55]/20 text-white font-bold border-l-4 border-accent shadow-md shadow-black/20"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <LayoutDashboard
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTab === "dashboard"
                    ? "text-accent"
                    : "text-gray-400 group-hover:text-accent"
                }`}
              />
              <span className="truncate">Overview Dashboard</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              {stats?.total_pending ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono bg-accent/20 text-accent border border-accent/40">
                  {stats.total_pending}
                </span>
              ) : null}
              {activeTab === "dashboard" && (
                <ChevronRight className="w-3.5 h-3.5 text-accent" />
              )}
            </div>
          </button>
        </div>

        <div className="h-px bg-gray-800 mx-2" />

        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <div className="text-[9px] font-bold tracking-[0.2em] text-[#d97c55]/90 uppercase px-3 mb-2">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all group ${
                      isActive
                        ? "bg-[#d97c55]/20 text-white font-bold border-l-4 border-accent shadow-md shadow-black/20"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-accent"
                            : "text-gray-400 group-hover:text-accent"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.badge && item.badge(stats)}
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-accent" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-800 shrink-0 space-y-2 bg-[#0c131f]">
        <button
          type="button"
          onClick={async () => {
            await logout("/");
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left group"
          title="Exit Admin Panel & Browse Public Website (Ends Admin Session)"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#d97c55] group-hover:text-accent transition-colors" />
            <div>
              <div>View Public Website</div>
              <div className="text-[9px] text-gray-500 font-normal">Ends Admin Session</div>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={async () => {
            await logout("/admin/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 xl:w-80 h-screen sticky top-0 shrink-0 z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <aside className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
