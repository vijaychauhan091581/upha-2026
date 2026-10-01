"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { FileText, Download, Eye, AlertCircle } from "lucide-react";

export default function AffiliationsPage() {
  const { settings, loading } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const haiLetter = settings?.hai_affiliation_letter;
  const upoaLetter = settings?.up_olympic_letter;

  const renderDocument = (url: string, title: string) => {
    const isImage = url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/i);
    if (isImage) {
      return <img src={url} alt={title} className="max-w-full h-auto max-h-[900px] object-contain" />;
    }
    
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    const iframeSrc = isLocalhost 
      ? url 
      : `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
      
    return <iframe src={iframeSrc} className="w-full h-[800px]" title={title} />;
  };

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen">
      {/* Header */}
      <section className="bg-[#111827] text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-4">
            RESOURCES / AFFILIATIONS & RECOGNITIONS
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            OFFICIAL <span className="text-[#d97c55]">AFFILIATIONS</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-lg max-w-2xl">
            View and download the official recognition and affiliation letters of the Uttar Pradesh Handball Association.
          </p>
        </div>
      </section>

      {/* Letters List */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-100 border border-gray-200 rounded-sm animate-pulse"></div>
            ))}
          </div>
        ) : (!haiLetter && !upoaLetter) ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-sm">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1">
              No letters available
            </h3>
            <p className="text-xs text-gray-500">
              There are currently no affiliation letters uploaded.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {haiLetter && (
              <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm flex flex-col gap-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#6d64e8]/10 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#6d64e8]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827]">
                        Handball Association India (HAI) Affiliation Letter
                      </h3>
                      <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-1">
                        OFFICIAL DOCUMENT
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={haiLetter}
                    download
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6d64e8] hover:bg-[#5c54cc] text-white text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm shadow-sm shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>

                <div className="w-full bg-gray-50 border border-gray-200 rounded-sm overflow-hidden flex justify-center items-center min-h-[400px]">
                  {renderDocument(haiLetter, "HAI Affiliation Letter")}
                </div>
              </div>
            )}

            {upoaLetter && (
              <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm flex flex-col gap-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#3c8c7c]/10 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#3c8c7c]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827]">
                        UP Olympic Association (UPOA) Affiliation Letter
                      </h3>
                      <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-1">
                        OFFICIAL DOCUMENT
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={upoaLetter}
                    download
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3c8c7c] hover:bg-[#327366] text-white text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm shadow-sm shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>

                <div className="w-full bg-gray-50 border border-gray-200 rounded-sm overflow-hidden flex justify-center items-center min-h-[400px]">
                  {renderDocument(upoaLetter, "UPOA Affiliation Letter")}
                </div>
              </div>
            )}

          </div>
        )}
      </section>
    </main>
  );
}
