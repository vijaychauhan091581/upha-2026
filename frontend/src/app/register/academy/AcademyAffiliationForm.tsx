"use client";

import { Clock, Image as ImageIcon, FileText, Camera, Award, MapPin, ChevronDown, Check, X } from "lucide-react";
import React, { useState } from "react";
import { registerAcademy } from "@/lib/api";
import { UP_DISTRICTS } from "@/lib/constants";
import ErrorBanner from "@/components/ErrorBanner";
import { useSettings } from "@/context/SettingsContext";

const DISCIPLINE_OPTIONS = [
  "Indoor Handball",
  "Beach Handball",
  "Mini Handball",
  "Youth Handball",
  "School Handball",
  "Grass Handball",
  "Wheelchair Handball",
  "3×3 Handball",
  "Handball Goalkeeper",
  "Handball Skills Development",
  "Handball Fitness & Conditioning",
  "Competitive Handball",
  "Women’s Handball",
  "Men’s Handball",
  "Junior Handball",
  "Senior Handball",
  "Handball Coaching",
  "Handball Talent Development",
];

export default function AcademyAffiliationForm() {
  const { settings } = useSettings();
  const fee = settings?.academy_fee ?? 2500;
  const [logoName, setLogoName] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const [academyType, setAcademyType] = useState("");
  const [disciplineFocus, setDisciplineFocus] = useState<string[]>([]);
  const [isDisciplineDropdownOpen, setIsDisciplineDropdownOpen] = useState(false);
  const [disciplineSearch, setDisciplineSearch] = useState("");
  const [categoriesTrained, setCategoriesTrained] = useState<string[]>([]);
  
  const [coachGrade, setCoachGrade] = useState("");

  const [dirPhotoName, setDirPhotoName] = useState("");
  const [dirPhotoPreview, setDirPhotoPreview] = useState("");
  const [dirAadharName, setDirAadharName] = useState("");

  const [regCertName, setRegCertName] = useState("");
  const [addressProofName, setAddressProofName] = useState("");
  const [facilityPhotosName, setFacilityPhotosName] = useState("");

  const [transactionImageName, setTransactionImageName] = useState("");
  const [transactionImagePreview, setTransactionImagePreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (dirPhotoPreview) URL.revokeObjectURL(dirPhotoPreview);
      if (transactionImagePreview) URL.revokeObjectURL(transactionImagePreview);
    };
  }, [logoPreview, dirPhotoPreview, transactionImagePreview]);

  const toggleDiscipline = (d: string) => setDisciplineFocus(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleCategory = (c: string) => setCategoriesTrained(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    const formData = new FormData(e.currentTarget);

    if (!academyType) {
      setSubmitError("Please select an Academy Type.");
      setIsSubmitting(false);
      return;
    }
    if (disciplineFocus.length === 0) {
      setSubmitError("Please select at least one Discipline Focus.");
      setIsSubmitting(false);
      return;
    }
    if (categoriesTrained.length === 0) {
      setSubmitError("Please select at least one Category Trained.");
      setIsSubmitting(false);
      return;
    }
    if (!coachGrade) {
      setSubmitError("Please select a Coaching Grade for the Head Coach.");
      setIsSubmitting(false);
      return;
    }

    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirm_password") || "");

    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setSubmitError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      formData.delete("confirm_password");
      formData.append("academy_type", academyType);
      formData.append("discipline_focus", disciplineFocus.join(","));
      formData.append("categories_trained", categoriesTrained.join(","));
      formData.append("coach_grade", coachGrade);

      // Remap frontend field names to match backend expectations:
      // "director_aadhar_number" → "director_adhar_number" (backend uses single-'a' spelling)
      const aadharNumber = formData.get("director_aadhar_number");
      if (aadharNumber) {
        formData.set("director_adhar_number", aadharNumber);
        formData.delete("director_aadhar_number");
      }
      // "director_mobile" → "director_phone_number"
      const directorMobile = formData.get("director_mobile");
      if (directorMobile) {
        formData.set("director_phone_number", directorMobile);
        formData.delete("director_mobile");
      }
      
      // "director_aadhar" (file) → "director_adhar"
      const directorAadharFile = formData.get("director_aadhar");
      if (directorAadharFile) {
        formData.set("director_adhar", directorAadharFile);
        formData.delete("director_aadhar");
      }

      await registerAcademy(formData);
      setSubmitSuccess("Academy Affiliation Request Submitted Successfully!");
      window.location.href = "/login";
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorBanner message={submitError} onDismiss={() => setSubmitError("")} />
      {submitSuccess && (
        <div className="border-l-4 border-green-500 bg-green-50 text-green-700 p-4 text-sm rounded-r-sm">
          {submitSuccess}
        </div>
      )}
      
      {/* Alert Banner */}
      <div className="border-l-4 border-accent bg-white shadow-sm p-6 rounded-r-sm">
        <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-4">
          <Clock className="w-4 h-4" /> BEFORE YOU BEGIN
        </div>
        <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside ml-2">
          <li>Keep your academy <strong>logo, address proof, bank details</strong>, and <strong>registration/incorporation certificate</strong> ready to upload.</li>
          <li>The Director&apos;s <strong>Aadhar, photo, and signature</strong> are required for verification by the UPHA office.</li>
          <li>If your Head Coach is already <strong>UPHA-accredited</strong>, enter their Coach ID to speed up review.</li>
          <li>Pay the affiliation fee of <strong>₹ {fee}</strong> via the QR code in the sidebar, then enter the transaction details below.</li>
          <li>Affiliated academies can register their players, field tournament teams, and apply for equipment grants.</li>
        </ul>
      </div>

      {/* Step 01 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">01</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">ACADEMY DETAILS</h2>
            <p className="text-sm text-gray-500">Information about your academy as a registered entity.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACADEMY LOGO <span className="text-accent">*</span></label>
            <label className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
              <input name="logo" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) {
                  setLogoName(f.name);
                  setLogoPreview(URL.createObjectURL(f));
                } else {
                  setLogoName("");
                  setLogoPreview("");
                }
              }} />
              {logoPreview ? (
                <div className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden shrink-0">
                  <img src={logoPreview} className="w-full h-full object-cover" alt="Logo preview" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="text-center md:text-left">
                <div className="text-sm font-semibold text-gray-800 mb-1">UPLOAD ACADEMY LOGO</div>
                <div className="text-[10px] text-gray-500">Square format, PNG or JPG. Minimum 500 x 500 px. Will appear on academy ID card, public directory listing, and event entries.</div>
                {logoName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {logoName}</div>}
              </div>
            </label>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACADEMY NAME <span className="text-accent">*</span></label>
            <input name="name" type="text" placeholder="e.g. Vajra Sports Academy" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">YEAR OF ESTABLISHMENT <span className="text-accent">*</span></label>
              <input name="year_of_establishment" type="number" placeholder="e.g. 2014" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">REGISTRATION NO. <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(if registered)</span></label>
              <input name="trust_registration_number" type="text" placeholder="Society / Trust / Company reg. no." className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              <div className="text-[10px] text-gray-400 mt-2">If your academy is registered as a society, trust, or company.</div>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACADEMY TYPE <span className="text-accent">*</span></label>
            <div className="flex flex-wrap gap-3">
              {["Boys Only", "Girls Only", "Co-ed - Boys & Girls"].map(type => (
                <button type="button" key={type} onClick={() => setAcademyType(type)} className={`px-4 py-2 border rounded-sm text-sm font-semibold transition-colors ${academyType === type ? "bg-accent/10 border-accent text-accent" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                DISCIPLINE FOCUS <span className="text-accent">*</span>
              </label>
              {disciplineFocus.length > 0 && (
                <button
                  type="button"
                  onClick={() => setDisciplineFocus([])}
                  className="text-[10px] text-red-500 hover:underline font-semibold"
                >
                  Clear All ({disciplineFocus.length})
                </button>
              )}
            </div>

            {/* Dropdown Selector */}
            <div className="relative">
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDisciplineDropdownOpen(!isDisciplineDropdownOpen)}
                className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-left flex items-center justify-between shadow-xs"
              >
                <span className={disciplineFocus.length > 0 ? "text-primary font-semibold" : "text-gray-400"}>
                  {disciplineFocus.length > 0
                    ? `${disciplineFocus.length} Disciplines Selected (${disciplineFocus.slice(0, 2).join(", ")}${disciplineFocus.length > 2 ? "..." : ""})`
                    : "Select Handball Disciplines from Dropdown..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDisciplineDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Backdrop to close on click outside */}
              {isDisciplineDropdownOpen && (
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDisciplineDropdownOpen(false)}
                />
              )}

              {/* Dropdown Menu */}
              {isDisciplineDropdownOpen && (
                <div className="absolute left-0 right-0 z-30 mt-1 bg-white border border-gray-200 rounded-md shadow-2xl max-h-80 overflow-y-auto p-2 animate-in fade-in duration-150">
                  <div className="p-2 border-b border-gray-100 flex items-center justify-between gap-2 sticky top-0 bg-white z-10">
                    <input
                      type="text"
                      placeholder="Search disciplines..."
                      value={disciplineSearch}
                      onChange={(e) => setDisciplineSearch(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setDisciplineFocus(DISCIPLINE_OPTIONS)}
                      className="text-[10px] whitespace-nowrap bg-[#111827] hover:bg-[#d97c55] text-white px-3 py-2 rounded font-bold uppercase tracking-wider transition-colors"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="py-1 divide-y divide-gray-50">
                    {DISCIPLINE_OPTIONS.filter((d) =>
                      d.toLowerCase().includes(disciplineSearch.toLowerCase())
                    ).map((d) => {
                      const isSelected = disciplineFocus.includes(d);
                      return (
                        <div
                          key={d}
                          onClick={() => toggleDiscipline(d)}
                          className={`flex items-center justify-between px-3 py-2.5 text-xs rounded cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent/10 text-accent font-semibold"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-accent border-accent text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{d}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Active</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Badges */}
            {disciplineFocus.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-1">
                {disciplineFocus.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-2.5 py-1 rounded-sm shadow-2xs"
                  >
                    <span>{d}</span>
                    <button
                      type="button"
                      onClick={() => toggleDiscipline(d)}
                      className="hover:bg-accent/20 rounded p-0.5 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="text-[10px] text-gray-400 mt-2">
              Select all handball disciplines your academy actively trains for.
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">CATEGORIES TRAINED <span className="text-accent">*</span></label>
            <div className="flex flex-wrap gap-3">
              {["Senior - Men", "Senior - Women", "Junior - Boys", "Junior - Girls", "Sub-Junior"].map(c => (
                <button type="button" key={c} onClick={() => toggleCategory(c)} className={`px-4 py-2 border rounded-sm text-sm font-semibold transition-colors ${categoriesTrained.includes(c) ? "bg-accent/10 border-accent text-accent" : "bg-[#fcfbf9] border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">DISTRICT <span className="text-accent">*</span></label>
              <select name="district" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-gray-600" required>
                <option value="">Select district</option>
                {UP_DISTRICTS.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PIN CODE <span className="text-accent">*</span></label>
              <input name="pin_code" type="text" placeholder="6-digit pin code" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">FULL ADDRESS <span className="text-accent">*</span></label>
            <textarea name="office_address" rows={3} placeholder="Building / Street / Area / City — as it should appear on official correspondence" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACADEMY EMAIL <span className="text-accent">*</span></label>
              <input name="email" type="email" placeholder="contact@academy.in" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACADEMY PHONE <span className="text-accent">*</span></label>
              <input name="office_phone_number" type="tel" placeholder="+91" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">WEBSITE <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(optional)</span></label>
              <input name="website" type="url" placeholder="https://" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">TRAINING FACILITY / VENUE <span className="text-accent">*</span></label>
              <input name="training_venue" type="text" placeholder="Court / ground name" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PASSWORD <span className="text-accent">*</span></label>
              <input name="password" type="password" placeholder="Create a password" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">CONFIRM PASSWORD <span className="text-accent">*</span></label>
              <input name="confirm_password" type="password" placeholder="Repeat password" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>
        </div>
      </div>

      {/* Step 02 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">02</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">DIRECTOR & HEAD COACH</h2>
            <p className="text-sm text-gray-500">The two key people the UPHA office will work with — the Director (who registers and is accountable for the academy) and the Head Coach (who runs training).</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Director Card */}
          <div className="border border-gray-200 border-dashed rounded-sm bg-[#fcfbf9] p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 border-dashed pb-4">
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-sm shrink-0">DR</div>
              <div>
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-primary">DIRECTOR</h3>
                <div className="text-[9px] font-bold tracking-widest text-accent uppercase">PRIMARY CONTACT · LEGALLY ACCOUNTABLE</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">FULL NAME <span className="text-accent">*</span></label>
                  <input name="director_name" type="text" placeholder="As on Aadhar" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">FATHER&apos;S NAME <span className="text-accent">*</span></label>
                  <input name="director_father_name" type="text" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">DATE OF BIRTH <span className="text-accent">*</span></label>
                  <input name="director_dob" type="date" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-gray-600" required />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">DESIGNATION <span className="text-accent">*</span></label>
                  <input name="director_designation" type="text" placeholder="e.g. Founder Director" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">MOBILE <span className="text-accent">*</span></label>
                  <input name="director_mobile" type="tel" placeholder="+91" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">EMAIL <span className="text-accent">*</span></label>
                  <input name="director_email" type="email" placeholder="director@academy.in" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">AADHAR NUMBER <span className="text-accent">*</span></label>
                <input name="director_aadhar_number" type="text" placeholder="XXXX XXXX XXXX" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <label className="block relative cursor-pointer group">
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">DIRECTOR&apos;S PHOTO <span className="text-accent">*</span></label>
                  <div className="border border-dashed border-gray-300 bg-white rounded-sm p-4 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
                    <input type="file" name="director_photo" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if(f) {
                        setDirPhotoName(f.name);
                        setDirPhotoPreview(URL.createObjectURL(f));
                      } else {
                        setDirPhotoName("");
                        setDirPhotoPreview("");
                      }
                    }} />
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <Camera className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">Passport-style photo</div>
                      <div className="text-[9px] text-gray-500">JPG or PNG · max 2 MB</div>
                      {dirPhotoName && <div className="text-[9px] text-primary mt-1 truncate max-w-[150px]">{dirPhotoName}</div>}
                    </div>
                  </div>
                  {dirPhotoPreview && (
                    <div className="mt-2 h-20 w-full overflow-hidden rounded-sm border border-gray-200">
                      <img src={dirPhotoPreview} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </label>
                <label className="block relative cursor-pointer group">
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">DIRECTOR&apos;S AADHAR <span className="text-accent">*</span></label>
                  <div className="border border-dashed border-gray-300 bg-white rounded-sm p-4 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
                    <input type="file" name="director_aadhar" accept=".pdf,image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setDirAadharName(e.target.files?.[0]?.name || "")} />
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800">Aadhar (front + back)</div>
                      <div className="text-[9px] text-gray-500">PDF or images · max 5 MB</div>
                      {dirAadharName && <div className="text-[9px] text-primary mt-1 truncate max-w-[150px]">{dirAadharName}</div>}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Head Coach Card */}
          <div className="border border-gray-200 border-dashed rounded-sm bg-[#fcfbf9] p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 border-dashed pb-4">
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-sm shrink-0">HC</div>
              <div>
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-primary">HEAD COACH</h3>
                <div className="text-[9px] font-bold tracking-widest text-accent uppercase">TRAINING LEAD · UPHA-ACCREDITED PREFERRED</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">FULL NAME <span className="text-accent">*</span></label>
                  <input name="coach_name" type="text" placeholder="As on Aadhar" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">MOBILE <span className="text-accent">*</span></label>
                  <input name="coach_mobile" type="tel" placeholder="+91" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">EMAIL <span className="text-gray-400 lowercase normal-case text-[9px] font-normal">(optional)</span></label>
                  <input name="coach_email" type="email" placeholder="coach@example.com" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">YEARS OF COACHING EXPERIENCE <span className="text-accent">*</span></label>
                  <input name="coach_experience" type="number" placeholder="e.g. 8" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">COACHING GRADE <span className="text-accent">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {["International", "National", "State", "District", "School / Club"].map(grade => (
                    <button type="button" key={grade} onClick={() => setCoachGrade(grade)} className={`px-4 py-2 border rounded-sm text-sm font-semibold transition-colors ${coachGrade === grade ? "bg-accent/10 border-accent text-accent" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 03 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">03</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">CAPACITY & DOCUMENTS</h2>
            <p className="text-sm text-gray-500">A snapshot of your academy&apos;s size and the documents the UPHA office requires for affiliation.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">CURRENT PLAYERS TRAINED <span className="text-accent">*</span></label>
            <input name="no_of_players" type="number" placeholder="e.g. 42" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">COACHES EMPLOYED <span className="text-accent">*</span></label>
            <input name="coaches_employed" type="number" placeholder="e.g. 4" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
          </div>
        </div>
        
        <div className="space-y-6 pt-2">
          <label className="block relative cursor-pointer group">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">REGISTRATION / INCORPORATION CERTIFICATE <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(if registered as society/trust/company)</span></label>
            <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
              <input type="file" name="registration_certificate" accept=".pdf,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setRegCertName(e.target.files?.[0]?.name || "")} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Registration certificate</div>
                <div className="text-[10px] text-gray-500">Society / Trust / Company incorporation certificate · PDF preferred · max 5 MB</div>
                {regCertName && <div className="text-[10px] text-primary mt-1">{regCertName}</div>}
              </div>
            </div>
          </label>
          
          <label className="block relative cursor-pointer group">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ADDRESS PROOF <span className="text-accent">*</span></label>
            <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
              <input type="file" name="address_proof" accept=".pdf,image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setAddressProofName(e.target.files?.[0]?.name || "")} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Address proof for academy premises</div>
                <div className="text-[10px] text-gray-500">Utility bill, rent agreement, or ownership document · max 5 MB</div>
                {addressProofName && <div className="text-[10px] text-primary mt-1">{addressProofName}</div>}
              </div>
            </div>
          </label>

          <label className="block relative cursor-pointer group">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">ACADEMY FACILITIES PHOTOS <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(recommended)</span></label>
            <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
              <input type="file" name="facility_photos" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFacilityPhotosName(e.target.files?.length ? `${e.target.files.length} files selected` : "")} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Upload 2 – 5 photos</div>
                <div className="text-[10px] text-gray-500">Court, training equipment, players in session · JPG or PNG · max 4 MB each</div>
                {facilityPhotosName && <div className="text-[10px] text-primary mt-1">{facilityPhotosName}</div>}
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-2">Strengthens your affiliation case and helps with selection trial hosting requests.</div>
          </label>
        </div>
      </div>

      {/* Step 04 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">04</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">PAYMENT CONFIRMATION</h2>
            <p className="text-sm text-gray-500">After paying the ₹ {fee} affiliation fee via the QR code in the sidebar, enter your transaction details.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PAYMENT TRANSACTION ID <span className="text-accent">*</span></label>
            <input name="transaction_id" type="text" placeholder="UPI reference / bank transaction ID" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            <div className="text-[10px] text-gray-400 mt-2">Found in your UPI app&apos;s transaction history.</div>
          </div>
          
          <div className="pt-2">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PAYMENT SCREENSHOT <span className="text-accent">*</span></label>
            <label className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
              <input name="transaction_image" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) {
                  setTransactionImageName(f.name);
                  setTransactionImagePreview(URL.createObjectURL(f));
                } else {
                  setTransactionImageName("");
                  setTransactionImagePreview("");
                }
              }} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Upload payment screenshot</div>
                <div className="text-[10px] text-gray-500">JPG or PNG · max 2 MB · must show transaction ID and amount</div>
                {transactionImageName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {transactionImageName}</div>}
              </div>
            </label>
            {transactionImagePreview && (
              <div className="mt-4 w-full md:w-[calc(50%-12px)] overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
                <img src={transactionImagePreview} alt="Payment screenshot preview" className="h-56 w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Box */}
      <div className="bg-[#111827] rounded-sm p-6 sm:p-8 flex flex-col gap-8 shadow-md">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center justify-center shrink-0 mt-1">
            <input type="checkbox" className="appearance-none w-5 h-5 border border-gray-600 rounded-sm bg-transparent checked:bg-accent checked:border-accent transition-colors cursor-pointer peer" required />
            <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
            <strong className="text-white">I declare</strong>{" "}on behalf of the academy that all information provided is true and accurate, that the academy operates lawfully and meets safe coaching standards, and that we agree to abide by UPHA&apos;s affiliation terms and code of conduct for affiliated academies.
          </span>
        </label>
        
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Form REF / ACA-2026 · Reviewed by UPHA Office
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-accent text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors rounded-sm disabled:opacity-50">
            {isSubmitting ? "SUBMITTING..." : "SUBMIT AFFILIATION REQUEST \u2192"}
          </button>
        </div>
      </div>

    </form>
  );
}
