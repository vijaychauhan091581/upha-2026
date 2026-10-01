"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertTriangle, ArrowLeft, ArrowRight, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const { adminLogin, authUser, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated as admin, redirect directly to admin dashboard
  useEffect(() => {
    if (!loading && authUser && authUser.role === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [loading, authUser, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await adminLogin(email.trim(), password);
      // Redirection to /dashboard/admin is handled inside adminLogin
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Authentication failed.";

      if (msg.toLowerCase().includes("invalid login credentials") || msg.toLowerCase().includes("invalid email or password") || msg.includes("401")) {
        msg = "The admin email or password you entered is incorrect.";
      } else if (msg.toLowerCase().includes("failed to fetch") || msg.includes("NetworkError")) {
        msg = "Unable to connect to authentication server. Please check your network.";
      }

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between selection:bg-accent selection:text-white relative overflow-hidden">
      {/* Background Ambience / Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[450px] h-[450px] bg-accent/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit to Public Website</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gray-800 text-[10px] font-bold tracking-widest uppercase text-accent">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Restricted Admin Portal</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="bg-[#111827]/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/80">
            {/* Header / Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg mb-4 ring-4 ring-accent/20">
                <Image
                  src="/upha.png"
                  alt="UPHA Official Seal"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="text-[10px] font-bold tracking-[0.25em] text-accent uppercase mb-1.5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                FEDERATION HEADQUARTERS
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
                ADMINISTRATOR SIGN IN
              </h1>

              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Enter your administrative credentials to access the federation control room.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/50 text-red-200 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@upha.in"
                    className="w-full bg-[#0d131f] border border-gray-700/60 focus:border-accent focus:ring-1 focus:ring-accent rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 transition-colors outline-none"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0d131f] border border-gray-700/60 focus:border-accent focus:ring-1 focus:ring-accent rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-500 transition-colors outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>AUTHENTICATING…</span>
                  </>
                ) : (
                  <>
                    <span>ENTER ADMIN WORKSPACE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Card Footer Divider */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center space-y-3">
              <p className="text-xs text-gray-400">
                Not an administrator?{" "}
                <Link href="/login" className="text-accent hover:text-accent/80 font-semibold transition-colors">
                  Player / Coach Member Login &rarr;
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-[11px] text-gray-400">
              UPHA Security Notice: All administrative logins are encrypted and audited.
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Uttar Pradesh Handball Association &middot; Official Portal
            </p>
          </div>
        </div>
      </main>

      {/* Empty bottom spacer for balance */}
      <footer className="relative z-10 py-4 text-center text-[10px] text-gray-400">
        &copy; 2026 UPHA &middot; All Rights Reserved
      </footer>
    </div>
  );
}
