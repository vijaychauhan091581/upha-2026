"use client";

import React, { useState, useRef } from "react";
import { X, Check, Upload, AlertCircle, Save, ShieldCheck, Clock } from "lucide-react";
import { updateRegistration, ApplicantData } from "@/lib/api";

interface EditRegistrationModalProps {
  applicant: any; // { type: 'player'|'coach'|'referee'|'academy'|'district', data: any }
  onClose: () => void;
  onSuccess: (updatedData: any) => void;
}

export default function EditRegistrationModal({
  applicant,
  onClose,
  onSuccess,
}: EditRegistrationModalProps) {
  const { type, data } = applicant;
  const isOrg = type === "academy" || type === "district";

  // Form State
  const [name, setName] = useState(isOrg ? data.name || "" : data.user?.name || "");
  const [email, setEmail] = useState(isOrg ? data.email || "" : data.user?.email || "");
  const [phone, setPhone] = useState(
    isOrg
      ? data.office_phone_number || ""
      : data.user?.mobile || data.user?.phone_number || ""
  );
  const [district, setDistrict] = useState(data.district || "");
  const [paid, setPaid] = useState<boolean>(!!data.paid);

  // Player / Referee specific
  const [gender, setGender] = useState(data.user?.gender || "male");
  const [dob, setDob] = useState(data.user?.date_of_birth || "");
  const [fatherName, setFatherName] = useState(data.user?.father_name || "");
  const [adharNumber, setAdharNumber] = useState(data.user?.adhar_number || data.adhar_number || "");
  
  // Player specific
  const [clubName, setClubName] = useState(data.club_name || "");
  const [schoolName, setSchoolName] = useState(data.school_name || "");
  const [coachName, setCoachName] = useState(data.coach_name || "");
  const [height, setHeight] = useState(data.height?.toString() || "");
  const [weight, setWeight] = useState(data.weight?.toString() || "");
  const [dominantHand, setDominantHand] = useState(data.dominant_hand || "right");

  // Referee specific
  const [grade, setGrade] = useState(data.grade_applying_for || "Accredited");

  // Academy / District specific
  const [yearOfEst, setYearOfEst] = useState(data.year_of_establishment?.toString() || "");
  const [officeAddress, setOfficeAddress] = useState(data.office_address || "");
  const [noOfPlayers, setNoOfPlayers] = useState(data.no_of_players?.toString() || "");
  const [trustRegNo, setTrustRegNo] = useState(data.trust_registration_number || "");

  // Media
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    isOrg ? data.logo : data.user?.passport_image || data.passport_image || null
  );
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setRemovePhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("district", district);
      formData.append("paid", paid ? "1" : "0");

      if (type === "coach") {
        formData.append("name", name.trim());
        formData.append("district", district.trim());
        formData.append("place", district.trim());
        formData.append("paid", paid ? "1" : "0");
        if (phone.trim()) {
          formData.append("mobile", phone.trim());
          formData.append("phone_number", phone.trim());
        }
        if (coachName.trim()) {
          formData.append("occupation", coachName.trim());
        }
        if (removePhoto) {
          formData.append("remove_photo", "1");
        } else if (fileInputRef.current?.files?.[0]) {
          formData.append("passport_image", fileInputRef.current.files[0]);
        }
      } else if (isOrg) {
        formData.append("office_phone_number", phone);
        if (yearOfEst) formData.append("year_of_establishment", yearOfEst);
        if (officeAddress) formData.append("office_address", officeAddress);
        if (noOfPlayers) formData.append("no_of_players", noOfPlayers);
        if (trustRegNo) formData.append("trust_registration_number", trustRegNo);
        if (coachName) formData.append("coach_name", coachName);

        if (fileInputRef.current?.files?.[0]) {
          formData.append("logo", fileInputRef.current.files[0]);
        }
      } else {
        formData.append("mobile", phone);
        formData.append("gender", gender);
        formData.append("date_of_birth", dob);
        formData.append("father_name", fatherName);
        formData.append("adhar_number", adharNumber);

        if (type === "player") {
          formData.append("club_name", clubName);
          formData.append("school_name", schoolName);
          formData.append("coach_name", coachName);
          if (height) formData.append("height", height);
          if (weight) formData.append("weight", weight);
          formData.append("dominant_hand", dominantHand);
        } else if (type === "referee") {
          formData.append("grade_applying_for", grade);
        }

        if (fileInputRef.current?.files?.[0]) {
          formData.append("passport_image", fileInputRef.current.files[0]);
        }
      }

      const res = await updateRegistration(type, data.id, formData);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || "Failed to update registration.");
      }
    } catch (err: any) {
      setError(err.message || "Error updating registration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
              ADMIN CONTROL PANEL
            </div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
              Edit {type.toUpperCase()} Registration &middot; ID #{data.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-6 py-3 border-b border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Approval Status & Photo preview row */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-20 rounded border border-gray-300 bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-300 text-[10px] font-bold">No Image</div>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  {isOrg ? "Update Organization Logo" : type === "coach" ? "Coach Photo (Coach Ka Photo)" : "Update Passport Photo"}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#111827] file:text-white hover:file:bg-[#d97c55] cursor-pointer"
                />
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setRemovePhoto(true);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="mt-1.5 text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Remove Photo
                  </button>
                )}
              </div>
            </div>

            {/* Approval Toggle */}
            <div className="flex flex-col items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Verification / Approval Status
              </label>
              <button
                type="button"
                onClick={() => setPaid(!paid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-xs ${
                  paid
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                }`}
              >
                {paid ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>APPROVED (PAID)</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>PENDING REVIEW</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Coach Specific Form View (Coach Name, Photo, Place) */}
          {type === "coach" ? (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#d97c55]">
                COACH DETAILS &middot; PHOTO, NAME &amp; PLACE (ये तीनों अपडेट होंगे)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Coach Ka Naam (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Coach ka poora naam"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Place / District (Place) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Varanasi, Lucknow, Ayodhya..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Mobile / Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={coachName || data.occupation || "State Handball Coach"}
                    onChange={(e) => setCoachName(e.target.value)}
                    placeholder="e.g. State Handball Coach"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  {isOrg ? "Organization / District Name *" : "Full Legal Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Mobile / Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                />
              </div>
            </div>
          )}

          {/* Person Specific (Player / Referee only) */}
          {!isOrg && type !== "coach" && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#d97c55] mb-3">
                Personal & Identity Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] bg-white capitalize"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Aadhar Card Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    value={adharNumber}
                    onChange={(e) => setAdharNumber(e.target.value)}
                    placeholder="1234 5678 9012"
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role specific: Player */}
          {type === "player" && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#d97c55] mb-3">
                Player Sporting Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Club / Academy
                  </label>
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    School / College
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Coach Name
                  </label>
                  <input
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Hand
                    </label>
                    <select
                      value={dominantHand}
                      onChange={(e) => setDominantHand(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55] bg-white capitalize"
                    >
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role specific: Referee */}
          {type === "referee" && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#d97c55] mb-3">
                Referee Accreditation
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Grade / Level
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="State / National / Accredited"
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                />
              </div>
            </div>
          )}

          {/* Org specific: Academy / District */}
          {isOrg && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#d97c55] mb-3">
                Organization Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Year of Establishment
                  </label>
                  <input
                    type="number"
                    value={yearOfEst}
                    onChange={(e) => setYearOfEst(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Registered Players Count
                  </label>
                  <input
                    type="number"
                    value={noOfPlayers}
                    onChange={(e) => setNoOfPlayers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Trust / Registration Certificate No.
                  </label>
                  <input
                    type="text"
                    value={trustRegNo}
                    onChange={(e) => setTrustRegNo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Official Office Address
                  </label>
                  <textarea
                    rows={2}
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#d97c55] hover:bg-[#c16744] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
