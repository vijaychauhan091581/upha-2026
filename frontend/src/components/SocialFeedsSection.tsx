"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ExternalLink, ShieldCheck, Heart, MessageCircle, Share2 } from "lucide-react";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);

interface SocialFeedsSectionProps {
  instagramEmbedId?: string; // e.g. "elfsight-app-xxxx-xxxx"
  facebookEmbedId?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export default function SocialFeedsSection({
  instagramEmbedId,
  facebookEmbedId,
  instagramUrl = "https://www.instagram.com/uphandballassociation/",
  facebookUrl = "https://www.facebook.com/uphandball",
}: SocialFeedsSectionProps) {
  useEffect(() => {
    // Check if Elfsight script is present, otherwise load platform
    if (!document.getElementById("elfsight-platform-script")) {
      const script = document.createElement("script");
      script.id = "elfsight-platform-script";
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#fcfbf9] border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs font-bold tracking-widest text-accent uppercase mb-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-accent inline-block"></span>
              SOCIAL MEDIA &middot; STAY CONNECTED
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#111827]">
              UPHA ON <span className="text-accent">SOCIAL MEDIA</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed">
              Follow our official Instagram and Facebook channels for live tournament updates, match results, state championship highlights, and player spotlights.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white rounded text-xs font-bold uppercase tracking-wider transition-opacity shadow-xs text-center"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              <span className="truncate">@uphandballassociation</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-xs text-center"
            >
              <Facebook className="w-4 h-4 shrink-0" />
              <span>Facebook Page</span>
            </a>
          </div>
        </div>

        {/* Feeds Grid: Two side-by-side columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* 1. INSTAGRAM FEED SECTION */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
            {/* Box Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-pink-50/50 via-white to-orange-50/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#111827] uppercase tracking-wide">
                      Instagram Updates
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-[#1877F2] shrink-0" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500 font-mono">@uphandballassociation</span>
                </div>
              </div>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-95 text-white rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Follow</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Widget Container */}
            <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-center min-h-[380px] sm:min-h-[440px]">
              {instagramEmbedId ? (
                /* Active Elfsight Instagram Widget */
                <div className={`elfsight-app-${instagramEmbedId} max-w-full overflow-hidden`} data-elfsight-app-lazy></div>
              ) : (
                /* Fallback preview & Connect Banner */
                <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-gradient-to-b from-gray-50/60 to-white rounded border border-dashed border-gray-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-0.5 mb-3 sm:mb-4 shadow-sm">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <Instagram className="w-6 h-6 sm:w-7 sm:h-7 text-[#ee2a7b]" />
                    </div>
                  </div>

                  <h4 className="font-heading text-base sm:text-lg font-bold text-[#111827] uppercase mb-1">
                    UP Handball Association
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mb-4">
                    Live match photos, tournament clips, player reels, and official federation news.
                  </p>

                  {/* Elfsight Widget Slot */}
                  <div
                    id="elfsight-instagram-container"
                    className="w-full mb-4"
                  >
                    {/* The Elfsight widget div will render here when embed code is supplied */}
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full max-w-sm mb-5 sm:mb-6">
                    <div className="aspect-square bg-gray-100 rounded flex flex-col items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors p-2">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 mb-1" />
                      <span className="text-[10px] font-bold text-gray-600">Reels</span>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded flex flex-col items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors p-2">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mb-1" />
                      <span className="text-[10px] font-bold text-gray-600">Updates</span>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded flex flex-col items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors p-2">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mb-1" />
                      <span className="text-[10px] font-bold text-gray-600">Matches</span>
                    </div>
                  </div>

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-sm py-2.5 sm:py-3 px-4 bg-[#111827] hover:bg-accent text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-xs text-center"
                  >
                    <Instagram className="w-4 h-4 shrink-0" />
                    <span className="truncate">View Latest Posts on Instagram &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 2. FACEBOOK FEED SECTION */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
            {/* Box Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 via-white to-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#111827] uppercase tracking-wide">
                      Facebook Page
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-[#1877F2] shrink-0" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500 font-mono">UP Handball Association</span>
                </div>
              </div>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Follow Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Widget Container */}
            <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-center min-h-[380px] sm:min-h-[440px]">
              {facebookEmbedId ? (
                /* Active Elfsight or Meta Facebook Widget */
                <div className={`elfsight-app-${facebookEmbedId} max-w-full overflow-hidden`} data-elfsight-app-lazy></div>
              ) : (
                /* Facebook Page Plugin / Clean Live Showcase */
                <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-gradient-to-b from-blue-50/30 to-white rounded border border-dashed border-gray-300 h-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1877F2] flex items-center justify-center text-white mb-3 sm:mb-4 shadow-sm">
                    <Facebook className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  <h4 className="font-heading text-base sm:text-lg font-bold text-[#111827] uppercase mb-1">
                    Uttar Pradesh Handball Association
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mb-4">
                    Official state federation notices, championship albums, event livestreams, and announcements.
                  </p>

                  {/* Facebook Page Plugin iframe - Real-time Latest Posts */}
                  <div className="w-full flex justify-center mb-4 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xs max-w-full">
                    <iframe
                      src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                        facebookUrl
                      )}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                      width="100%"
                      height="450"
                      style={{ border: "none", overflow: "hidden" }}
                      scrolling="yes"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      title="UPHA Facebook Page Latest Posts"
                      className="w-full max-w-[500px] h-[360px] sm:h-[450px]"
                    ></iframe>
                  </div>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-[500px] py-2.5 sm:py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-xs text-center"
                  >
                    <Facebook className="w-4 h-4 shrink-0" />
                    <span className="truncate">Follow @uphandball on Facebook &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
