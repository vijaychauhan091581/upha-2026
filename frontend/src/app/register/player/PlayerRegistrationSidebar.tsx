"use client";

import { Phone, Mail, QrCode } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function PlayerRegistrationSidebar() {
  const { settings } = useSettings();
  const fee = settings?.player_fee ?? 111;
  const handleCopyUPI = () => {
    navigator.clipboard.writeText("uphandballassociation@sbi");
    // Optionally add a small toast notification here
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
        
        <div className="p-6 text-center border-b border-gray-100">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">ANNUAL MEMBERSHIP FEE</div>
          <div className="font-heading text-5xl font-bold text-primary mb-2">₹ {fee}</div>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">VALID THROUGH 31 MAR 2027</div>
        </div>
        
        <div className="p-6 bg-gray-50/50">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">PAY TO UPI ID</div>
          <div className="flex border border-gray-200 rounded-sm bg-white overflow-hidden mb-6">
            <div className="px-4 py-3 flex-1 font-mono text-sm text-gray-800">uphandballassociation@sbi</div>
            <button 
              onClick={handleCopyUPI}
              className="px-4 py-3 bg-gray-50 text-accent text-[10px] font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors border-l border-gray-200"
            >
              COPY
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 flex flex-col items-center justify-center rounded-sm overflow-hidden">
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

      {/* Need Help Box */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
        <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">NEED HELP?</div>
        <h3 className="font-heading text-2xl font-bold uppercase tracking-wide mb-4 text-primary">STUCK ON THE FORM?</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Reach our registration desk on a working day between 10 AM and 5 PM. We can help with payments, document uploads, or eligibility questions.
        </p>
        
        <ul className="space-y-4">
          <li className="flex gap-3 items-start">
            <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">PHONE</div>
              <div className="text-sm text-gray-500">{settings?.contact_mobile || "+91 75700 99990"}</div>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">EMAIL</div>
              <div className="text-sm text-gray-500">{settings?.contact_email || "upha2024@gmail.com"}</div>
            </div>
          </li>
        </ul>
      </div>

    </div>
  );
}
