"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function LoginPage() {
  const { login, authUser, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverWarm, setServerWarm] = useState(false);
  const [serverChecking, setServerChecking] = useState(true);
  const pingRef = useRef(false);
  // ── Pre-warm the backend server on page load ─────────────────────────────────
  // Render free-tier services spin down after 15 min of inactivity and take
  // 7–30 seconds to wake up. We fire a lightweight ping immediately so the
  // server is hot by the time the user clicks "Sign In".
  useEffect(() => {
    if (pingRef.current) return;
    pingRef.current = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s max

    const pingUrl = API_BASE.endsWith("/api") ? `${API_BASE}/settings/` : `${API_BASE}/api/settings/`;
    fetch(pingUrl, {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
      cache: "no-store",
    })
      .then(() => setServerWarm(true))
      .catch(() => setServerWarm(true)) // still mark warm — let user try
      .finally(() => {
        clearTimeout(timeout);
        setServerChecking(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);
  // Redirect already-logged-in users to their dashboard
  useEffect(() => {
    if (!loading && authUser) {
      const path =
        authUser.role === "admin" ? "/dashboard/admin" :
        authUser.role === "coach" ? "/dashboard/coach" :
        authUser.role === "referee" ? "/dashboard/player" :
        "/dashboard/player";
      router.replace(path);
    }
  }, [loading, authUser, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user && user.role === "admin") {
        router.replace("/dashboard/admin");
      }
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Login failed.";

      // Translate technical or generic errors into user-friendly messages
      if (msg.toLowerCase().includes("invalid login credentials") || msg.includes("401")) {
        msg = "The email or password you entered is incorrect. Please try again.";
      } else if (msg.toLowerCase().includes("failed to fetch") || msg.includes("NetworkError")) {
        msg = "Unable to connect to the server. Please check your internet connection.";
      } else if (msg.includes("Unexpected token") || msg.includes("500") || msg.includes("SyntaxError")) {
        msg = "We're experiencing technical difficulties. Please try again in a few minutes.";
      }

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo + Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-5">
            <Image src="/upha.png" alt="UPHA Logo" width={96} height={96} className="object-contain w-full h-full" />
          </div>
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
            Member Portal
          </div>
          <h1 className="font-heading text-4xl font-bold uppercase text-primary tracking-wide">
            SIGN IN
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Uttar Pradesh Handball Association
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8">
          {/* Server warm-up status */}
          {serverChecking && (
            <div className="mb-5 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-sm text-xs">
              <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Connecting to server… this may take a few seconds on first load.
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-gray-50 pl-4 pr-11 py-3 rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#111827] hover:bg-[#1f2937] disabled:opacity-50 text-white py-4 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  SIGNING IN…
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <a href="/register/player" className="text-accent font-bold hover:underline">
                Register here
              </a>
            </p>
            <div className="pt-2 border-t border-gray-100">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-accent transition-colors"
              >
                UPHA Administrator? Sign in to Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6 tracking-widest uppercase">
          &copy; 2026 UPHA &middot; All rights reserved
        </p>
      </div>
    </main>
  );
}
