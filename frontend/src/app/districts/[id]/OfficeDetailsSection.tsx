import { MapPin, Phone, Mail, FileText, CheckCircle2, Lock } from "lucide-react";
import React from "react";
import { DistrictData } from "@/lib/api";

function maskPhone(phone?: string | null) {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 4) {
    const last4 = cleaned.slice(-4);
    return `+91 •••••• ${last4}`;
  }
  return "••••••••••";
}

export default function OfficeDetailsSection({ district }: { district: DistrictData }) {
  const maskedPhone = maskPhone(district.office_phone_number);
  return (
    <div className="mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-12">
        <h2 className="font-heading text-4xl font-bold uppercase tracking-wide">
          OFFICE <span className="text-accent">DETAILS</span>
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          CONTACT AND REGISTRATION INFORMATION
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex gap-6 border-b border-dashed border-gray-200 pb-6">
            <div className="w-48 shrink-0 flex items-center gap-2 text-[9px] font-bold tracking-widest text-accent uppercase">
              <MapPin className="w-3.5 h-3.5" /> OFFICE ADDRESS
            </div>
            <div className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
              {district.office_address || "— Not yet provided —"}
            </div>
          </div>
          
          <div className="flex gap-6 border-b border-dashed border-gray-200 pb-6">
            <div className="w-48 shrink-0 flex items-center gap-2 text-[9px] font-bold tracking-widest text-accent uppercase">
              <Phone className="w-3.5 h-3.5" /> PHONE NUMBER
            </div>
            <div className={`text-sm ${maskedPhone ? 'text-gray-800 font-mono font-medium flex items-center gap-1.5' : 'text-gray-400 italic'}`}>
              {maskedPhone ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span>{maskedPhone}</span>
                  <span className="text-[10px] text-gray-400 font-sans font-normal">(Hidden for Privacy)</span>
                </>
              ) : (
                "— Not yet provided —"
              )}
            </div>
          </div>
          
          <div className="flex gap-6 border-b border-dashed border-gray-200 pb-6">
            <div className="w-48 shrink-0 flex items-center gap-2 text-[9px] font-bold tracking-widest text-accent uppercase">
              <Mail className="w-3.5 h-3.5" /> E-MAIL
            </div>
            <div className={`text-sm ${district.email ? 'text-gray-800 font-medium' : 'text-gray-400 italic'}`}>
              {district.email || "— Not yet provided —"}
            </div>
          </div>
          
          <div className="flex gap-6 border-b border-dashed border-gray-200 pb-6">
            <div className="w-48 shrink-0 flex items-center gap-2 text-[9px] font-bold tracking-widest text-accent uppercase">
              <FileText className="w-3.5 h-3.5" /> REGISTRATION NO.
            </div>
            <div className={`text-sm ${district.trust_registration_number ? 'text-gray-800 font-medium' : 'text-gray-400 italic'}`}>
              {district.trust_registration_number || "— Not yet provided —"}
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="w-48 shrink-0 flex items-center gap-2 text-[9px] font-bold tracking-widest text-accent uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" /> AFFILIATION STATUS
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-emerald-600 font-bold">&bull; Active</span> — recognized member unit of UPHA
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-[#f5f3ef] border border-[#e5e1d8] rounded-sm p-8 h-full flex flex-col">
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-accent uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> LOCATION
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-primary mb-6">{district.district}, U.P.</h3>
            
            <div className="bg-white border border-[#e5e1d8] rounded-sm h-32 flex items-center justify-center shadow-inner mb-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <MapPin className="w-8 h-8 text-accent relative z-10 drop-shadow-md" />
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-1">
              The association&apos;s office is located in {district.district}. For visits or correspondence, use the postal address provided.
            </p>
            
            <a href={`https://maps.google.com/?q=${encodeURIComponent(district.office_address || district.district)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors text-left w-max inline-block">
              OPEN IN MAPS &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
