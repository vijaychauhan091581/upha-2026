"use client";

import React, { useState, useRef, useEffect } from "react";
import { getUPHAForms, createUPHAForm, deleteUPHAForm, UPHAFormData, updateSystemSettings } from "@/lib/api";
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, X, Upload } from "lucide-react";
import ErrorBanner from "@/components/ErrorBanner";
import { useSettings } from "@/context/SettingsContext";

export default function ManageFormsPanel() {
  const [forms, setForms] = useState<UPHAFormData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const { settings, refreshSettings } = useSettings();
  const haiInputRef = useRef<HTMLInputElement>(null);
  const upoaInputRef = useRef<HTMLInputElement>(null);
  const [haiFileName, setHaiFileName] = useState<string | null>(null);
  const [upoaFileName, setUpoaFileName] = useState<string | null>(null);
  const [isUploadingLetter, setIsUploadingLetter] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.hai_affiliation_letter) {
        setHaiFileName(settings.hai_affiliation_letter.split('/').pop() || 'Current File');
      }
      if (settings.up_olympic_letter) {
        setUpoaFileName(settings.up_olympic_letter.split('/').pop() || 'Current File');
      }
    }
  }, [settings]);

  const handleLetterUpload = async (type: "hai" | "upoa", file: File) => {
    setIsUploadingLetter(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const formData = new FormData();
      if (type === "hai") formData.append("hai_affiliation_letter", file);
      if (type === "upoa") formData.append("up_olympic_letter", file);

      const res = await updateSystemSettings(formData);
      if (res.success) {
        setSubmitSuccess(`${type.toUpperCase()} Affiliation Letter updated successfully.`);
        await refreshSettings();
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to update letter.");
    } finally {
      setIsUploadingLetter(false);
    }
  };

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await getUPHAForms();
      if (res.success && res.forms) {
        setForms(res.forms);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setSubmitError("Please provide both a title and a file.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const res = await createUPHAForm(formData);
      if (res.success) {
        setSubmitSuccess("Form uploaded successfully.");
        setTitle("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchForms();
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to upload form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this form?")) return;

    try {
      const res = await deleteUPHAForm(id);
      if (res.success) {
        setForms(forms.filter(f => f.id !== id));
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete form.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="bg-[#fcfbf9] p-6 md:p-8 border-b border-gray-100 flex justify-between items-start shrink-0">
        <div>
          <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5 font-mono">
            ADMIN &middot; DOCUMENTS
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827]">
            MANAGE <span className="text-[#d97c55]">FORMS & AFFILIATION LETTERS</span>
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Side: Upload Form */}
        <div className="w-full md:w-1/3 p-6 md:p-8 border-r border-gray-100 bg-gray-50 flex flex-col shrink-0 overflow-y-auto">
          <h3 className="text-xs font-bold tracking-widest text-[#111827] uppercase mb-6 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#d97c55]" />
            Upload New Form
          </h3>

          {submitError && <ErrorBanner message={submitError} className="mb-4" />}
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 flex items-center gap-2 border border-green-200 rounded-sm text-xs">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              {submitSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                Document Title <span className="text-[#d97c55]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Player Registration Form"
                className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#d97c55]"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                Upload File (PDF/DOC) <span className="text-[#d97c55]">*</span>
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm py-6 px-4 text-center cursor-pointer transition-colors ${
                  file ? 'border-[#d97c55] bg-orange-50' : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 text-[#d97c55] mb-2" />
                    <span className="text-xs font-bold text-[#111827] truncate w-full px-2">{file.name}</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-[9px] uppercase tracking-widest text-red-500 hover:text-red-600 mt-2 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud className="w-6 h-6 mb-2 text-gray-400" />
                    <span className="text-xs font-medium">Click to select file</span>
                    <span className="text-[9px] uppercase tracking-widest mt-1">PDF or Word format</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingLetter}
              className="w-full bg-[#111827] text-white px-6 py-3 mt-4 text-xs font-bold uppercase tracking-wider hover:bg-[#d97c55] disabled:opacity-50 transition-colors rounded-sm"
            >
              {isSubmitting ? "Uploading..." : "Upload Form"}
            </button>
          </form>

          {/* Affiliation Letters Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xs font-bold tracking-widest text-[#111827] uppercase mb-6 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#3c8c7c]" />
              Affiliation Letters
            </h3>
            
            <div className="space-y-6">
              {/* HAI Letter */}
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  HAI Affiliation Letter
                </label>
                <div className="flex flex-col gap-2">
                  {haiFileName && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded-sm border border-gray-200 flex justify-between items-center">
                      <span className="truncate">{haiFileName}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    ref={haiInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleLetterUpload("hai", e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingLetter}
                    onClick={() => haiInputRef.current?.click()}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload HAI Letter
                  </button>
                </div>
              </div>

              {/* UPOA Letter */}
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  UPOA Affiliation Letter
                </label>
                <div className="flex flex-col gap-2">
                  {upoaFileName && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded-sm border border-gray-200 flex justify-between items-center">
                      <span className="truncate">{upoaFileName}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    ref={upoaInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleLetterUpload("upoa", e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingLetter}
                    onClick={() => upoaInputRef.current?.click()}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload UPOA Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Existing Forms */}
        <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col bg-white overflow-y-auto">
          <h3 className="text-xs font-bold tracking-widest text-[#111827] uppercase mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d97c55]" />
              Uploaded Forms
            </span>
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm text-[9px]">{forms.length} forms</span>
          </h3>

          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 border border-gray-200 rounded-sm"></div>
              ))}
            </div>
          ) : forms.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-sm bg-gray-50">
              <AlertCircle className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500 mb-1">No forms uploaded yet.</p>
              <p className="text-xs text-gray-400">Use the form on the left to add a new document.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {forms.map(form => (
                <div key={form.id} className="flex items-center justify-between p-4 border border-gray-100 hover:border-[#d97c55] rounded-sm transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-[#f4d166]/20 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-[#d97c55]" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-[#111827] truncate group-hover:text-[#d97c55] transition-colors">{form.title}</h4>
                      <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">
                        {new Date(form.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <a 
                      href={form.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-colors"
                    >
                      View
                    </a>
                    <button 
                      onClick={() => handleDelete(form.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-sm bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
