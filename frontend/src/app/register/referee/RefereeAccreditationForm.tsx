"use client";

import { Clock, Camera, FileText, Award, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerReferee } from "@/lib/api";
import { UP_DISTRICTS } from "@/lib/constants";
import ErrorBanner from "@/components/ErrorBanner";
import { useSettings } from "@/context/SettingsContext";

export default function RefereeAccreditationForm() {
  const { settings } = useSettings();
  const fee = settings?.referee_fee ?? 300;
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [occupation, setOccupation] = useState("");
  const [grade, setGrade] = useState("");
  const [transactionImageName, setTransactionImageName] = useState("");
  const [transactionImagePreview, setTransactionImagePreview] = useState("");
  const [passportImageName, setPassportImageName] = useState("");
  const [adharImageName, setAdharImageName] = useState("");
  const [certificateImageName, setCertificateImageName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (transactionImagePreview) {
        URL.revokeObjectURL(transactionImagePreview);
      }
    };
  }, [transactionImagePreview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("gender", gender);
    formData.set("blood_group", bloodGroup);
    formData.set("occupation", occupation === "Self-employed" ? "self_employed" : occupation.toLowerCase());
    formData.set("grade_applying_for", grade);

    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirm_password") || "");

    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      setSubmitSuccess("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      formData.delete("confirm_password");
      await registerReferee(formData);
      
      window.location.href = "/login";
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorBanner message={submitError} onDismiss={() => setSubmitError("")} />
      {submitSuccess ? (
        <div className="border-l-4 border-green-500 bg-green-50 text-green-700 p-4 text-sm rounded-r-sm">{submitSuccess}</div>
      ) : null}
      
      {/* Alert Banner */}
      <div className="border-l-4 border-accent bg-white shadow-sm p-6 rounded-r-sm">
        <div className="flex items-center gap-2 text-accent text-xs font-bold tracking-widest uppercase mb-4">
          <Clock className="w-4 h-4" /> BEFORE YOU BEGIN
        </div>
        <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside ml-2">
          <li>Keep your <strong>Aadhar number</strong>, a <strong>passport photo</strong>, and any <strong>officiating certificates</strong> ready to upload.</li>
          <li>Select the <strong>grade you are applying for</strong> honestly — the Referee Board may ask for documentary proof of prior officiating.</li>
          <li>Pay the accreditation fee of <strong>₹ {fee}</strong> via the QR code in the sidebar, then enter the transaction details below.</li>
          <li>Applications are reviewed by the <strong>UPHA Referee Board</strong>; you&apos;ll be notified once a decision is made.</li>
        </ul>
      </div>

      {/* Step 01 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">01</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">PERSONAL DETAILS</h2>
            <p className="text-sm text-gray-500">Your identity as it appears on official documents.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">FULL NAME <span className="text-accent">*</span></label>
              <input name="name" type="text" placeholder="As on Aadhar" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">FATHER&apos;S NAME <span className="text-accent">*</span></label>
              <input name="father_name" type="text" placeholder="Full name" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">EMAIL <span className="text-accent">*</span></label>
              <input name="email" type="email" placeholder="email@example.com" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">MOBILE NUMBER <span className="text-accent">*</span></label>
              <input name="phone_number" type="tel" placeholder="+91" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">DATE OF BIRTH <span className="text-accent">*</span></label>
              <input name="date_of_birth" type="date" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">GENDER <span className="text-accent">*</span></label>
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map(opt => (
                  <button key={opt} type="button" onClick={() => setGender(opt)} className={`flex-1 py-3 border text-sm rounded-sm transition-colors ${gender === opt ? 'border-primary bg-primary text-white font-medium' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">BLOOD GROUP <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(optional)</span></label>
            <div className="flex flex-wrap gap-3">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(opt => (
                <button key={opt} type="button" onClick={() => setBloodGroup(opt)} className={`w-12 h-12 flex items-center justify-center border text-sm font-bold rounded-sm transition-colors ${bloodGroup === opt ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  {opt}
                </button>
              ))}
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
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">OFFICIATING PROFILE</h2>
            <p className="text-sm text-gray-500">Your district, the grade you are applying for, and your officiating experience.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">OCCUPATION <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(optional)</span></label>
              <div className="flex gap-2">
                {['Government', 'Private', 'Self-employed'].map(opt => (
                  <button key={opt} type="button" onClick={() => setOccupation(opt)} className={`flex-1 py-3 px-2 border text-[11px] font-medium rounded-sm transition-colors ${occupation === opt ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-[#fcfbf9] text-gray-600 hover:border-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">GRADE APPLYING FOR <span className="text-accent">*</span></label>
            <div className="flex flex-wrap gap-3">
              {['International', 'National', 'State', 'District', 'School / Club'].map(opt => (
                <button key={opt} type="button" onClick={() => setGrade(opt)} className={`py-3 px-4 border text-xs font-semibold rounded-sm transition-colors flex items-center gap-2 ${grade === opt ? 'border-accent bg-orange-50 text-accent' : 'border-gray-200 bg-[#fcfbf9] text-gray-600 hover:border-gray-300'}`}>
                  <span className={`w-2 h-2 rounded-full ${grade === opt ? 'bg-accent' : 'bg-gray-300'}`}></span>
                  {opt}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 mt-3">Select the highest grade you are eligible for. The Referee Board may request documentary proof.</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">YEARS OF OFFICIATING EXPERIENCE <span className="text-accent">*</span></label>
              <input name="year_of_officiating_experience" type="number" placeholder="e.g. 5" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">HIGHEST LEVEL OFFICIATED <span className="text-accent">*</span></label>
              <select name="highest_level_officiated" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-gray-600" required>
                <option value="">Select level</option>
                <option value="international">International Tournaments</option>
                <option value="national">National Championships</option>
                <option value="state">State Championships</option>
                <option value="district">District / Local Tournaments</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">TOURNAMENTS OFFICIATED <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(approx.)</span></label>
              <input name="tournament_officiated" type="number" placeholder="e.g. 12" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Step 03 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">03</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">IDENTITY & DOCUMENTS</h2>
            <p className="text-sm text-gray-500">Identity verification and supporting documents for the Referee Board.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">AADHAR NUMBER <span className="text-accent">*</span></label>
              <input name="adhar_number" type="text" placeholder="XXXX XXXX XXXX" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>
          

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <label className="block cursor-pointer">
              <span className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PASSPORT PHOTO <span className="text-accent">*</span></span>
              <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors relative overflow-hidden">
                <input
                  name="passport_image"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setPassportImageName(f ? f.name : "");
                  }}
                />
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Passport-style photo</div>
                  <div className="text-[10px] text-gray-500">JPG or PNG · max 2 MB</div>
                  {passportImageName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {passportImageName}</div>}
                </div>
              </div>
            </label>
            <label className="block cursor-pointer">
              <span className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">AADHAR CARD UPLOAD <span className="text-accent">*</span></span>
              <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors relative overflow-hidden">
                <input
                  name="adhar_image"
                  type="file"
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setAdharImageName(f ? f.name : "");
                  }}
                />
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Aadhar (front + back)</div>
                  <div className="text-[10px] text-gray-500">JPG, PNG or PDF · max 5 MB</div>
                  {adharImageName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {adharImageName}</div>}
                </div>
              </div>
            </label>
          </div>
          
          <div className="pt-2">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">OFFICIATING CERTIFICATE / EXPERIENCE PROOF <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(recommended)</span></label>
            <label className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
              <input name="certificate_image" type="file" accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                const f = e.target.files?.[0];
                setCertificateImageName(f ? f.name : "");
              }} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Upload certificate or experience proof</div>
                <div className="text-[10px] text-gray-500">Prior accreditation, tournament letters, or course certificates · PDF preferred · max 5 MB</div>
                {certificateImageName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {certificateImageName}</div>}
              </div>
            </label>
            <div className="text-[10px] text-gray-400 mt-3">Strengthens your application — especially for State, National, or International grades.</div>
          </div>
        </div>
      </div>

      {/* Step 04 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">04</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">PAYMENT CONFIRMATION</h2>
            <p className="text-sm text-gray-500">After paying ₹ {fee} via the QR code in the sidebar, enter your transaction details.</p>
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
              <input
                name="transaction_image"
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    setTransactionImageName("");
                    setTransactionImagePreview("");
                    return;
                  }

                  setTransactionImageName(file.name);
                  setTransactionImagePreview((currentPreview) => {
                    if (currentPreview) {
                      URL.revokeObjectURL(currentPreview);
                    }
                    return URL.createObjectURL(file);
                  });
                }}
              />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Upload payment screenshot</div>
                <div className="text-[10px] text-gray-500">JPG or PNG · max 2 MB · must show transaction ID and amount</div>
                {transactionImageName ? (
                  <div className="text-[10px] text-primary mt-1 break-all">Selected: {transactionImageName}</div>
                ) : null}
              </div>
            </label>
            {transactionImagePreview ? (
              <div className="mt-4 w-full md:w-[calc(50%-12px)] overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
                <img
                  src={transactionImagePreview}
                  alt="Payment screenshot preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Submit Box */}
      <div className="bg-[#111827] rounded-sm p-6 sm:p-8 flex flex-col gap-8 shadow-md">
        <input type="hidden" name="gender" value={gender} />
        <input type="hidden" name="blood_group" value={bloodGroup} />
        <input type="hidden" name="occupation" value={occupation === "Self-employed" ? "self_employed" : occupation.toLowerCase()} />
        <input type="hidden" name="grade_applying_for" value={grade} />
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center justify-center shrink-0 mt-1">
            <input type="checkbox" className="appearance-none w-5 h-5 border border-gray-600 rounded-sm bg-transparent checked:bg-accent checked:border-accent transition-colors cursor-pointer peer" required />
            <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
            <strong className="text-white">I declare</strong>{" "}that the information provided is true and accurate, that I hold the officiating grade I have selected (and can produce documentation if required), and that I agree to abide by UPHA&apos;s code of conduct for match officials.
          </span>
        </label>
        
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Form REF / RFR-2026 · Reviewed by the UPHA Referee Board
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-accent text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors rounded-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION \u2192"}
          </button>
        </div>
      </div>

    </form>
  );
}
