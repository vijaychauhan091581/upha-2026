"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  MapPin,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Save,
  ShieldCheck,
  Clock,
  UserX,
  Mail,
  Phone,
  Calendar,
  User,
  Download,
  Upload,
} from "lucide-react";
import {
  listCoaches,
  CoachData,
  createCoachByAdmin,
  updateRegistration,
  deleteRegistration,
  removeRegistrationPhoto
} from "@/lib/api";
import DistrictCombobox from "@/components/DistrictCombobox";
import CsvImportExportModal from "./CsvImportExportModal";

export default function ManageCoachesPanel({ onClose }: { onClose?: () => void }) {
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Add / Edit form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingCoach, setEditingCoach] = useState<CoachData | null>(null);

  // Form inputs: name, email, phone, gender, dob, district + role + photo
  const [coachName, setCoachName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [district, setDistrict] = useState("");
  const [role, setRole] = useState("State Handball Coach");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Action loaders
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // CSV Import / Export
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvInitialTab, setCsvInitialTab] = useState<"export" | "import">("export");

  const fetchCoachesList = async () => {
    try {
      setLoading(true);
      const res = await listCoaches();
      if (res && res.success && Array.isArray(res.coaches)) {
        setCoaches(res.coaches);
      } else {
        setError("Failed to load coaches.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching coaches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachesList();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const resetForm = () => {
    setCoachName("");
    setEmail("");
    setPhone("");
    setGender("Male");
    setDob("");
    setDistrict("");
    setRole("State Handball Coach");
    setPhotoPreview(null);
    setEditingCoach(null);
    setIsAdding(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleOpenEdit = (coach: CoachData) => {
    setEditingCoach(coach);
    setIsAdding(true);
    setCoachName(coach.user?.name || "");
    setEmail(coach.user?.email && !coach.user.email.endsWith("@upha.org") ? coach.user.email : "");
    setPhone(coach.user?.phone_number || coach.user?.mobile || "");
    setGender(coach.user?.gender || "Male");
    setDob(coach.user?.date_of_birth ? coach.user.date_of_birth.split("T")[0] : "");
    setDistrict(coach.district || "");
    setRole(coach.occupation || "State Handball Coach");
    setPhotoPreview(coach.user?.passport_image || coach.passport_image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachName.trim()) {
      alert("Coach ka naam daalna zaroori hai!");
      return;
    }
    if (!district.trim()) {
      alert("District daalna zaroori hai (75 UP districts me se chunein ya type karein)!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", coachName.trim());
      formData.append("district", district.trim());
      formData.append("place", district.trim());
      formData.append("occupation", role.trim());

      if (email.trim()) formData.append("email", email.trim());
      if (phone.trim()) {
        formData.append("phone", phone.trim());
        formData.append("phone_number", phone.trim());
        formData.append("mobile", phone.trim());
      }
      if (gender.trim()) formData.append("gender", gender.trim());
      if (dob.trim()) {
        formData.append("dob", dob.trim());
        formData.append("date_of_birth", dob.trim());
      }

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.append("passport_image", file);
      }

      if (editingCoach) {
        // Update Coach
        formData.append("paid", editingCoach.paid ? "1" : "0");
        const res = await updateRegistration("coaches", editingCoach.id, formData);
        if (res.success) {
          showToast(`Coach "${coachName}" updated successfully!`);
          resetForm();
          await fetchCoachesList();
        } else {
          alert(res.message || "Failed to update coach.");
        }
      } else {
        // Add Coach
        const res = await createCoachByAdmin(formData);
        if (res.success) {
          showToast(`Coach "${coachName}" registered successfully!`);
          resetForm();
          await fetchCoachesList();
        } else {
          alert(res.message || "Failed to add coach.");
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to save coach");
    } finally {
      setSubmitting(false);
    }
  };

  // Remove Photo of a Coach
  const handleRemovePhoto = async (coach: CoachData) => {
    const confirmRemove = window.confirm(
      `Kya aap Coach "${coach.user?.name || "Coach"}" ki photo hatana chahte hain?`
    );
    if (!confirmRemove) return;

    setActionLoadingId(coach.id);
    try {
      const res = await removeRegistrationPhoto("coaches", coach.id);
      if (res.success) {
        showToast("Coach ki photo hata di gayi hai!");
        await fetchCoachesList();
      } else {
        alert(res.message || "Photo hatane me samasya aayi.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove photo");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Coach
  const handleDeleteCoach = async (coach: CoachData) => {
    const confirmDelete = window.confirm(
      `DHYAN DEIN: Kya aap sach me Coach "${coach.user?.name || "Coach"}" ko delete karna chahte hain? Ye data permanent delete ho jayega.`
    );
    if (!confirmDelete) return;

    setActionLoadingId(coach.id);
    try {
      const res = await deleteRegistration("coaches", coach.id);
      if (res.success) {
        showToast(`Coach "${coach.user?.name || "Coach"}" delete ho chuka hai.`);
        await fetchCoachesList();
      } else {
        alert(res.message || "Failed to delete coach.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete coach");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCoaches = (coaches || []).filter((c) => {
    if (!c) return false;
    const name = c.user?.name || "";
    const dist = c.district || "";
    const mail = c.user?.email || "";
    const phoneNum = c.user?.phone_number || c.user?.mobile || "";
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      dist.toLowerCase().includes(term) ||
      mail.toLowerCase().includes(term) ||
      phoneNum.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-[#111827] text-white px-5 py-2.5 rounded shadow-xl text-xs font-bold flex items-center gap-2 border border-emerald-500 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#d97c55]"></span>
            <span className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
              TECHNICAL CADRE &middot; UTTAR PRADESH (75 DISTRICTS)
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#d97c55]" />
            <span>LICENSED COACHES MANAGEMENT</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Coach ka Name, Email, Phone, Gender, DOB aur UP ke 75 Districts me se select karke add/update karein.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCsvInitialTab("export");
              setIsCsvModalOpen(true);
            }}
            className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-2xs hover:border-[#d97c55] hover:text-[#d97c55]"
            title="Export Coaches to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCsvInitialTab("import");
              setIsCsvModalOpen(true);
            }}
            className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-2xs hover:border-[#d97c55] hover:text-[#d97c55]"
            title="Import Coaches from CSV"
          >
            <Upload className="w-3.5 h-3.5 text-[#d97c55]" />
            <span>Import CSV</span>
          </button>
          {!isAdding ? (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-[#111827] hover:bg-[#d97c55] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Coach</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Cancel Form</span>
            </button>
          )}
        </div>
      </div>

      {/* ADD / EDIT COACH FORM */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50/90 border-2 border-[#d97c55]/30 rounded-lg p-5 sm:p-6 space-y-5 animate-in fade-in duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#111827]">
                {editingCoach
                  ? `EDIT COACH · ${editingCoach.user?.name || "Official"} (ID #${editingCoach.id})`
                  : "REGISTER NEW COACH · COMPLETE PROFILE"}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Photo Box (Left Column) */}
            <div className="lg:col-span-1 flex flex-col items-center justify-start p-4 bg-white border border-gray-200 rounded-md">
              <div className="relative w-32 h-40 rounded-md border-2 border-dashed border-[#d97c55]/50 overflow-hidden bg-gray-50 flex items-center justify-center mb-3 shadow-inner">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="text-center p-2">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                      No Photo Selected
                    </span>
                  </div>
                )}
              </div>

              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5 text-center">
                Coach Photo (Tasveer)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#111827] file:text-white hover:file:bg-[#d97c55] cursor-pointer"
              />

              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="mt-2 text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 uppercase tracking-wider"
                >
                  <X className="w-3 h-3" /> Clear Preview
                </button>
              )}
            </div>

            {/* Form Fields (Right Columns) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Coach Ka Naam (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={coachName}
                      onChange={(e) => setCoachName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar Sharma"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* 2. Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. coach.ramesh@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone, Gender & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 3. Phone */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Phone / Mobile <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* 4. Gender */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors text-gray-700"
                  >
                    <option value="Male">Male (Purush)</option>
                    <option value="Female">Female (Mahila)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* 5. Date of Birth */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Date of Birth (DOB)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors text-gray-700"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Row 3: District (Searchable 75 Districts Combobox) and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 6. District with 75 UP Districts & Real-time Letter Filter */}
                <div>
                  <DistrictCombobox
                    value={district}
                    onChange={(val) => setDistrict(val)}
                    required={true}
                    label="District / Zila (UP 75 Districts)"
                    placeholder="Search or select district (e.g. Varanasi, Lucknow...)"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Automatic 75 districts list ya shuru ke letter type karein aur filter ho jayega.
                  </p>
                </div>

                {/* 7. Designation / Role */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. State Handball Coach"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55] transition-colors"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Default: State Handball Coach
                  </p>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-200 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#d97c55] hover:bg-[#c16744] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      <span>Saving Coach...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingCoach ? "Update Coach Profile" : "Register Coach Now"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Toolbar & Live Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-3 rounded border border-gray-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search coaches by name, district, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-[#d97c55]"
          />
        </div>
        <div className="text-[11px] font-bold tracking-widest uppercase text-gray-500 px-3 shrink-0">
          TOTAL: <span className="text-[#111827]">{filteredCoaches.length} COACHES</span>
        </div>
      </div>

      {/* Coaches List / Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d97c55]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      ) : filteredCoaches.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded border border-gray-200 p-8">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">No coaches found</p>
          <p className="text-xs text-gray-400 mt-1">
            Click "+ Add New Coach" above to register coaches in the state directory.
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-[#111827] text-white uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Coach Profile</th>
                  <th className="py-3 px-4">Contact (Email & Phone)</th>
                  <th className="py-3 px-4">District (Zila)</th>
                  <th className="py-3 px-4">Role / ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCoaches.map((coach) => {
                  const name = coach.user?.name || "Official Coach";
                  const photoUrl = coach.user?.passport_image || coach.passport_image;
                  const initials =
                    name
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "CH";

                  const isActionBusy = actionLoadingId === coach.id;
                  const coachEmail = coach.user?.email && !coach.user.email.endsWith("@upha.org") ? coach.user.email : null;
                  const coachPhone = coach.user?.phone_number || coach.user?.mobile || null;
                  const coachGender = coach.user?.gender || null;
                  const coachDob = coach.user?.date_of_birth ? coach.user.date_of_birth.split("T")[0] : null;

                  return (
                    <tr key={coach.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Photo thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-14 rounded border border-gray-200 overflow-hidden bg-gray-100 shadow-xs flex items-center justify-center shrink-0">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={name}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#111827] text-white font-heading font-bold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Coach Name, Gender, DOB */}
                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-sm text-[#111827] uppercase">
                          {name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-medium">
                          {coachGender && (
                            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {coachGender}
                            </span>
                          )}
                          {coachDob && (
                            <span className="flex items-center gap-1 text-gray-400">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span>{coachDob}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact: Email & Phone */}
                      <td className="py-3 px-4">
                        {coachEmail ? (
                          <div className="flex items-center gap-1 text-[11px] text-gray-700 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-[#d97c55] shrink-0" />
                            <span className="truncate">{coachEmail}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No email</span>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1">
                          <Phone className="w-3 h-3 text-[#d97c55] shrink-0" />
                          <span>{coachPhone || "No phone"}</span>
                        </div>
                      </td>

                      {/* District */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 font-bold text-gray-800 bg-[#d97c55]/10 text-[#d97c55] px-2 py-1 rounded text-xs">
                          <MapPin className="w-3.5 h-3.5 text-[#d97c55] shrink-0" />
                          <span>{coach.district || "Uttar Pradesh"}</span>
                        </div>
                      </td>

                      {/* Role / ID */}
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          UPHA-CCH-{coach.id.toString().padStart(4, "0")}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[140px]">
                          {coach.occupation || "State Coach"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {coach.paid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(coach)}
                            disabled={isActionBusy}
                            className="px-2.5 py-1.5 bg-[#111827] hover:bg-[#d97c55] text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                            title="Edit Coach Profile"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {/* Photo Remove Button */}
                          {photoUrl && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(coach)}
                              disabled={isActionBusy}
                              className="px-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                              title="Coach ki photo hatayein (Remove Photo)"
                            >
                              <UserX className="w-3 h-3 text-amber-700" />
                              <span>Photo</span>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCoach(coach)}
                            disabled={isActionBusy}
                            className="px-2 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                            title="Delete Coach permanently"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Import / Export Modal */}
      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        currentApplicants={(coaches || []).map((c) => ({ type: "coach", data: c }))}
        onImportSuccess={() => {
          fetchCoachesList();
          showToast("Coaches CSV imported successfully!");
        }}
        initialTab={csvInitialTab}
      />
    </div>
  );
}
