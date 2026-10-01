"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ChevronDown, LogOut, User, Phone, Mail, Key, Bell, ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getNotifications, markNotificationRead, NotificationData } from "@/lib/api";
import SettingsModal from "@/components/SettingsModal";
import { useSettings } from "@/context/SettingsContext";

export default function Navbar() {
  const pathname = usePathname();
  const { authUser, logout, loading } = useAuth();
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const contactMobile = settings?.contact_mobile || "+91 75700 99990";
  const contactEmail = settings?.contact_email || "upha2024@gmail.com";

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (authUser) {
      getNotifications().then((res) => {
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
        }
      });
    }
  }, [authUser]);

  const handleNotificationClick = async (notif: NotificationData) => {
    if (!notif.is_read) {
      await markNotificationRead(notif.id);
      // Immediately remove the notification from the list since it's deleted on the backend
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNavClass = (path: string) => {
    if (path.includes("#")) return "hover:text-accent transition-colors whitespace-nowrap";
    return pathname === path
      ? "text-accent border-b-2 border-accent pb-1 whitespace-nowrap"
      : "hover:text-accent transition-colors whitespace-nowrap";
  };

  const dashboardPath =
    authUser?.role === "admin"
      ? "/dashboard/admin"
      : authUser?.role === "coach"
        ? "/dashboard/coach"
        : authUser?.role === "referee"
          ? "/dashboard/player"
          : "/dashboard/player";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide navbar on admin panel
  if (pathname?.startsWith("/dashboard/admin") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Top Bar - Natural document scroll, zero layout shift */}
      <div className="hidden sm:block bg-[#111827] text-gray-300 border-b border-gray-800 text-[10px] md:text-xs font-medium py-2.5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span className="tracking-wide">{contactMobile}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span className="tracking-wide">{contactEmail}</span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4">
            <Link href="/database" className="hover:text-white transition-colors tracking-wide">Affiliated Districts</Link>
            <span className="text-gray-600 text-[10px]">■</span>
            <Link href="/announcements" className="hover:text-white transition-colors tracking-wide">Announcements</Link>
            <span className="text-gray-600 text-[10px]">■</span>
            {!mounted || loading ? (
              <div className="w-24 h-4 bg-gray-700 animate-pulse rounded-sm"></div>
            ) : authUser ? (
              <span className="text-gray-300 tracking-wide font-bold">
                Welcome, {authUser.name?.split(' ')[0] || "User"}
              </span>
            ) : (
              <Link href="/login" className="hover:text-white transition-colors tracking-wide font-bold">Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar - Stable height, zero jitter, elegant shadow elevation */}
      <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b transition-shadow duration-200 ${scrolled ? "shadow-md border-gray-200" : "shadow-sm border-gray-100"}`}>
        <div className="py-3 sm:py-3.5">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-[58px] h-[58px] bg-white rounded-full flex items-center justify-center shrink-0 p-1 border border-gray-100 shadow-xs">
                <Image src="/upha.png" alt="UPHA Logo" width={54} height={54} className="object-contain w-full h-full" priority />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-wide leading-none text-primary group-hover:text-accent transition-colors">UPHA</h1>
                <div className="text-[9px] tracking-widest text-gray-500 uppercase mt-1 leading-tight">
                  UTTAR PRADESH<br />HANDBALL ASSN.
                </div>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-primary">
              <Link href="/" className={getNavClass("/")}>Home</Link>
              <Link href="/about" className={getNavClass("/about")}>About</Link>
              <Link href="/calendar" className={getNavClass("/calendar")}>Events</Link>
              <Link href="/database" className={getNavClass("/database")}>Database</Link>
              <Link href="/achievements" className={getNavClass("/achievements")}>Achievements</Link>
              <Link href="/gallery" className={getNavClass("/gallery")}>Gallery</Link>
              <Link href="/agm" className={getNavClass("/agm")}>AGM</Link>
              <Link href="/more-links" className={getNavClass("/more-links")}>More Links</Link>
              <Link href="/contact" className={getNavClass("/contact")}>Contact</Link>
            </nav>

            {/* CTA / User actions */}
            <div className="hidden md:flex items-center gap-3">
              {!mounted || loading ? (
                <div className="w-[140px] h-[36px] bg-gray-200 animate-pulse rounded-sm"></div>
              ) : authUser ? (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  {authUser && (
                    <div className="relative" ref={notifRef}>
                      <button
                        type="button"
                        onClick={() => setNotifDropdownOpen((o) => !o)}
                        className="relative border border-gray-200 rounded-full w-[42px] h-[42px] flex items-center justify-center text-primary hover:bg-gray-50 transition-colors"
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-accent rounded-full border-[1.5px] border-white box-content"></span>
                        )}
                      </button>
                      {notifDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-sm shadow-lg overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-widest text-primary">
                            Notifications
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="px-4 py-6 text-center text-sm text-gray-500">
                                No new notifications
                              </div>
                            ) : (
                              notifications.map(notif => (
                                <div
                                  key={notif.id}
                                  onClick={() => handleNotificationClick(notif)}
                                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${notif.is_read ? 'opacity-60 bg-white hover:bg-gray-50' : 'bg-orange-50 hover:bg-orange-100'}`}
                                >
                                  <div className="text-sm font-semibold text-primary mb-1">{notif.title}</div>
                                  <div className="text-xs text-gray-600 line-clamp-2">{notif.message}</div>
                                  <div className="text-[10px] text-gray-400 mt-2">
                                    {new Date(notif.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Logged-in: Dashboard dropdown ── */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center border border-gray-200 bg-white rounded-full transition-colors hover:bg-gray-50">
                      <Link
                        href={dashboardPath}
                        className="flex items-center gap-3 pl-1.5 pr-2 py-1.5 rounded-l-full"
                      >
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider">
                          {authUser?.name ? authUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-xs font-bold text-primary leading-none">{authUser?.name || authUser?.email}</span>
                          <span className="text-[9px] font-mono text-gray-400 font-medium uppercase tracking-widest leading-none mt-1">
                            UPHA-{authUser?.role ? authUser.role.substring(0, 3).toUpperCase() : 'USR'}-{(authUser?.id || 0).toString().padStart(5, '0')}
                          </span>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="pr-4 pl-2 py-1.5 rounded-r-full outline-none flex items-center h-full"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Dropdown panel */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-sm shadow-lg py-1 z-50">
                        {/* User info pill */}
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Signed in as</p>
                          <p className="text-xs font-semibold text-primary truncate mt-0.5">{authUser.name || authUser.email}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{authUser.role}</p>
                        </div>

                        {/* Admin Dashboard shortcut — only for admins */}
                        {authUser.role === "admin" && (
                          <Link
                            href="/dashboard/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-accent hover:bg-blue-50 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Admin Dashboard
                          </Link>
                        )}

                        {/* My Dashboard — for all non-admin roles */}
                        {authUser.role !== "admin" && (
                          <Link
                            href={dashboardPath}
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            My Dashboard
                          </Link>
                        )}

                        {/* Settings Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            setSettingsOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Account Settings
                        </button>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-1" />

                        {/* Logout */}
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ── Logged-out: Register Now button ── */
                <Link
                  href="/register"
                  className="bg-accent text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors rounded-sm"
                >
                  REGISTER NOW &rarr;
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-3">
              {/* Notifications for mobile */}
              {mounted && authUser && (
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotifDropdownOpen((o) => !o)}
                    className="relative border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-primary hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-accent rounded-full border-[1.5px] border-white box-content"></span>
                    )}
                  </button>
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-sm shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-widest text-primary">
                        Notifications
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${notif.is_read ? 'opacity-60 bg-white hover:bg-gray-50' : 'bg-orange-50 hover:bg-orange-100'}`}
                            >
                              <div className="text-sm font-semibold text-primary mb-1">{notif.title}</div>
                              <div className="text-xs text-gray-600 line-clamp-2">{notif.message}</div>
                              <div className="text-[10px] text-gray-400 mt-2">
                                {new Date(notif.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-primary p-1 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 shadow-sm absolute w-full left-0 z-40">
            <div className="flex flex-col px-6 py-4 space-y-4 text-sm font-semibold text-primary">
              <Link href="/" className={getNavClass("/")} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/about" className={getNavClass("/about")} onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/calendar" className={getNavClass("/calendar")} onClick={() => setMobileMenuOpen(false)}>Events</Link>
              <Link href="/database" className={getNavClass("/database")} onClick={() => setMobileMenuOpen(false)}>Database</Link>
              <Link href="/achievements" className={getNavClass("/achievements")} onClick={() => setMobileMenuOpen(false)}>Achievements</Link>
              <Link href="/gallery" className={getNavClass("/gallery")} onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
              <Link href="/agm" className={getNavClass("/agm")} onClick={() => setMobileMenuOpen(false)}>AGM</Link>
              <Link href="/more-links" className={getNavClass("/more-links")} onClick={() => setMobileMenuOpen(false)}>More Links</Link>
              <Link href="/contact" className={getNavClass("/contact")} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              
              <div className="border-t border-gray-100 pt-4 mt-2">
                {!mounted || loading ? (
                  <div className="w-full h-8 bg-gray-200 animate-pulse rounded-sm"></div>
                ) : authUser ? (
                  <div className="flex flex-col space-y-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Logged in as <span className="text-primary">{authUser.name || authUser.email}</span>
                    </div>
                    {authUser.role === "admin" && (
                      <Link href="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-accent">
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    {authUser.role !== "admin" && (
                      <Link href={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-accent">
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                      </Link>
                    )}
                    <button onClick={() => { setMobileMenuOpen(false); setSettingsOpen(true); }} className="flex items-center gap-3 text-left hover:text-accent">
                      <Key className="w-4 h-4" /> Account Settings
                    </button>
                    <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex items-center gap-3 text-left text-red-500 hover:text-red-600">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="font-bold flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-sm hover:bg-gray-50">
                      <LogOut className="w-4 h-4 rotate-180" /> Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="bg-accent text-white text-center py-2.5 rounded-sm font-bold uppercase tracking-widest">
                      Register Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

