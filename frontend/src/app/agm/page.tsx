"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Download, BookOpen, CalendarDays, Filter, Eye } from "lucide-react";
import { getAGMLetters, AGMLetterData } from "@/lib/api";

type FilterType = "all" | "text" | "pdf";

export default function AGMPage() {
  const [letters, setLetters] = useState<AGMLetterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function fetchLetters() {
      try {
        const res = await getAGMLetters();
        if (res.success && res.letters) {
          setLetters(res.letters);
        }
      } catch (error) {
        console.error("Failed to fetch AGM letters:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLetters();
  }, []);

  const filtered = letters.filter((l) => {
    if (filter === "all") return true;
    return l.letter_type === filter;
  });

  const textCount = letters.filter((l) => l.letter_type === "text").length;
  const pdfCount = letters.filter((l) => l.letter_type === "pdf").length;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
      year: d.getFullYear(),
      full: d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
    };
  };

  return (
    <main className="flex-1 flex flex-col bg-[#fcfbf9] w-full">

      {/* ── Hero Banner ── */}
      <section className="bg-[#111827] pt-20 pb-28 relative overflow-hidden">
        {/* Decorative background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          {/* Breadcrumb */}
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-6 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-gray-300">AGM LETTERS</span>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <div className="w-14 h-14 rounded-full bg-[#d97c55]/10 border border-[#d97c55]/30 flex items-center justify-center shrink-0 mt-1">
              <BookOpen className="w-6 h-6 text-[#d97c55]" />
            </div>
            <div>
              <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide text-white mb-4 leading-tight">
                AGM <span className="text-[#d97c55]">LETTERS</span>
              </h1>
              <p className="text-gray-400 font-serif italic text-xl max-w-3xl leading-relaxed">
                Official Annual General Meeting letters, circulars, notices, and resolutions published by the Uttar Pradesh Handball Association.
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-gray-800 pt-8 flex flex-wrap gap-12 md:gap-20">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">TOTAL DOCUMENTS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{letters.length} Published</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">TEXT LETTERS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{textCount} Letters</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">PDF DOCUMENTS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{pdfCount} Files</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          {(
            [
              { key: "all", label: `All (${letters.length})` },
              { key: "text", label: `Text Letters (${textCount})` },
              { key: "pdf", label: `PDF Documents (${pdfCount})` },
            ] as { key: FilterType; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-colors ${
                filter === tab.key
                  ? "bg-[#d97c55] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Letters List ── */}
      <section className="py-16 md:py-24 flex-1">
        <div className="max-w-5xl mx-auto px-6 space-y-6">

          {loading ? (
            /* Skeleton */
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-sm overflow-hidden flex animate-pulse">
                  <div className="w-[120px] bg-gray-100 shrink-0" />
                  <div className="p-8 flex-1 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-gray-400" />
              </div>
              <div className="text-gray-400 font-mono text-sm uppercase tracking-widest">
                {filter === "all"
                  ? "No AGM letters published yet."
                  : `No ${filter === "text" ? "text letters" : "PDF documents"} found.`}
              </div>
            </div>
          ) : (
            filtered.map((letter) => {
              const date = formatDate(letter.letter_date);
              const isPdf = letter.letter_type === "pdf";

              return (
                <div
                  key={letter.id}
                  className="bg-white border border-gray-200 rounded-sm hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row overflow-hidden group"
                >
                  {/* Date column */}
                  <div className="bg-gray-50 border-r border-gray-100 p-6 md:p-8 flex md:flex-col items-center justify-center shrink-0 min-w-[130px] gap-2 md:gap-0">
                    <div className="text-4xl font-heading font-bold text-[#111827] group-hover:text-[#d97c55] transition-colors leading-none">
                      {date.day}
                    </div>
                    <div className="text-sm font-bold tracking-widest text-gray-500 uppercase md:mt-1">
                      {date.month}
                    </div>
                    <div className="text-xs text-gray-400 font-mono md:mt-0.5">{date.year}</div>
                  </div>

                  {/* Content column */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      {/* Type badge */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {isPdf ? (
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                            <FileText className="w-3 h-3" />
                            PDF DOCUMENT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-[#d97c55]/10 text-[#d97c55] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                            <BookOpen className="w-3 h-3" />
                            TEXT LETTER
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {date.full}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-heading text-2xl font-bold text-[#111827] mb-3 leading-snug group-hover:text-[#d97c55] transition-colors">
                        {letter.title}
                      </h2>

                      {/* Description / Body */}
                      {letter.description && (
                        <p
                          className={`text-gray-600 leading-relaxed text-sm font-serif ${
                            isPdf ? "line-clamp-3" : "whitespace-pre-wrap"
                          }`}
                        >
                          {letter.description}
                        </p>
                      )}
                    </div>

                    {/* View and Download buttons for PDFs */}
                    {isPdf && letter.file && (
                      <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <a
                          href={letter.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          VIEW
                        </a>
                        <a
                          href={letter.file}
                          download
                          className="inline-flex items-center gap-2 bg-[#111827] text-white text-[10px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#d97c55] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          DOWNLOAD PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ── Footer Banner ── */}
      <section className="bg-[#111827] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-2">OFFICIAL RECORD</div>
            <h3 className="font-heading text-xl font-bold uppercase tracking-wide mb-1">ANNUAL GENERAL MEETING</h3>
            <p className="text-gray-400 text-sm font-serif max-w-xl">
              All AGM letters and documents are official records of the Uttar Pradesh Handball Association, published for transparency and member access.
            </p>
          </div>
          <Link
            href="/constitution"
            className="shrink-0 border border-[#d97c55] text-[#d97c55] px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-[#d97c55] hover:text-white transition-colors rounded-sm"
          >
            VIEW CONSTITUTION →
          </Link>
        </div>
      </section>

    </main>
  );
}
