"use client";

import React, { useState } from "react";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  FileText,
  Users,
} from "lucide-react";
import { importPlayers, importCoaches, Applicant } from "@/lib/api";

interface CsvImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  currentApplicants?: Applicant[];
  activeCategory?: string;
  initialTab?: "export" | "import";
}

// Helper function to escape standard text in CSV
function escapeCsv(val: any): string {
  const str = String(val ?? "").trim();
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

// Helper function to force spreadsheet software (Excel, Numbers, Sheets)
// to treat numbers strictly as literal TEXT so Aadhar (12-digits), Phone numbers,
// and Transaction IDs NEVER get converted into scientific notation (e.g. 1.23E+11)
// or lose leading zeroes/spaces!
function escapeAsExactText(val: any): string {
  const str = String(val ?? "").trim();
  if (!str) return '""';
  // ="value" syntax instructs Excel to display the exact string
  return `="${str.replace(/"/g, '""')}"`;
}

export function exportApplicantsToCsv(applicants: Applicant[], filename = "UPHA_Registrations.csv") {
  if (!applicants || applicants.length === 0) {
    alert("No records to export.");
    return;
  }

  const headers = [
    "ID",
    "Reference",
    "Category / Type",
    "Full Name",
    "Email",
    "Phone Number",
    "Gender",
    "District",
    "Date of Birth",
    "Father Name",
    "Mother Name",
    "Blood Group",
    "Aadhar Number",
    "Payment Status",
    "Transaction ID",
    "Dominant Hand",
    "School / College",
    "Club / Academy",
    "Height (cm)",
    "Weight (kg)",
    "Occupation",
    "Grade / Experience",
  ];

  const rows = applicants.map((item) => {
    const d: any = item.data;
    const u: any = d.user || {};
    const isPaid = d.paid ? "Approved" : "Pending";
    const ref =
      item.type === "player"
        ? `APP-PLR-${String(d.id).padStart(5, "0")}`
        : item.type === "coach"
        ? `APP-CCH-${String(d.id).padStart(5, "0")}`
        : item.type === "referee"
        ? `APP-RFR-${String(d.id).padStart(5, "0")}`
        : item.type === "academy"
        ? `APP-ACA-${String(d.id).padStart(5, "0")}`
        : `APP-DST-${String(d.id).padStart(5, "0")}`;

    const name = d.name || u.name || "";
    const email = d.email || u.email || "";
    const phone =
      u.phone_number ||
      u.mobile ||
      d.phone_number ||
      d.phone ||
      d.mobile ||
      d.office_phone_number ||
      d.adhyaksha?.phone_number ||
      d.sachiv?.phone_number ||
      d.koshadhyaksha?.phone_number ||
      "";
    const gender = u.gender || "";
    const district = d.district || "";
    const dob = u.date_of_birth || "";
    const father = u.father_name || "";
    const mother = u.mother_name || "";
    const blood = u.blood_group || "";
    const aadhar =
      u.adhar_number ||
      u.aadhar_number ||
      d.adhar_number ||
      d.aadhar_number ||
      d.adhyaksha?.adhar_number ||
      d.sachiv?.adhar_number ||
      "";
    const txnId = d.transaction_id || u.transaction_id || "";

    const dominantHand = d.dominant_hand || "";
    const school = d.school_name || "";
    const club = d.club_name || "";
    const height = d.height || "";
    const weight = d.weight || "";
    const occupation = d.occupation || "";
    const grade = d.highest_coaching_grade || d.grade_applying_for || "";

    return [
      escapeCsv(d.id),
      escapeAsExactText(ref),
      escapeCsv(item.type.toUpperCase()),
      escapeCsv(name),
      escapeCsv(email),
      escapeAsExactText(phone),
      escapeCsv(gender),
      escapeCsv(district),
      escapeAsExactText(dob),
      escapeCsv(father),
      escapeCsv(mother),
      escapeCsv(blood),
      escapeAsExactText(aadhar),
      escapeCsv(isPaid),
      escapeAsExactText(txnId),
      escapeCsv(dominantHand),
      escapeCsv(school),
      escapeCsv(club),
      escapeCsv(height),
      escapeCsv(weight),
      escapeCsv(occupation),
      escapeCsv(grade),
    ];
  });

  // Include UTF-8 BOM so Excel opens Hindi/UTF-8 symbols without garbled characters
  const BOM = "\uFEFF";
  const csvContent = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CsvImportExportModal({
  isOpen,
  onClose,
  onImportSuccess,
  currentApplicants = [],
  activeCategory = "ALL",
  initialTab = "export",
}: CsvImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">(initialTab);
  const [importType, setImportType] = useState<"player" | "coach">("player");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errors: string[];
  } | null>(null);

  if (!isOpen) return null;

  // CSV Template download
  const handleDownloadTemplate = (type: "player" | "coach") => {
    let headers: string[] = [];
    let sampleRow: string[] = [];

    if (type === "player") {
      headers = [
        "name",
        "email",
        "phone_number",
        "gender",
        "district",
        "date_of_birth",
        "father_name",
        "mother_name",
        "blood_group",
        "adhar_number",
        "dominant_hand",
        "school_name",
        "club_name",
        "coach_name",
        "height",
        "weight",
        "status",
      ];
      sampleRow = [
        "Rahul Sharma",
        "rahul.sharma@example.com",
        "9876543210",
        "Male",
        "Varanasi",
        "2004-05-15",
        "Rajesh Sharma",
        "Sunita Sharma",
        "B+",
        "123456789012",
        "right",
        "BHU Sports School",
        "Varanasi Handball Club",
        "Coach Amit",
        "175",
        "68",
        "approved",
      ];
    } else {
      headers = [
        "name",
        "email",
        "phone_number",
        "gender",
        "district",
        "date_of_birth",
        "father_name",
        "mother_name",
        "blood_group",
        "adhar_number",
        "occupation",
        "highest_coaching_grade",
        "status",
      ];
      sampleRow = [
        "Vikram Singh",
        "vikram.coach@example.com",
        "9123456780",
        "Male",
        "Lucknow",
        "1988-10-20",
        "Mohan Singh",
        "Kamla Singh",
        "O+",
        "987654321098",
        "Physical Trainer",
        "NIS Certified Coach",
        "approved",
      ];
    }

    const csvText = [headers.join(","), sampleRow.join(",")].join("\n");
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UPHA_${type}_sample_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Parse CSV File in Browser
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setParseError(null);
    setImportResult(null);
    setParsedRows([]);

    if (!file) {
      setCsvFile(null);
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) throw new Error("File is empty.");

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error("CSV file must contain a header row and at least one data row.");
        }

        // Parse header
        const rawHeaders = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
        const dataRows: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          // Basic comma split respecting quotes
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => {
            let cleaned = v.trim();
            if (cleaned.startsWith('="') && cleaned.endsWith('"')) {
              cleaned = cleaned.slice(2, -1);
            } else if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
              cleaned = cleaned.slice(1, -1);
            } else if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
              cleaned = cleaned.slice(1, -1);
            }
            return cleaned.replace(/""/g, '"').trim();
          });

          const rowObj: any = {};
          rawHeaders.forEach((h, idx) => {
            rowObj[h] = values[idx] || "";
          });

          if (rowObj.name || rowObj.email || rowObj.phone_number) {
            dataRows.push(rowObj);
          }
        }

        if (dataRows.length === 0) {
          throw new Error("No valid data rows found in the CSV file.");
        }

        setParsedRows(dataRows);
      } catch (err: any) {
        setParseError(err.message || "Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
  };

  // Submit Bulk Import to Backend
  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);
    setImportResult(null);

    try {
      let res: any;
      if (importType === "player") {
        res = await importPlayers(parsedRows);
      } else {
        res = await importCoaches(parsedRows);
      }

      if (res.success) {
        setImportResult({
          success: true,
          count: res.imported_count || parsedRows.length,
          errors: res.errors || [],
        });
        setParsedRows([]);
        setCsvFile(null);
        onImportSuccess();
      } else {
        throw new Error(res.message || "Import failed.");
      }
    } catch (err: any) {
      setImportResult({
        success: false,
        count: 0,
        errors: [err.message || "Failed to import CSV."],
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#111827] text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d97c55]/20 flex items-center justify-center text-[#d97c55]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                DATA MANAGEMENT
              </div>
              <h3 className="font-heading text-xl font-bold uppercase tracking-wide">
                CSV Export &amp; Import
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Import vs Export */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "import"
                ? "border-accent text-accent"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Upload className="w-4 h-4" /> Import from CSV
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "export"
                ? "border-accent text-accent"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Download className="w-4 h-4" /> Export to CSV ({currentApplicants.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === "export" ? (
            /* EXPORT VIEW */
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-accent" /> Export Registered Cadre
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Export all currently filtered applicants (Players, Coaches, Referees, Academies, Districts)
                  directly into a structured Microsoft Excel compatible CSV file.
                </p>
                <div className="mt-4 flex items-center gap-2 font-mono text-xs text-gray-700 bg-white p-3 rounded border border-orange-200">
                  <span>Selected Filter:</span>
                  <strong className="text-accent uppercase font-bold">{activeCategory}</strong>
                  <span className="text-gray-400">·</span>
                  <span>{currentApplicants.length} Record(s) ready</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fname = `UPHA_${activeCategory}_Export_${new Date().toISOString().slice(0, 10)}.csv`;
                    exportApplicantsToCsv(currentApplicants, fname);
                  }}
                  className="px-6 py-2.5 bg-accent text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-accent/90 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download CSV File
                </button>
              </div>
            </div>
          ) : (
            /* IMPORT VIEW */
            <div className="space-y-6">
              {/* Target Type Selector */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Select Import Target
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setImportType("player");
                      setParsedRows([]);
                      setCsvFile(null);
                      setImportResult(null);
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                      importType === "player"
                        ? "border-accent bg-orange-50/50 text-accent shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Users className="w-4 h-4" /> Bulk Players Import
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportType("coach");
                      setParsedRows([]);
                      setCsvFile(null);
                      setImportResult(null);
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                      importType === "coach"
                        ? "border-accent bg-orange-50/50 text-accent shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="w-4 h-4" /> Bulk Coaches Import
                  </button>
                </div>
              </div>

              {/* Template Download Prompt */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-gray-900 text-xs">
                    Need a CSV Template for {importType === "player" ? "Players" : "Coaches"}?
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Download our formatted CSV template with required columns and sample values.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(importType)}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-100 flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-accent" /> Sample CSV Template
                </button>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-[#fcfbf9] hover:bg-gray-50 transition-colors text-center relative cursor-pointer">
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="w-10 h-10 text-accent mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-800">
                    {csvFile ? csvFile.name : "Click or drag & drop CSV file here"}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    Accepts .csv format up to 5MB
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {parseError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Result Summary */}
              {importResult && (
                <div
                  className={`p-4 rounded-lg border text-xs ${
                    importResult.success
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="font-bold flex items-center gap-2 mb-1">
                    {importResult.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    {importResult.success
                      ? `Successfully imported ${importResult.count} ${importType}(s)!`
                      : "Import completed with errors."}
                  </div>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1 text-[11px] text-red-600 max-h-32 overflow-y-auto">
                      {importResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Preview Table of Parsed Rows */}
              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Previewing {parsedRows.length} Record(s)</span>
                    <span className="text-green-600 text-[11px]">Ready for Import</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-gray-50 border-b border-gray-200 font-bold uppercase text-gray-600">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">District</th>
                          <th className="p-2">Gender</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedRows.slice(0, 10).map((r, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="p-2 text-gray-400 font-mono">{i + 1}</td>
                            <td className="p-2 font-semibold text-gray-800">{r.name || "—"}</td>
                            <td className="p-2 text-gray-600">{r.email || "—"}</td>
                            <td className="p-2 text-gray-600">{r.phone_number || r.phone || "—"}</td>
                            <td className="p-2 text-gray-600">{r.district || "—"}</td>
                            <td className="p-2 text-gray-600">{r.gender || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedRows.length > 10 && (
                    <div className="text-[10px] text-gray-400 italic text-right">
                      ...and {parsedRows.length - 10} more rows
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={parsedRows.length === 0 || isImporting}
                  onClick={handleConfirmImport}
                  className="px-6 py-2.5 bg-accent text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Confirm &amp; Import {parsedRows.length} {importType}(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
