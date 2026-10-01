import { User, BookOpen, PlayCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DistrictData } from "@/lib/api";

export default function GetInvolvedSection({ district }: { district: DistrictData }) {
  return (
    <div className="mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-12">
        <h2 className="font-heading text-4xl font-bold uppercase tracking-wide">
          GET <span className="text-accent">INVOLVED</span>
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          REGISTER THROUGH {district.district} HANDBALL ASSOCIATION
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="w-12 h-12 bg-orange-50 text-accent rounded-sm flex items-center justify-center mb-6">
            <User className="w-5 h-5" />
          </div>
          <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">01 / PLAYER</div>
          <h3 className="font-heading text-xl font-bold uppercase text-primary mb-3">REGISTER AS A PLAYER</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-8 flex-1">
            Affiliate yourself as a handball player under the {district.district} district unit. Annual fee ₹ 111.
          </p>
          <div className="border-t border-dashed border-gray-200 pt-4 mt-auto">
            <Link href={`/register/player?district=${encodeURIComponent(district.district)}`} className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors">
              BEGIN PLAYER REGISTRATION &nearr;
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="w-12 h-12 bg-orange-50 text-accent rounded-sm flex items-center justify-center mb-6">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">02 / ACADEMY</div>
          <h3 className="font-heading text-xl font-bold uppercase text-primary mb-3">AFFILIATE AN ACADEMY</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-8 flex-1">
            Register your sports training academy or club under UPHA to receive official recognition and tournament participation.
          </p>
          <div className="border-t border-dashed border-gray-200 pt-4 mt-auto">
            <Link href={`/register/academy?district=${encodeURIComponent(district.district)}`} className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors">
              BEGIN ACADEMY AFFILIATION &nearr;
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="w-12 h-12 bg-orange-50 text-accent rounded-sm flex items-center justify-center mb-6">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">03 / REFEREE</div>
          <h3 className="font-heading text-xl font-bold uppercase text-primary mb-3">REGISTER AS A REFEREE</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-8 flex-1">
            Apply for refereeing accreditation. Eligibility based on prior officiating experience.
          </p>
          <div className="border-t border-dashed border-gray-200 pt-4 mt-auto">
            <Link href={`/register/referee?district=${encodeURIComponent(district.district)}`} className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors">
              BEGIN REFEREE ACCREDITATION &nearr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
