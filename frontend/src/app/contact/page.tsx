"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Globe,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { submitContactMessage } from "@/lib/api";
import { UP_DISTRICTS } from "@/lib/constants";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);
const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
);
const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const INQUIRY_CATEGORIES = [
  { value: "general", label: "General Inquiry / Information" },
  { value: "player_registration", label: "Player Registration & UID Verification" },
  { value: "coach_accreditation", label: "Coach Accreditation & License" },
  { value: "referee_officiating", label: "Referee / Match Official Exams" },
  { value: "district_affiliation", label: "District Association Affiliation & AGM" },
  { value: "academy_club", label: "Academy / Club Affiliation" },
  { value: "tournament_calendar", label: "Tournaments & Selection Trials" },
  { value: "grievance_helpdesk", label: "Grievance / Technical Helpdesk" },
];

const FAQS = [
  {
    q: "How can I check the approval status of my Player Registration?",
    a: "Once you submit your player registration with payment proof, the UPHA Secretariat verifies your documents. You can check the registered roster anytime under the public 'Database > Players' section or log in to your member dashboard.",
  },
  {
    q: "How does a new club or academy affiliate with UPHA?",
    a: "Registered sports academies in Uttar Pradesh can submit an affiliation application through the 'Register > Academy Affiliation' portal. After committee review and inspection, an official Certificate of Affiliation is issued.",
  },
  {
    q: "Who do I contact for district-level tournament permissions?",
    a: "All state-sanctioned tournaments must receive an official sanction letter from the UPHA General Secretary and Technical Committee. You can submit an inquiry selecting 'Tournaments & Selection Trials' or contact your local district unit.",
  },
  {
    q: "Can I visit the UPHA State Headquarters in person?",
    a: "Yes. The Secretariat at K.D. Singh Babu Stadium, Lucknow is open Monday through Saturday from 10:00 AM to 6:00 PM. For executive meetings, prior scheduling via phone or email is recommended.",
  },
];

