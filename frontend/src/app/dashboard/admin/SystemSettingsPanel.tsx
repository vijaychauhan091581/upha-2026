"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { updateSystemSettings } from "@/lib/api";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import ErrorBanner from "@/components/ErrorBanner";

export default function SystemSettingsPanel() {
  const { settings, refreshSettings, loading } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [fees, setFees] = useState({
    player_fee: 111,
    referee_fee: 300,
    academy_fee: 2500,
    district_fee: 1100,
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook_link: "",
    instagram_link: "",
    twitter_link: "",
    youtube_link: "",
  });

  const [contacts, setContacts] = useState({
    contact_email: "",
    contact_mobile: "",
    contact_address: "",
  });

  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
    if (settings) {
      setFees({
        player_fee: settings.player_fee,
        referee_fee: settings.referee_fee,
        academy_fee: settings.academy_fee,
        district_fee: settings.district_fee,
      });
      setSocialLinks({
        facebook_link: settings.facebook_link || "",
        instagram_link: settings.instagram_link || "",
        twitter_link: settings.twitter_link || "",
        youtube_link: settings.youtube_link || "",
      });
      setContacts({
        contact_email: settings.contact_email || "upha2024@gmail.com",
        contact_mobile: settings.contact_mobile || "+91 75700 99990",
        contact_address: settings.contact_address || "K.D. Singh Babu Stadium, Lucknow\n(Branch: Chandpur, Varanasi)",
      });
      if (settings.payment_qr_code) {
        setQrPreview(settings.payment_qr_code);
      }
    }
  }, [settings]);

  if (loading) {
    return <div className="p-6 text-gray-500 animate-pulse">Loading settings...</div>;
  }

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFees((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContacts((prev) => ({ ...prev, [name]: value }));
  };

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    const formData = new FormData();
    formData.append("player_fee", fees.player_fee.toString());
    formData.append("referee_fee", fees.referee_fee.toString());
    formData.append("academy_fee", fees.academy_fee.toString());
    formData.append("district_fee", fees.district_fee.toString());

    formData.append("facebook_link", socialLinks.facebook_link);
    formData.append("instagram_link", socialLinks.instagram_link);
    formData.append("twitter_link", socialLinks.twitter_link);
    formData.append("youtube_link", socialLinks.youtube_link);

    formData.append("contact_email", contacts.contact_email);
    formData.append("contact_mobile", contacts.contact_mobile);
    formData.append("contact_address", contacts.contact_address);

    if (qrInputRef.current?.files?.[0]) {
      formData.append("payment_qr_code", qrInputRef.current.files[0]);
    }


    try {
      const res = await updateSystemSettings(formData);
      if (res.success) {
        setSubmitSuccess("System settings updated successfully.");
        await refreshSettings();
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to update settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="font-heading text-lg font-bold text-gray-900 uppercase">System Settings & Fees</h2>
        <p className="text-sm text-gray-500 mt-1">Configure global registration fees and the official UPI QR code.</p>
      </div>

      <div className="p-6">
        {submitError && <ErrorBanner message={submitError} className="mb-6" />}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 flex items-center gap-3 border border-green-200 rounded-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-sm font-medium">{submitSuccess}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 pb-2">
                Registration Fees (₹)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Player Fee</label>
                  <input
                    type="number"
                    name="player_fee"
                    value={fees.player_fee}
                    onChange={handleFeeChange}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referee Fee</label>
                  <input
                    type="number"
                    name="referee_fee"
                    value={fees.referee_fee}
                    onChange={handleFeeChange}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Academy Fee</label>
                  <input
                    type="number"
                    name="academy_fee"
                    value={fees.academy_fee}
                    onChange={handleFeeChange}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District Fee</label>
                  <input
                    type="number"
                    name="district_fee"
                    value={fees.district_fee}
                    onChange={handleFeeChange}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 pb-2">
                Payment QR Code
              </h3>
              
              <div className="flex gap-6 items-start">
                <div className="w-48 h-48 shrink-0 bg-gray-100 border-2 border-dashed border-gray-300 rounded-sm flex items-center justify-center overflow-hidden">
                  {qrPreview ? (
                    <img src={qrPreview} alt="QR Preview" className="w-full h-full object-contain" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={qrInputRef}
                    onChange={handleQrChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qrInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload QR Image
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended size: 500x500px.<br/>
                    Used across all registration pages.
                  </p>
                </div>
              </div>
            </div>



            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 pb-2">
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Facebook URL</label>
                  <input
                    type="url"
                    name="facebook_link"
                    value={socialLinks.facebook_link}
                    onChange={handleSocialChange}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instagram URL</label>
                  <input
                    type="url"
                    name="instagram_link"
                    value={socialLinks.instagram_link}
                    onChange={handleSocialChange}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Twitter / X URL</label>
                  <input
                    type="url"
                    name="twitter_link"
                    value={socialLinks.twitter_link}
                    onChange={handleSocialChange}
                    placeholder="https://twitter.com/..."
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">YouTube URL</label>
                  <input
                    type="url"
                    name="youtube_link"
                    value={socialLinks.youtube_link}
                    onChange={handleSocialChange}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase border-b border-gray-100 pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={contacts.contact_email}
                    onChange={handleContactChange}
                    placeholder="upha2024@gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    name="contact_mobile"
                    value={contacts.contact_mobile}
                    onChange={handleContactChange}
                    placeholder="+91 75700 99990"
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Address</label>
                  <textarea
                    name="contact_address"
                    value={contacts.contact_address}
                    onChange={handleContactChange}
                    placeholder="K.D. Singh Babu Stadium, Lucknow..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
