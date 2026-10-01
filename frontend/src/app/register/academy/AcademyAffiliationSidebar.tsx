"use client";

import { Phone, Mail, QrCode, Check } from "lucide-react";
import React from "react";
import { useSettings } from "@/context/SettingsContext";

export default function AcademyAffiliationSidebar() {
  const { settings } = useSettings();
  const fee = settings?.academy_fee ?? 2500;
  const handleCopyUPI = () => {
    navigator.clipboard.writeText("uphandballassociation@sbi");
  };

  return (
    <div className="space-y-6">
      
      {/* Payment Box */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
        <div className="bg-[#111827] text-white p-4 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> UPHA PAYMENT
          </div>
          <div className="text-gray-400">REF / 2026</div>
        </div>
        
        <div className="p-6 text-center border-b border-gray-100 bg-orange-50/30">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">ACADEMY AFFILIATION</div>
          <div className="font-heading text-5xl font-bold text-primary mb-2">₹ {fee}</div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">VALID THROUGH 31 MAR 2027</div>
        </div>
        
        <div className="p-6 bg-white">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PAY TO UPI ID</div>
          <div className="flex border border-gray-200 rounded-sm bg-gray-50 overflow-hidden mb-6">
            <div className="px-4 py-3 flex-1 font-mono text-sm text-gray-800">uphandballassociation@sbi</div>
            <button 
              onClick={handleCopyUPI}
              className="px-4 py-3 bg-gray-50 text-accent text-[10px] font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors border-l border-gray-200"
            >
              COPY
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 flex flex-col items-center justify-center rounded-sm overflow-hidden mb-6">
            {settings?.payment_qr_code ? (
              <img src={settings.payment_qr_code} alt="UPI QR Code" className="w-full aspect-square object-contain" crossOrigin="anonymous" />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-50/50">
                <QrCode className="w-32 h-32 text-gray-800 stroke-[1]" />
              </div>
            )}
            <div className="w-full text-center py-4 bg-gray-50 border-t border-gray-100 text-[10px] font-bold tracking-widest text-gray-400 uppercase">SCAN WITH ANY UPI APP</div>
          </div>
        </div>
      </div>

      {/* Document Checklist Box */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[10px] font-bold tracking-widest text-gray-800 uppercase">DOCUMENT CHECKLIST</div>
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase">7 items</div>
        </div>
        
        <ul className="space-y-0">
          {[
            { id: "01", title: "Academy Logo", desc: "Square format, 500 x 500 px min." },
            { id: "02", title: "Director's Photo", desc: "Passport-style" },
            { id: "03", title: "Director's Aadhar", desc: "Front + back" },
            { id: "04", title: "Address Proof", desc: "Utility bill, lease, or ownership document" },
            { id: "05", title: "Bank Details", desc: "Cancelled cheque or passbook page" },
            { id: "06", title: "Registration Certificate", desc: "If registered as society/trust/company" },
            { id: "07", title: "Facility Photos", desc: "2-5 images (recommended)" },
          ].map((doc, idx) => (
            <li key={doc.id} className={`py-3 flex gap-3 ${idx !== 0 ? 'border-t border-gray-100' : 'border-t border-gray-100 mt-2'}`}>
              <div className="text-[10px] font-bold text-accent pt-0.5">{doc.id}</div>
              <div>
                <div className="text-xs font-bold text-gray-800">{doc.title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{doc.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* What You Get Box */}
      <div className="bg-[#111827] text-white shadow-sm rounded-sm p-6">
        <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">WHAT YOU GET</div>
        <h3 className="font-heading text-xl font-bold uppercase tracking-wide mb-6">AFFILIATION INCLUDES</h3>
        
        <ul className="space-y-4">
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Official UPHA academy affiliation certificate</div>
          </li>
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Academy ID and listing in the public directory</div>
          </li>
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Right to register players under your academy</div>
          </li>
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Right to field teams in UPHA tournaments</div>
          </li>
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Eligibility for UPHA equipment grants & schemes</div>
          </li>
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Pathway to host district trials & selection camps</div>
          </li>
          <li className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed">Priority notifications for state-level events</div>
          </li>
        </ul>
      </div>

      {/* Need Help Box */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
        <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">NEED HELP?</div>
        <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-primary mb-3">QUESTIONS ABOUT AFFILIATION?</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          The UPHA office is available on working days between 10 AM and 5 PM for queries on eligibility, documentation, or the affiliation process.
        </p>
        
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-3">
            <Phone className="w-3.5 h-3.5 text-accent mt-0.5" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-primary uppercase">PHONE</div>
              <div className="text-xs text-gray-500 mt-0.5">{settings?.contact_mobile || "+91 75700 99990"}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="w-3.5 h-3.5 text-accent mt-0.5" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-primary uppercase">EMAIL</div>
              <div className="text-xs text-gray-500 mt-0.5">{settings?.contact_email || "upha2024@gmail.com"}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