export default function ContactPage() {
  const { settings, loading: settingsLoading } = useSettings();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    category: "general",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    reference_number?: string;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const contactPhone = settings?.contact_mobile || "+91 75700 99990";
  const contactEmail = settings?.contact_email || "upha2024@gmail.com";
  const contactAddress =
    settings?.contact_address ||
    "K.D. Singh Babu Stadium, Hazratganj, Lucknow, Uttar Pradesh 226001\n(Camp Office: Chandpur, Varanasi)";

  const cleanPhone = contactPhone.replace(/\s+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg("Please enter your message or query details.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        category: formData.category,
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      if (res && res.success) {
        setSuccessResult({
          reference_number: res.reference_number,
          message: res.message || "Your inquiry has been submitted successfully.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          district: "",
          category: "general",
          subject: "",
          message: "",
        });
      } else {
        setErrorMsg(res?.message || "Failed to submit inquiry. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to the server.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-[#fcfbf9] w-full">
      {/* ── 1. Hero Header Banner ── */}
      <section className="bg-[#111827] pt-20 pb-28 relative overflow-hidden text-white">
        {/* Subtle geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Ambient warm glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              HOME / CONTACT
            </span>
            <span className="text-gray-600">&bull;</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold tracking-widest uppercase text-gray-300">
              <ShieldCheck className="w-3 h-3 text-accent" />
              OFFICIAL SECRETARIAT
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight mb-6">
            GET IN <span className="text-accent">TOUCH</span>
          </h1>

          <p className="text-gray-300 font-serif italic text-lg sm:text-xl max-w-3xl leading-relaxed">
            Have questions regarding player registrations, referee accreditation, district affiliations,
            or state championship trials? Connect with the Uttar Pradesh Handball Association Secretariat.
          </p>
        </div>
      </section>

      {/* ── 2. Quick Contact Cards (4-Column Grid) ── */}
      <section className="max-w-7xl mx-auto px-6 -mt-14 relative z-20 w-full mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Head Secretariat */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-1">
                STATE HEADQUARTERS
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 uppercase mb-2">
                Lucknow Office
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                K.D. Singh Babu Stadium, Hazratganj, Lucknow, UP - 226001
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" /> Mon – Sat: 10AM - 6PM
              </span>
            </div>
          </div>

          {/* Card 2: Phone Helpline */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Phone className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase mb-1">
                TELEPHONE & WHATSAPP
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 uppercase mb-2">
                Direct Helpline
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Call our support desk for application queries &amp; urgent federation updates.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-accent font-mono tracking-wider transition-colors"
              >
                <span>{contactPhone}</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Card 3: Email Desk */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase mb-1">
                OFFICIAL SECRETARIAT
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 uppercase mb-2">
                Email Desk
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Send formal proposals, player verification requests, or official documentation.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-accent tracking-wide transition-colors truncate max-w-full"
              >
                <span className="truncate">{contactEmail}</span>
                <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
              </a>
            </div>
          </div>

          {/* Card 4: District Association Network */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-amber-600 uppercase mb-1">
                STATEWIDE NETWORK
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900 uppercase mb-2">
                75 District Units
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect directly with your local District Association President or Secretary.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link
                href="/districts"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-primary uppercase tracking-wider transition-colors"
              >
                <span>View All 75 Districts</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Main Content: Interactive Form & Office Info ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Inquiry Form (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                ONLINE HELPDESK
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-900">
                SEND AN OFFICIAL INQUIRY
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                Fill out the form below. Your query will be assigned to the relevant department
                (Registrations, Technical Committee, or General Secretariat).
              </p>
            </div>

            {/* Success Banner */}
            {successResult && (
              <div className="mb-8 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col gap-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="font-heading text-lg font-bold uppercase tracking-wide">
                    INQUIRY RECEIVED SUCCESSFULLY
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  {successResult.message}
                </p>
                {successResult.reference_number && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-emerald-300 text-xs font-mono font-bold text-emerald-900 w-fit">
                    <span>Reference Tracking ID:</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {successResult.reference_number}
                    </span>
                  </div>
                )}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setSuccessResult(null)}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMsg}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Full Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Mobile / WhatsApp No.
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Your District (UP)
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg px-4 py-3 text-sm text-gray-900 transition-colors outline-none"
                  >
                    <option value="">Select District (Optional)</option>
                    {UP_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Inquiry Topic / Category <span className="text-accent">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg px-4 py-3 text-sm text-gray-900 transition-colors outline-none"
                  >
                    {INQUIRY_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief subject of your query"
                    className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Message Details <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide complete details including player registration ID, championship name, or specific federation questions..."
                  className="w-full bg-gray-50 border border-gray-300 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent rounded-lg p-4 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none resize-y"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-md shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>SUBMITTING INQUIRY…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>TRANSMIT INQUIRY TO SECRETARIAT</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Office Locations, Timings & Map (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Headquarters Card */}
            <div className="bg-[#111827] text-white rounded-2xl p-7 shadow-md border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-accent">
                  STATE EXECUTIVE OFFICE
                </span>
                <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  UPHA HEADQUARTERS
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white mb-3">
                K.D. Singh Babu Stadium
              </h3>

              <div className="space-y-4 text-xs text-gray-300 leading-relaxed mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">
                    {contactAddress}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <a href={`tel:${cleanPhone}`} className="hover:text-accent font-mono">
                    {contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-accent">
                    {contactEmail}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-4 border-t border-gray-800">
                <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  SECRETARIAT TIMINGS
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Monday – Saturday:</span>
                    <p className="font-bold text-white">10:00 AM – 6:00 PM</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Sunday:</span>
                    <p className="font-bold text-amber-400">Closed (Open for Trials)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
                <span className="font-heading font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  LUCKNOW STADIUM LOCATION
                </span>
                <a
                  href="https://maps.google.com/?q=K.D.+Singh+Babu+Stadium+Hazratganj+Lucknow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-64 w-full bg-gray-100 relative">
                <iframe title="UPHA Headquarters Location Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2629.602963485073!2d80.93615741925963!3d26.855349839310406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfda16d3bbd4b%3A0x84ee3e6b3a4c42ed!2sKD%20Singh%20Babu%20Stadium!5e0!3m2!1sen!2sin!4v1790742623409!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[20%]" />
              </div>
            </div>

            {/* Social Channels Strip */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
                FEDERATION CHANNELS
              </div>
              <h4 className="font-heading text-base font-bold uppercase text-gray-900 mb-4">
                FOLLOW UPHA OFFICIAL MEDIA
              </h4>
              <div className="flex items-center gap-3">
                {settings?.facebook_link && (
                  <a
                    href={settings.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-[#1877F2] hover:text-white text-gray-700 flex items-center justify-center transition-colors"
                    aria-label="UPHA Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings?.instagram_link && (
                  <a
                    href={settings.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white text-gray-700 flex items-center justify-center transition-all"
                    aria-label="UPHA Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings?.youtube_link && (
                  <a
                    href={settings.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-[#FF0000] hover:text-white text-gray-700 flex items-center justify-center transition-colors"
                    aria-label="UPHA YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {settings?.twitter_link && (
                  <a
                    href={settings.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-gray-700 flex items-center justify-center transition-colors"
                    aria-label="UPHA Twitter / X"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                <a
                  href={`mailto:${contactEmail}`}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-accent hover:text-white text-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Email UPHA"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Frequently Asked Questions (Accordion) ── */}
      <section className="bg-gray-100/60 border-t border-gray-200 py-16 w-full">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-gray-900">
              QUICK ANSWERS &amp; ASSISTANCE
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Common questions answered by the UPHA Secretariat.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base uppercase tracking-wide text-gray-900 hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Bottom Affiliation Banner ── */}
      <section className="bg-[#111827] text-white py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-1">
              DISTRICT SECRETARIAT HELPLINE
            </div>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-white">
              NEED LOCAL DISTRICT COORDINATION?
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Access official contact details, registered office addresses, and verified office bearers
              for all 75 affiliated district units in Uttar Pradesh.
            </p>
          </div>
          <Link
            href="/districts"
            className="px-6 py-3.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>EXPLORE 75 DISTRICTS DIRECTORY</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
