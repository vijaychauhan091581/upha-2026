"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Book, Scale, Users, FileText, Download } from "lucide-react";

export default function ConstitutionPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#fcfbf9] w-full">
      {/* 1. HERO BANNER */}
      <section className="bg-[#111827] pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-6 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-gray-300">CONSTITUTION</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide text-white mb-6">
            THE <span className="text-[#d97c55]">CONSTITUTION</span>
          </h1>

          <p className="text-gray-400 font-serif italic text-xl md:text-2xl max-w-3xl leading-relaxed">
            The governing document and rulebook of the Uttar Pradesh Handball Association. 
            Establishing the framework for fair play, integrity, and the systematic growth of handball across the state.
          </p>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-wrap gap-12 md:gap-20">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">LAST AMENDED</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">August 2023</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">PAGES</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">42 Sections</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">LANGUAGE</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">English / Hindi</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PREAMBLE & DOWNLOAD */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                PREAMBLE
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-8 text-[#111827] max-w-2xl">
              GUIDING PRINCIPLES OF <span className="text-[#d97c55]">UPHA</span>
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed font-serif text-lg">
              <p>
                The Uttar Pradesh Handball Association (UPHA) operates under a democratic, transparent, and athlete-centric constitution. Enacted to ensure the proper governance of handball across all 75 districts, this document outlines the rights, responsibilities, and operational procedures of the federation.
              </p>
              <p>
                It is the supreme document that governs our relationship with district units, athletes, coaches, and the Handball Association of India. Our constitution ensures that the sport remains accessible, fair, and free from discrimination or malpractice.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. KEY SECTIONS */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                CORE ARTICLES
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[#111827]">
              CONSTITUTIONAL <span className="text-[#d97c55]">PILLARS</span>
            </h2>
            <p className="text-gray-500 font-serif italic text-lg max-w-3xl mb-12">
              A brief overview of the primary sections governing the Uttar Pradesh Handball Association.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#fcfbf9] p-10 border border-gray-100 rounded-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Book className="w-32 h-32 text-[#d97c55] -mr-8 -mt-8" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Book className="w-5 h-5 text-[#111827]" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827] mb-4">I. Title & Jurisdiction</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-serif">
                  Establishes the name of the organisation as "Uttar Pradesh Handball Association" and defines its headquarters in Lucknow. It outlines the jurisdiction of the association across the state of Uttar Pradesh and its affiliation with the Handball Association of India and the U.P. Olympic Association.
                </p>
              </div>
            </div>

            <div className="bg-[#fcfbf9] p-10 border border-gray-100 rounded-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-32 h-32 text-[#d97c55] -mr-8 -mt-8" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Users className="w-5 h-5 text-[#111827]" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827] mb-4">II. Membership</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-serif">
                  Details the criteria for district association affiliations, club memberships, and individual registrations. It specifies the voting rights of affiliated units during the Annual General Meeting (AGM) and the procedures for suspension or expulsion of members for violating federation codes.
                </p>
              </div>
            </div>

            <div className="bg-[#fcfbf9] p-10 border border-gray-100 rounded-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Scale className="w-32 h-32 text-[#d97c55] -mr-8 -mt-8" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Scale className="w-5 h-5 text-[#111827]" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827] mb-4">III. Elections & Governance</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-serif">
                  Mandates the democratic election of the Executive Committee every four years. Outlines the powers and duties of the President, General Secretary, Treasurer, and other office bearers. Ensures compliance with the National Sports Development Code regarding age and tenure limits.
                </p>
              </div>
            </div>

            <div className="bg-[#fcfbf9] p-10 border border-gray-100 rounded-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-32 h-32 text-[#d97c55] -mr-8 -mt-8" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <FileText className="w-5 h-5 text-[#111827]" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827] mb-4">IV. Financial Management</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-serif">
                  Governs the collection of affiliation fees, sponsorship revenues, and government grants. Requires mandatory annual audits by certified chartered accountants and the presentation of the balance sheet at the AGM, ensuring absolute financial transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPLIANCE BANNER */}
      <section className="bg-[#111827] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-2">COMPLIANCE</div>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-wide mb-2">NATIONAL SPORTS CODE COMPLIANT</h3>
            <p className="text-gray-400 font-serif text-sm max-w-xl">
              The UPHA Constitution is strictly aligned with the National Sports Development Code of India, ensuring transparent elections, proper athlete representation, and ethical governance.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center w-20 h-20 border-2 border-[#d97c55] rounded-full text-[#d97c55] font-bold">
            <span className="font-heading text-xl">100%</span>
          </div>
        </div>
      </section>

    </div>
  );
}
