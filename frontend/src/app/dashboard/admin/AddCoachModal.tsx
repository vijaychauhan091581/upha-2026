"use client";

import React, { useState, useRef } from "react";
import { X, UserPlus, AlertCircle, Camera, User, Mail, Phone, Calendar } from "lucide-react";
import { createCoachByAdmin, CoachData } from "@/lib/api";
import DistrictCombobox from "@/components/DistrictCombobox";

interface AddCoachModalProps {
  onClose: () => void;
  onSuccess: (newCoach: CoachData) => void;
}

export default function AddCoachModal({ onClose, onSuccess }: AddCoachModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [district, setDistrict] = useState("");
  const [role, setRole] = useState("State Handball Coach");
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
    if (!name.trim()) {
      setError("Please provide Coach Full Name.");
      return;
    }
    if (!district.trim()) {
      setError("Please select or search a valid District (out of 75 UP districts).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("district", district.trim());
      formData.append("place", district.trim());
      formData.append("occupation", role.trim());

      if (email.trim()) formData.append("email", email.trim());
      if (phone.trim()) {
        formData.append("phone", phone.trim());
        formData.append("phone_number", phone.trim());
      }
      if (gender.trim()) formData.append("gender", gender.trim());
      if (dob.trim()) {
        formData.append("dob", dob.trim());
        formData.append("date_of_birth", dob.trim());
      }

      if (fileInputRef.current?.files?.[0]) {
        formData.append("passport_image", fileInputRef.current.files[0]);
      }

      const res = await createCoachByAdmin(formData);
      if (res.success && (res.coach || res.data)) {
        onSuccess(res.coach || res.data);
        onClose();
      } else {
        setError(res.message || "Failed to create coach.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating coach.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#d97c55]" />
            <div>
              <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase">
                ADMINISTRATION &middot; 75 UP DISTRICTS
              </div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
                Register New Coach
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Photo Upload Area */}
          <div className="flex flex-col items-center justify-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-28 h-36 rounded-md border-2 border-dashed border-gray-300 hover:border-[#d97c55] bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-xs"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover object-top" />
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
            {photoPreview && (
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="mt-1.5 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider"
              >
                Clear Photo
              </button>
            )}
          </div>

          {/* 1. Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Coach Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 2. Email & 3. Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="coach@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* 4. Gender & 5. Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors text-gray-700"
              >
                <option value="Male">Male (Purush)</option>
                <option value="Female">Female (Mahila)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Date of Birth (DOB)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors text-gray-700"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* 6. District (Searchable 75 Districts Combobox) */}
          <div>
            <DistrictCombobox
              value={district}
              onChange={(val) => setDistrict(val)}
              required={true}
              label="District / Zila (UP 75 Districts)"
              placeholder="Search or select district (e.g. Varanasi, Lucknow...)"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Automatic 75 districts list ya shuru ke letter type karke filter karein.
            </p>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Designation / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. State Handball Coach"
              className="w-full px-3.5 py-2.5 bg-[#fcfbf9] border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
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
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Coach</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
