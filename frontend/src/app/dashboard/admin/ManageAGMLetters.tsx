"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, BookOpen, Trash2, Download, Upload, Plus } from "lucide-react";
import { getAGMLetters, createAGMLetter, deleteAGMLetter, AGMLetterData } from "@/lib/api";

type LetterType = "text" | "pdf";

export default function ManageAGMLetters() {
  const [letters, setLetters] = useState<AGMLetterData[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form state
  const [letterType, setLetterType] = useState<LetterType>("text");
  const [title, setTitle] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // ── Fetch existing letters ──
  async function fetchLetters() {
    setLoadingList(true);
    try {
      const res = await getAGMLetters();
      if (res.success && res.letters) {
        setLetters(res.letters);
      }
    } catch {
      /* silently ignore */
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchLetters();
  }, []);

  // ── Submit handler ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("letter_date", letterDate);
    formData.append("letter_type", letterType);
    formData.append("description", description);
    if (letterType === "pdf" && pdfFile) {
      formData.append("file", pdfFile);
    }

    try {
      await createAGMLetter(formData);
      setSuccess(
        letterType === "pdf"
          ? "PDF document uploaded successfully!"
          : "Text letter published successfully!"
      );
      // Reset form
      setTitle("");
      setLetterDate("");
      setDescription("");
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchLetters();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save AGM letter.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete handler ──
  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await deleteAGMLetter(id);
      setLetters((prev) => prev.filter((l) => l.id !== id));
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete letter.");
    } finally {
      setDeletingId(null);
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-white w-full rounded shadow-sm border border-gray-200 relative">

      {/* ── Header ── */}
      <div className="p-6 border-b border-gray-100">
        <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
          ADMIN · AGM
        </div>
        <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-[#111827]">
          MANAGE <span className="text-[#d97c55]">AGM LETTERS</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Upload official AGM text letters and PDF documents for public viewing.
        </p>
      </div>

      {/* ── Success / Error Banners ── */}
      {success && (
        <div className="mx-6 mt-6 bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wide px-4 py-3 rounded">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 text-xs font-bold tracking-wide px-4 py-3 rounded">
          ✕ {error}
        </div>
      )}

      {/* ── Upload Form ── */}
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-8">

          {/* Section 01 — Letter Type Toggle */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">01</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                SELECT TYPE
              </h3>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLetterType("text")}
                className={`flex-1 flex items-center gap-3 p-4 border-2 rounded transition-all text-left ${
                  letterType === "text"
                    ? "border-[#d97c55] bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    letterType === "text" ? "bg-[#d97c55]/10 text-[#d97c55]" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold tracking-widest uppercase ${letterType === "text" ? "text-[#d97c55]" : "text-gray-700"}`}>
                    Text Letter
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Compose a rich text notice or circular</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLetterType("pdf")}
                className={`flex-1 flex items-center gap-3 p-4 border-2 rounded transition-all text-left ${
                  letterType === "pdf"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    letterType === "pdf" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold tracking-widest uppercase ${letterType === "pdf" ? "text-blue-600" : "text-gray-700"}`}>
                    PDF Document
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Upload a signed/scanned PDF file</div>
                </div>
              </button>
            </div>
          </section>

          {/* Section 02 — Basic Details */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">02</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                LETTER DETAILS
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  TITLE <span className="text-[#d97c55]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    letterType === "pdf"
                      ? "e.g. AGM 2025 — Notice of Meeting"
                      : "e.g. Circular No. 12 — AGM Agenda 2025"
                  }
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  LETTER DATE <span className="text-[#d97c55]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={letterDate}
                  onChange={(e) => setLetterDate(e.target.value)}
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                />
              </div>
            </div>
          </section>

          {/* Section 03 — Content (conditional) */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">03</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                {letterType === "text" ? "LETTER BODY" : "PDF UPLOAD"}
              </h3>
            </div>

            {letterType === "text" ? (
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                  BODY <span className="text-[#d97c55]">*</span>
                </label>
                <textarea
                  required
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full text of the AGM letter or circular..."
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>
            ) : (
              <div className="space-y-5">
                {/* PDF File upload */}
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    PDF FILE <span className="text-[#d97c55]">*</span>
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      pdfFile
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-[#fcfbf9]"
                    }`}
                  >
                    {pdfFile ? (
                      <>
                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        <div className="text-xs font-bold text-blue-700 tracking-wide text-center">
                          {pdfFile.name}
                        </div>
                        <div className="text-[10px] text-blue-500 mt-1">
                          {(pdfFile.size / 1024).toFixed(1)} KB
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <div className="text-xs font-bold text-gray-600 tracking-widest uppercase">
                          Click to select PDF
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">Only .pdf files accepted</div>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </div>

                {/* Optional caption/description */}
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-800 uppercase mb-1.5">
                    DESCRIPTION / CAPTION <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of what this PDF contains..."
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400 resize-none"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Form Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-gray-400 font-mono">
            Published letters are immediately visible on the public AGM page.
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setTitle(""); setLetterDate(""); setDescription(""); setPdfFile(null);
                setSuccess(null); setError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-800 px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              CLEAR
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none bg-[#d97c55] text-white px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#c16744] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {letterType === "pdf" ? (
                <><Upload className="w-3 h-3" /> {submitting ? "UPLOADING..." : "UPLOAD PDF"}</>
              ) : (
                <><Plus className="w-3 h-3" /> {submitting ? "PUBLISHING..." : "PUBLISH LETTER"}</>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── Existing Letters ── */}
      <div className="border-t-4 border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827]">
            EXISTING <span className="text-[#d97c55]">LETTERS</span>
            <span className="ml-3 text-sm font-mono font-normal text-gray-400">({letters.length})</span>
          </h3>
        </div>

        {loadingList ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97c55]" />
          </div>
        ) : letters.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-mono text-xs uppercase tracking-widest">
            No AGM letters uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {letters.map((letter) => (
              <div key={letter.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Type icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    letter.letter_type === "pdf"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-orange-100 text-[#d97c55]"
                  }`}
                >
                  {letter.letter_type === "pdf" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-sm ${
                        letter.letter_type === "pdf"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-[#d97c55]"
                      }`}
                    >
                      {letter.letter_type === "pdf" ? "PDF" : "TEXT"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {formatDate(letter.letter_date)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#111827] truncate">{letter.title}</div>
                  {letter.description && (
                    <div className="text-xs text-gray-500 truncate mt-0.5">{letter.description}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {letter.letter_type === "pdf" && letter.file && (
                    <a
                      href={letter.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </a>
                  )}

                  {confirmDeleteId === letter.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(letter.id)}
                        disabled={deletingId === letter.id}
                        className="text-[10px] font-bold tracking-widest uppercase bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === letter.id ? "..." : "CONFIRM"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[10px] font-bold tracking-widest uppercase text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(letter.id)}
                      className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                      DELETE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
