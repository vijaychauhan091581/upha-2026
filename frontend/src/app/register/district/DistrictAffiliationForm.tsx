"use client";

import { Clock, Image as ImageIcon, FileText, Upload, Camera, Award } from "lucide-react";
import React, { useState } from "react";
import { registerDistrict } from "@/lib/api";
import { UP_DISTRICTS } from "@/lib/constants";
import ErrorBanner from "@/components/ErrorBanner";
import { useSettings } from "@/context/SettingsContext";

// Helper component for Office Bearer Cards
const OfficeBearerCard = ({ num, title, subtitle, prefix }: { num: string, title: string, subtitle: string, prefix: string }) => {
  const [adharPreview, setAdharPreview] = useState("");
  const [passportPreview, setPassportPreview] = useState("");
  const [adharName, setAdharName] = useState("");
  const [passportName, setPassportName] = useState("");

  return (
  <div className="border border-gray-200 border-dashed rounded-sm bg-white p-6 md:p-8">
    <div className="flex justify-between items-start mb-6 border-b border-gray-100 border-dashed pb-4">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-sm shrink-0">
          {num}
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-primary">{title}</h3>
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase">{subtitle}</div>
        </div>
      </div>
      <div className="text-[9px] font-bold tracking-wider px-2 py-1 border border-gray-200 rounded-sm text-gray-400 bg-gray-50 uppercase">
        REQUIRED
      </div>
    </div>
    
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">FULL NAME <span className="text-accent">*</span></label>
          <input name={`${prefix}_name`} type="text" placeholder="As on Aadhar" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
        </div>
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">FATHER&apos;S NAME <span className="text-accent">*</span></label>
          <input name={`${prefix}_father_name`} type="text" placeholder="Full name" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">MOBILE NUMBER <span className="text-accent">*</span></label>
          <input name={`${prefix}_phone_number`} type="tel" placeholder="+91" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
        </div>
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">EMAIL <span className="text-accent">*</span></label>
          <input name={`${prefix}_email`} type="email" placeholder="email@example.com" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
        </div>
      </div>
      
      <div>
        <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">RESIDENTIAL ADDRESS <span className="text-accent">*</span></label>
        <textarea name={`${prefix}_address`} rows={2} placeholder="Full postal address" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" required></textarea>
      </div>
      
      <div>
        <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">AADHAR NUMBER <span className="text-accent">*</span></label>
        <input name={`${prefix}_adhar_number`} type="text" placeholder="XXXX XXXX XXXX" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <label className="block relative cursor-pointer group">
          <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">AADHAR CARD UPLOAD <span className="text-accent">*</span></label>
          <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-4 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
            <input
              name={`${prefix}_adhar_image`}
              type="file"
              accept="image/*,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAdharName(file.name);
                  if (file.type.startsWith("image/")) {
                    setAdharPreview(URL.createObjectURL(file));
                  } else {
                    setAdharPreview("");
                  }
                }
              }}
            />
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800">Aadhar (front + back)</div>
              <div className="text-[9px] text-gray-500">JPG, PNG or PDF · max 5 MB</div>
              {adharName && <div className="text-[9px] text-primary mt-1 truncate max-w-[150px]">{adharName}</div>}
            </div>
          </div>
          {adharPreview && (
            <div className="mt-2 h-20 w-full overflow-hidden rounded-sm border border-gray-200">
              <img src={adharPreview} className="w-full h-full object-cover" alt="Adhar preview" />
            </div>
          )}
        </label>
        
        <label className="block relative cursor-pointer group">
          <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-2">PASSPORT PHOTO <span className="text-accent">*</span></label>
          <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-4 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
            <input
              name={`${prefix}_passport_image`}
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPassportName(file.name);
                  setPassportPreview(URL.createObjectURL(file));
                }
              }}
            />
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <Camera className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800">Passport-style photo</div>
              <div className="text-[9px] text-gray-500">JPG or PNG · max 2 MB</div>
              {passportName && <div className="text-[9px] text-primary mt-1 truncate max-w-[150px]">{passportName}</div>}
            </div>
          </div>
          {passportPreview && (
            <div className="mt-2 h-20 w-full overflow-hidden rounded-sm border border-gray-200">
              <img src={passportPreview} className="w-full h-full object-cover" alt="Passport preview" />
            </div>
          )}
        </label>
      </div>
    </div>
  </div>
  );
};

