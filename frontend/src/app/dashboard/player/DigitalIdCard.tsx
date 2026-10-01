"use client";

import { Download, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PlayerData, downloadIdCardPdf } from "@/lib/api";
import { getBackendMediaUrl } from "@/lib/imageUtils";
import RenewalModal from "@/components/RenewalModal";

export default function DigitalIdCard() {
  const { authUser, meData, loading } = useAuth();
  const player = meData as PlayerData | null;
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const getBackendImageUrl = getBackendMediaUrl;

  const isRenewalAvailable = authUser?.valid_through 
    ? (new Date(authUser.valid_through).getTime() - new Date().getTime()) <= 25 * 24 * 60 * 60 * 1000
    : false;

  // Convert any URL to absolute URL (for same-origin assets like /upha.png)
  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (typeof window === "undefined") return url;
    if (url.startsWith("http")) return url;
    return window.location.origin + (url.startsWith("/") ? "" : "/") + url;
  };

  const initials = authUser?.name
    ? authUser.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "?";

  if (loading) {
    return (
      <div className="bg-gray-200 rounded-sm animate-pulse h-72" />
    );
  }

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadIdCard = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadIdCardPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `upha-player-id-${player?.id || 'card'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error("Failed to generate PDF", err);
      alert("Failed to download ID card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Digital ID Card Graphics */}
      <div id="id-card-element" className="bg-[#111827] rounded-sm overflow-hidden shadow-lg flex-1 flex flex-col relative">

        {/* Top Header */}
        <div className="p-6 md:p-8 pb-4 flex justify-between items-start border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shrink-0 shadow-inner">
              <img src={getImageUrl("/upha.png")} alt="UPHA" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-white uppercase leading-none tracking-wide">UPHA</div>
              <div className="text-[7px] font-bold tracking-widest text-gray-400 uppercase mt-1">UTTAR PRADESH HANDBALL ASSN.</div>
            </div>
          </div>

          <div className="border border-[#d97c55]/40 rounded-sm px-3 py-1.5 bg-[#d97c55]/10">
            <div className="text-[8px] font-bold tracking-widest text-accent uppercase">PLAYER MEMBERSHIP</div>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 flex-1">
          {/* Avatar Block */}
          {authUser?.passport_image ? (
            <div className="w-28 h-32 bg-[#0f172a] border border-gray-800 rounded-sm overflow-hidden shrink-0 z-10">
              <img src={getBackendImageUrl(authUser.passport_image)} alt="Photo" crossOrigin="anonymous" className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-28 h-32 bg-[#0f172a] border border-gray-800 rounded-sm flex items-center justify-center shrink-0 shadow-inner z-10">
              <span className="font-heading text-4xl font-bold text-white tracking-wider">{initials}</span>
            </div>
          )}

          {/* Details Grid */}
          <div className="flex-1 flex flex-col justify-center gap-5 z-10">
            {authUser?.name && (
              <div>
                <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">FULL NAME</div>
                <div className="font-heading text-2xl font-bold text-white uppercase tracking-wide">{authUser.name}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {player?.id && (
                <div>
                  <div className="text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">PLAYER ID</div>
                  <div className="text-sm font-medium text-white">UPHA-PLR-{String(player.id).padStart(5, "0")}</div>
                </div>
              )}
              {player?.district && (
                <div>
                  <div className="text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">DISTRICT</div>
                  <div className="text-sm font-medium text-white">{player.district}</div>
                </div>
              )}

              {authUser?.gender && (
                <div>
                  <div className="text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">GENDER</div>
                  <div className="text-sm font-medium text-white capitalize">{authUser.gender}</div>
                </div>
              )}
              {authUser?.blood_group && (
                <div>
                  <div className="text-[8px] font-bold tracking-widest text-gray-500 uppercase mb-1">BLOOD GROUP</div>
                  <div className="text-sm font-medium text-white">{authUser.blood_group}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="bg-[#0f172a] px-6 md:px-8 py-4 flex justify-between items-center border-t border-gray-800">
          <div className="font-serif italic text-gray-400 text-sm">Khelo India Toh Khilega India</div>
        </div>

        {/* Subtle decorative */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-bl-full"></div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-4 print:hidden">
        <button
          type="button"
          onClick={() => {
            if (!player?.paid) {
              alert("Not approved by Admin. You can download your ID card after your profile is approved.");
            } else {
              downloadIdCard();
            }
          }}
          disabled={isDownloading}
          className="flex-1 bg-[#d97c55] hover:bg-[#c16744] disabled:opacity-50 text-white flex items-center justify-center gap-2 py-4 rounded-sm transition-colors shadow-sm"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span className="text-[10px] font-bold tracking-widest uppercase">{isDownloading ? "DOWNLOADING..." : "DOWNLOAD ID CARD"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (isRenewalAvailable) {
              setIsRenewalModalOpen(true);
            } else {
              alert("Renewal is only available 25 days prior to expiration.");
            }
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-sm transition-colors shadow-sm border ${
            isRenewalAvailable 
              ? "bg-white hover:bg-gray-50 text-gray-800 border-gray-200" 
              : "bg-[#111827] text-gray-500 border-gray-800 cursor-not-allowed"
          }`}
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          <span className="text-[10px] font-bold tracking-widest uppercase">RENEW MEMBERSHIP</span>
        </button>
      </div>
      
      <RenewalModal 
        isOpen={isRenewalModalOpen} 
        onClose={() => setIsRenewalModalOpen(false)} 
        title="Renew Player Membership" 
      />
    </div>
  );
}
