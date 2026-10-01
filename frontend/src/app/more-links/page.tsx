"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Download, ChevronRight } from "lucide-react";

export default function MoreLinksPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen">
      {/* Header section (optional, but good for context) */}
      <section className="bg-[#111827] text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-4">
            RESOURCES / MORE LINKS
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            MORE <span className="text-accent">LINKS</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-lg max-w-2xl">
            Access official affiliation letters and downloadable registration forms.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          
          {/* Card 1: Affiliations/Recognitions */}
          <div className="bg-white border border-[#6d64e8]/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
              <div className="flex items-center gap-4 shrink-0">
                <Image src="/HAI.png" alt="HAI Logo" width={60} height={60} className="object-contain" />
                <Image src="/UPOA.png" alt="UPOA Logo" width={50} height={50} className="object-contain" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#35487a]">
                Affiliations/<br className="hidden md:block" />Recognitions
              </h2>
            </div>
            <Link 
              href="/affiliations"
              className="w-full md:w-auto bg-[#6d64e8] hover:bg-[#5c54cc] text-white font-bold tracking-wide rounded-md px-12 py-3.5 flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              View
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: UPHA Forms */}
          <div className="bg-white border border-[#6d64e8]/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
              <div className="w-24 h-24 bg-[#efc96a] rounded-[2rem] flex items-center justify-center shrink-0">
                <div className="w-12 h-12 bg-[#75b2a7] rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#35487a]">
                UPHA Forms
              </h2>
            </div>
            <Link 
              href="/forms"
              className="w-full md:w-auto border-2 border-[#6d64e8]/20 hover:border-[#6d64e8]/40 text-[#6d64e8] font-bold tracking-wide rounded-md px-12 py-3.5 flex items-center justify-center gap-3 transition-colors"
            >
              <Download className="w-4 h-4" />
              View
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
