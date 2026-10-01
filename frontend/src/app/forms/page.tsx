"use client";

import React, { useEffect, useState } from "react";
import { getUPHAForms, UPHAFormData } from "@/lib/api";
import { FileText, Download, Eye } from "lucide-react";

export default function FormsPage() {
  const [forms, setForms] = useState<UPHAFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUPHAForms()
      .then((res) => {
        if (res.success) {
          setForms(res.forms);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen">
      {/* Header */}
      <section className="bg-[#111827] text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-4">
            RESOURCES / UPHA FORMS
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            OFFICIAL <span className="text-accent">FORMS</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-lg max-w-2xl">
            Download official UPHA registration, application, and compliance forms here.
          </p>
        </div>
      </section>

      {/* Forms List */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 border border-gray-200 rounded-sm animate-pulse"></div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1">
              No forms available
            </h3>
            <p className="text-xs text-gray-500">
              There are currently no official forms uploaded.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white border border-gray-200 p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827]">
                      {form.title}
                    </h3>
                    <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-1">
                      UPLOADED: {new Date(form.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={form.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </a>
                  <a
                    href={form.file}
                    download
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
