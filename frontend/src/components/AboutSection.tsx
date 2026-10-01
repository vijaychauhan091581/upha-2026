"use client";

import Link from "next/link";
import { Building, MapPin, Calendar, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function AboutSection() {
  const { settings } = useSettings();

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center">
        
        {/* Left Side: Editorial Content */}
        <div className="w-full lg:w-1/2">
          {/* Section Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-accent inline-block"></span>
            <div className="text-accent text-xs font-bold tracking-widest uppercase">
              ABOUT US - UPHA
            </div>
          </div>
          
          {/* Main Headline */}
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-gray-900 leading-[1.05] mb-8">
            FIVE DECADES OF <span className="text-accent">INDIAN HANDBALL.</span>
          </h2>
          
          {/* Lead Paragraph */}
          <p className="text-gray-900 text-xl sm:text-2xl font-semibold leading-relaxed mb-6 border-l-4 border-accent pl-5 py-1">
            The Uttar Pradesh Handball Association is the recognised state body for the sport — the bridge between local talent and the national stage.
          </p>
          
          {/* Body Paragraph */}
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 font-normal">
            From the courts of Lucknow&apos;s K.D. Singh Babu Stadium to inter-zonal tournaments across India, UPHA&apos;s mandate is plainspoken: develop players, certify coaches and referees, host competitions, and represent Uttar Pradesh wherever the game is played. Our work spans 75 affiliated districts, thousands of registered athletes, and a growing roster of tournaments that feed directly into the national pipeline.
          </p>
          
          {/* Action Link */}
          <Link 
            href="/about" 
            className="group inline-flex items-center gap-3 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest border-b-2 border-primary pb-1.5 hover:text-accent hover:border-accent transition-colors"
          >
            <span>READ OUR FULL HISTORY</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Right Side - Federation Profile Charter Card */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            
            {/* Card Header */}
            <div className="bg-[#111927] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <h3 className="font-heading text-base sm:text-lg tracking-widest uppercase font-bold text-white">
                  ASSOCIATION PROFILE
                </h3>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-white/10 text-accent border border-accent/20">
                OFFICIAL CHARTER
              </span>
            </div>
            
            {/* Card Content Rows */}
            <div className="divide-y divide-gray-100 bg-[#fdfdfc]">
              
              {/* Established */}
              <div className="flex flex-col sm:flex-row sm:items-center p-5 hover:bg-white transition-colors">
                <div className="sm:w-1/3 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 sm:mb-0">
                  <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                  ESTABLISHED
                </div>
                <div className="sm:w-2/3 font-heading text-lg font-bold text-gray-900">
                  1972
                </div>
              </div>
              
              {/* Address */}
              <div className="flex flex-col sm:flex-row p-5 hover:bg-white transition-colors">
                <div className="sm:w-1/3 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 sm:mb-0">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  ADDRESS
                </div>
                <div className="sm:w-2/3 font-medium text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {settings?.contact_address || "K.D. Singh Babu Stadium, Lucknow\n(Branch: Chandpur, Varanasi)"}
                </div>
              </div>
              
              {/* Jurisdiction */}
              <div className="flex flex-col sm:flex-row p-5 hover:bg-white transition-colors">
                <div className="sm:w-1/3 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 sm:mb-0">
                  <Building className="w-3.5 h-3.5 text-accent shrink-0" />
                  JURISDICTION
                </div>
                <div className="sm:w-2/3 font-medium text-sm text-gray-800 leading-relaxed">
                  State of Uttar Pradesh -- Affiliated to Sports Directorate, Govt of Uttar Pradesh
                </div>
              </div>
              
              {/* Recognized By */}
              <div className="flex flex-col sm:flex-row sm:items-center p-5 hover:bg-white transition-colors">
                <div className="sm:w-1/3 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 sm:mb-0">
                  <Award className="w-3.5 h-3.5 text-accent shrink-0" />
                  RECOGNISED BY
                </div>
                <div className="sm:w-2/3 font-bold text-sm text-gray-900">
                  Handball Association India
                </div>
              </div>
              
              {/* Affiliated To */}
              <div className="flex flex-col sm:flex-row sm:items-center p-5 hover:bg-white transition-colors">
                <div className="sm:w-1/3 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 sm:mb-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                  AFFILIATED TO
                </div>
                <div className="sm:w-2/3 font-bold text-sm text-gray-900">
                  UP Olympic Association
                </div>
              </div>

            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}
