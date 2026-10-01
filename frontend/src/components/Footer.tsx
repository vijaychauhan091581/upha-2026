"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

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

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Hide footer on admin panel
  if (pathname?.startsWith("/dashboard/admin") || pathname?.startsWith("/admin")) {
    return null;
  }

  const address = settings?.contact_address || "K.D. Singh Babu Stadium, Lucknow\n(Branch: Chandpur, Varanasi)";

  return (
    <footer id="contact" className="bg-primary text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-[72px] h-[72px] bg-white rounded-full overflow-hidden shrink-0">
                <Image
                  src="/upha.png"
                  alt="UPHA Logo"
                  width={72}
                  height={72}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-white font-heading text-xl font-bold tracking-wide">UPHA</h4>
                <div className="text-[10px] tracking-widest uppercase">EST. 1972</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              The Uttar Pradesh Handball Association is the recognized governing body for handball across Uttar Pradesh — affiliated with the Handball Association India and the UP Olympic Association.
            </p>
            <div className="flex gap-4">
              {settings?.facebook_link && (
                <Link href={settings.facebook_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Facebook className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings?.instagram_link && (
                <Link href={settings.instagram_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Instagram className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings?.youtube_link && (
                <Link href={settings.youtube_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Youtube className="w-4 h-4 text-white" />
                </Link>
              )}
              {settings?.twitter_link && (
                <Link href={settings.twitter_link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Twitter className="w-4 h-4 text-white" />
                </Link>
              )}
            </div>
          </div>

          {/* Federation Links */}
          <div>
            <h4 className="text-white font-heading text-lg font-bold tracking-widest uppercase mb-6">ASSOCIATION</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#about" className="hover:text-accent transition-colors">About UPHA</Link></li>
              <li><Link href="/council" className="hover:text-accent transition-colors">Office Bearers</Link></li>
              <li><Link href="/districts" className="hover:text-accent transition-colors">Affiliated Districts</Link></li>
              <li><Link href="/constitution" className="hover:text-accent transition-colors">Constitution</Link></li>
              <li><Link href="/announcements" className="hover:text-accent transition-colors">Announcements</Link></li>
            </ul>
          </div>

          {/* Participate Links */}
          <div>
            <h4 className="text-white font-heading text-lg font-bold tracking-widest uppercase mb-6">PARTICIPATE</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/register/player" className="hover:text-accent transition-colors">Register as Player</Link></li>
              <li><Link href="/register/referee" className="hover:text-accent transition-colors">Referee Accreditation</Link></li>
              <li><Link href="/register/academy" className="hover:text-accent transition-colors">Academy Affiliation</Link></li>
              <li><Link href="/calendar" className="hover:text-accent transition-colors">Tournament Calendar</Link></li>
              <li><Link href="/results" className="hover:text-accent transition-colors">Event Results</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-heading text-lg font-bold tracking-widest uppercase mb-6">GET IN TOUCH</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span className="whitespace-pre-line">{address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>{settings?.contact_mobile || "+91 75700 99990"}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href={`mailto:${settings?.contact_email || "upha2024@gmail.com"}`} className="hover:text-accent transition-colors">
                  {settings?.contact_email || "upha2024@gmail.com"}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-accent hover:text-white transition-colors"
                >
                  <span>Contact Secretariat &amp; Helpdesk &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2026 Uttar Pradesh Handball Association. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Affiliated with Handball Association India · UP Olympic Association</span>
            <span className="text-gray-600">|</span>
            <Link href="/admin/login" className="text-gray-500 hover:text-accent transition-colors text-[11px] font-mono tracking-wider">
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
