"use client";

import React, { useState, useRef } from "react";
import { X, UserPlus, AlertCircle, Camera, Shield } from "lucide-react";
import { createRefereeByAdmin, RefereeData } from "@/lib/api";

interface AddRefereeModalProps {
  onClose: () => void;
  onSuccess: (newReferee: RefereeData) => void;
}

export default function AddRefereeModal({ onClose, onSuccess }: AddRefereeModalProps) {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [grade, setGrade] = useState("State");
  const [phone, setPhone] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !district.trim()) {
      setError("Please provide both Referee Name and District.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("district", district.trim());
      formData.append("grade_applying_for", grade);
      if (phone.trim()) formData.append("phone", phone.trim());

      if (fileInputRef.current?.files?.[0]) {
        formData.append("passport_image", fileInputRef.current.files[0]);
      }

      const res = await createRefereeByAdmin(formData);
      if (res.success && res.referee) {
        onSuccess(res.referee);
        onClose();
      } else {
        setError(res.message || "Failed to create referee.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating referee.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d97c55]" />
            <div>
              <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase">
                ADMINISTRATION
              </div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
                Add New Match Official
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-6 py-2.5 border-b border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Upload Area */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-36 rounded-md border-2 border-dashed border-gray-300 hover:border-[#d97c55] bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-xs"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center p-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5 text-gray-400 group-hover:text-[#d97c55]" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 uppercase">Upload Photo</span>
                  <span className="text-[9px] text-gray-400">JPG or PNG</span>
                </div>
              )}
              {photoPreview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider transition-opacity">
                  Change Photo
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Referee Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Surendra Pratap Singh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] transition-colors"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lucknow, Varanasi, Prayagraj..."
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] transition-colors"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Grade / Accreditation Level
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] transition-colors"
            >
              <option value="State">State Official</option>
              <option value="National">National Official</option>
              <option value="Accredited">Accredited Official</option>
            </select>
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Phone / Mobile Number <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] transition-colors"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-[#d97c55] hover:bg-[#c16744] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Add Referee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
