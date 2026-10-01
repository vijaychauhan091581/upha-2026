"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Download, ChevronRight } from "lucide-react";

export default function MoreLinksPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen">
      {/* Header section */}
      <section className="bg-[#111827] text-white pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-3">
            RESOURCES / MORE LINKS
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wide mb-4">
            MORE <span className="text-accent">LINKS</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-sm sm:text-lg max-w-2xl">
            Access official affiliation letters and downloadable registration forms.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
          
          {/* Card 1: Affiliations/Recognitions */}
          <div className="bg-white border border-[#6d64e8]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 md:gap-10 w-full md:w-auto text-center sm:text-left">
              <div className="flex items-center justify-center gap-3 shrink-0 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <Image src="/HAI.png" alt="HAI Logo" width={48} height={48} className="object-contain w-10 h-10 sm:w-14 sm:h-14" />
                <Image src="/UPOA.png" alt="UPOA Logo" width={42} height={42} className="object-contain w-9 h-9 sm:w-12 sm:h-12" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#35487a] leading-tight break-words">
                  Affiliations &amp; Recognitions
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  Handball Association of India &amp; UP Olympic Association
                </p>
              </div>
            </div>
            <Link 
              href="/affiliations"
              className="w-full md:w-auto bg-[#6d64e8] hover:bg-[#5c54cc] text-white font-bold tracking-wide rounded-lg px-8 sm:px-12 py-3 sm:py-3.5 flex items-center justify-center gap-2 transition-colors shadow-sm text-sm shrink-0"
            >
              <span>View</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: UPHA Forms */}
          <div className="bg-white border border-[#6d64e8]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 md:gap-10 w-full md:w-auto text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#efc96a] rounded-2xl sm:rounded-[2rem] flex items-center justify-center shrink-0 shadow-xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#75b2a7] rounded-full flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#35487a] leading-tight break-words">
                  Official UPHA Forms
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-sans">
                  Download tournament and registration proformas
                </p>
              </div>
            </div>
            <Link 
              href="/forms"
              className="w-full md:w-auto border-2 border-[#6d64e8]/20 hover:border-[#6d64e8]/40 text-[#6d64e8] hover:bg-[#6d64e8]/5 font-bold tracking-wide rounded-lg px-8 sm:px-12 py-3 sm:py-3.5 flex items-center justify-center gap-2 transition-colors text-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>View Forms</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
