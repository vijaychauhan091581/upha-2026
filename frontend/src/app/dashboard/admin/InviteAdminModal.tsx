"use client";

import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { inviteAdmin } from "@/lib/api";

export default function InviteAdminModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Results
  const [success, setSuccess] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password && password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await inviteAdmin({ email, name, password: password || undefined });
      if (res.success && res.credentials) {
        setCredentials(res.credentials);
        setSuccess(true);
      } else {
        setError(res.message || "Failed to create admin");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (credentials) {
      const text = `UPHA Admin Login Details\nName: ${credentials.name}\nEmail: ${credentials.email}\nPassword: ${credentials.password}\nLogin URL: http://localhost:3000/admin/login`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="bg-white w-full rounded shadow-sm border border-gray-200 relative mb-12">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div>
          <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
            ADMIN &middot; INVITE
          </div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-[#111827]">
            INVITE NEW <span className="text-[#d97c55]">ADMIN</span>
          </h2>
        </div>
      </div>

      {success && credentials ? (
        <div className="p-8 space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-emerald-800 mb-2">Admin Account Created</h3>
            <p className="text-sm text-emerald-600 mb-6">
              Copy these credentials and share them securely with <strong>{credentials.name}</strong>.
            </p>

            <div className="bg-white border border-gray-200 rounded p-4 text-left font-mono text-sm relative">
              <div className="mb-2"><span className="text-gray-400 select-none inline-block w-24">Email:</span> <span className="font-bold">{credentials.email}</span></div>
              <div><span className="text-gray-400 select-none inline-block w-24">Password:</span> <span className="font-bold text-[#d97c55]">{credentials.password}</span></div>

              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#d97c55] transition-colors flex flex-col items-center"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                <span className="text-[8px] uppercase font-bold mt-1 tracking-widest">{copied ? "COPIED" : "COPY"}</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => { setSuccess(false); setCredentials(null); setName(""); setEmail(""); setPassword(""); }}
              className="bg-[#111827] text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
            >
              INVITE ANOTHER
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            
            {/* 01 CONTACT DETAILS */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
                <span className="text-[10px] font-bold text-[#d97c55]">01</span>
                <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                  ACCOUNT DETAILS
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    FULL NAME <span className="text-[#d97c55]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Smt. K. Sinha"
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    EMAIL <span className="text-[#d97c55]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.in"
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    PASSWORD <span className="text-[#d97c55]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#d97c55] transition-colors"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    DESIGNATION (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vice President"
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* 02 PERMISSIONS */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
                <span className="text-[10px] font-bold text-[#d97c55]">02</span>
                <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                  PERMISSIONS <span className="text-[#d97c55]">*</span>
                </h3>
              </div>
              <p className="text-[10px] text-gray-400 mb-4">
                These permissions determine what the new admin can do.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-4 border border-[#d97c55] bg-[#d97c55]/10 rounded cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="mt-1 accent-[#d97c55]" />
                  <div>
                    <div className="text-xs font-bold text-[#d97c55]">Full Dashboard Access</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Admin will have full access to approve applications and modify events.</div>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[10px] text-gray-400 font-mono">
              Credentials shown on screen — share them securely with the new admin
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none bg-[#d97c55] text-white px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#c16744] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {loading ? "CREATING..." : "CREATE ADMIN"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