export default function DistrictAffiliationForm() {
  const { settings } = useSettings();
  const fee = settings?.district_fee ?? 1100;
  
  const [logoName, setLogoName] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [certName, setCertName] = useState("");
  const [socCertName, setSocCertName] = useState("");
  const [transactionImageName, setTransactionImageName] = useState("");
  const [transactionImagePreview, setTransactionImagePreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  React.useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (transactionImagePreview) URL.revokeObjectURL(transactionImagePreview);
    };
  }, [logoPreview, transactionImagePreview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirm_password") as string;
      
      if (password !== confirmPassword) {
        setSubmitError("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setSubmitError("Password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
      }

      await registerDistrict(formData);
      setSubmitSuccess("District Affiliation Request Submitted Successfully!");
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
          <li>Gather Aadhar copies and passport photos for all <strong>three office bearers</strong> (Adhyaksh, Sachiv, Koshadhyaksh).</li>
          <li>Prepare your <strong>unit logo</strong> (PNG or SVG, square aspect) and an <strong>authorization letter</strong> from your district committee.</li>
          <li>Pay the affiliation fee of <strong>₹ {fee}</strong> via the QR code in the sidebar, then enter the transaction details below.</li>
          <li>Use the document checklist on the right to track what&apos;s been uploaded as you fill the form.</li>
        </ul>
      </div>

      {/* Step 01 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">01</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">UNIT DETAILS</h2>
            <p className="text-sm text-gray-500">Name, location, contact information, and reach of your district handball association.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">UNIT NAME <span className="text-accent">*</span></label>
            <input name="name" type="text" placeholder="e.g. Lucknow District Handball Association" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            <div className="text-[10px] text-gray-400 mt-2">Full official name as it appears on your registration documents.</div>
          </div>
          
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
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">YEAR ESTABLISHED <span className="text-accent">*</span></label>
              <input name="year_of_establishment" type="number" placeholder="e.g. 1985" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              <div className="text-[10px] text-gray-400 mt-2">Year the district unit was first formed.</div>
            </div>
          </div>
          
          <div className="pt-2">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">UNIT LOGO <span className="text-accent">*</span></label>
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
                <div className="w-20 h-20 rounded-full bg-white border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                  <span className="text-gray-300 font-bold text-2xl font-serif">L</span>
                </div>
              )}
              <div className="text-center md:text-left">
                <div className="text-sm font-semibold text-gray-800 mb-1">Upload your unit logo</div>
                <div className="text-[10px] text-gray-500 mb-3">PNG, SVG or JPG · square aspect ratio · 500 x 500 px minimum · max 2 MB</div>
                {logoName ? (
                  <div className="text-[10px] text-primary mt-1 break-all">Selected: {logoName}</div>
                ) : (
                  <div className="text-[10px] font-bold tracking-widest text-accent uppercase">CHOOSE FILE &rarr;</div>
                )}
              </div>
            </label>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">SOCIETY / TRUST REGISTRATION NO. <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(if applicable)</span></label>
            <input name="trust_registration_number" type="text" placeholder="e.g. SR/12345/2010" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            <div className="text-[10px] text-gray-400 mt-2">Required only if your unit is registered under the Societies Registration Act, 1860 or as a Trust.</div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">OFFICE ADDRESS <span className="text-accent">*</span></label>
            <textarea name="office_address" rows={3} placeholder="Full postal address of the district unit's office" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">OFFICE PHONE <span className="text-accent">*</span></label>
              <input name="office_phone_number" type="tel" placeholder="Landline or mobile" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">OFFICE EMAIL <span className="text-accent">*</span></label>
              <input name="email" type="email" placeholder="contact@your-district.org" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">WEBSITE <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(optional)</span></label>
            <input name="website" type="url" placeholder="https://" className="w-full md:w-[calc(50%-12px)] bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">REGISTERED PLAYERS <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(approximate)</span></label>
              <input name="no_of_players" type="number" placeholder="e.g. 120" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
              <div className="text-[10px] text-gray-400 mt-2">Current count of active players in the district.</div>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">AFFILIATED CLUBS / ACADEMIES <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(approximate)</span></label>
              <input type="number" placeholder="e.g. 8" className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              <div className="text-[10px] text-gray-400 mt-2">Number of clubs or academies under this district unit.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
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
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">OFFICE BEARERS</h2>
            <p className="text-sm text-gray-500">Provide identity and contact details for the three principal office bearers of the district unit. All three positions are mandatory.</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <OfficeBearerCard num="01" title="ADHYAKSH" subtitle="PRESIDENT · CHIEF OFFICE BEARER" prefix="adhyaksha" />
          <OfficeBearerCard num="02" title="SACHIV" subtitle="SECRETARY · ADMINISTRATIVE HEAD" prefix="sachiv" />
          <OfficeBearerCard num="03" title="KOSHADHYAKSH" subtitle="TREASURER · FINANCIAL HEAD" prefix="koshadhyaksha" />
        </div>
      </div>

      {/* Step 03 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">03</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">SUPPORTING DOCUMENTS</h2>
            <p className="text-sm text-gray-500">An authorization letter is required to verify your authority to register on behalf of the district. Other documents are optional but strengthen your application.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <label className="block relative cursor-pointer group">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">AUTHORIZATION LETTER / RESOLUTION <span className="text-accent">*</span></label>
            <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
              <input name="authorization_letter" type="file" accept=".pdf,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required onChange={(e) => {
                const f = e.target.files?.[0];
                setCertName(f ? f.name : "");
              }} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Upload authorization letter</div>
                <div className="text-[10px] text-gray-500">Signed letter or committee resolution authorizing this registration · PDF preferred · max 5 MB</div>
                {certName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {certName}</div>}
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-2">A signed letter from the district committee or a resolution from a duly-convened meeting authorizing the named office bearers to register on behalf of the unit.</div>
          </label>
          
          <label className="block relative cursor-pointer group">
            <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">SOCIETY / TRUST REGISTRATION CERTIFICATE <span className="text-gray-400 lowercase normal-case text-[10px] font-normal">(optional)</span></label>
            <div className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm p-6 flex items-center gap-4 group-hover:bg-gray-50 transition-colors">
              <input name="registration_certificate" type="file" accept=".pdf,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                const f = e.target.files?.[0];
                setSocCertName(f ? f.name : "");
              }} />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Upload registration certificate</div>
                <div className="text-[10px] text-gray-500">If registered as a Society or Trust · JPG, PNG or PDF · max 5 MB</div>
                {socCertName && <div className="text-[10px] text-primary mt-1 break-all">Selected: {socCertName}</div>}
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-2">Only required if you entered a Society/Trust registration number in Section 01.</div>
          </label>
        </div>
      </div>

      {/* Step 04 */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 lg:p-12">
        <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="font-heading text-4xl font-bold text-accent">04</div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-primary mb-1">PAYMENT CONFIRMATION</h2>
            <p className="text-sm text-gray-500">After paying the ₹ {fee} affiliation fee via the QR code in the sidebar, enter your transaction details and upload the receipt.</p>
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
                <ImageIcon className="w-4 h-4 text-gray-600" />
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
            <strong className="text-white">I declare</strong>{" "}that all information and documents submitted are true and accurate, that I have been duly authorized by the district committee to file this affiliation request, and that I accept UPHA&apos;s affiliation terms including the obligation to file annual returns and maintain federation standards.
          </span>
        </label>
        
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Form REF / DST-2026 · Powered by UPHA
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-accent text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-accent/90 transition-colors rounded-sm disabled:opacity-50">
            {isSubmitting ? "SUBMITTING..." : "SUBMIT AFFILIATION REQUEST \u2192"}
          </button>
        </div>
      </div>

    </form>
  );
}
