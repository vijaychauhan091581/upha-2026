"use client";

import { useState } from "react";
import { updateCredentials } from "@/lib/api";
import { Key, ArrowRight, X, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { authUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState(authUser?.email || "");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const pNewPass = newPassword ? newPassword : undefined;
      const pNewEmail = newEmail !== authUser?.email ? newEmail : undefined;
      
      if (!pNewPass && !pNewEmail) {
        setError("No changes made.");
        setLoading(false);
        return;
      }

      const res = await updateCredentials(currentPassword, pNewPass, pNewEmail);
      if (res.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Refresh auth user context
        if (pNewEmail) {
          window.location.reload();
        }
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="bg-white border border-gray-200 shadow-xl rounded-sm w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-12 px-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] mb-2">Settings Updated!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your account credentials have been changed successfully.
            </p>
          </div>
        ) : (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[#111827] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-5 h-5" />
              </div>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827]">
                Account Settings
              </h2>
              <p className="text-xs text-gray-500 mt-1">Update your email or password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-sm text-xs font-bold uppercase tracking-wide border border-red-100 text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Required to make changes"
                />
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Update Email (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors bg-gray-50 focus:bg-white"
                  placeholder="New email address"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Leave blank to keep current"
                />
              </div>

              {newPassword && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required={!!newPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Retype new password"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111827] hover:bg-black text-white px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 group disabled:opacity-50"
                >
                  {loading ? "SAVING..." : "SAVE CHANGES"}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
