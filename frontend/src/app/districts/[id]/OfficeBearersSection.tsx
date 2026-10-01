import React from "react";
import { Phone, Mail } from "lucide-react";
import { DistrictData, UserData } from "@/lib/api";

export default function OfficeBearersSection({ district }: { district: DistrictData }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const renderCard = (
    user: UserData | null,
    positionTitle: string,
    englishTitle: string,
    index: string,
    color: string
  ) => {
    if (!user) {
      return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-8 pt-10 flex flex-col items-center justify-center h-full min-h-[340px]">
          <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
            POSITION {index} / 03
          </div>
          <h3 className="font-heading text-xl font-bold uppercase text-gray-400 mb-3 text-center">
            {englishTitle}
          </h3>
          <p className="text-sm italic text-gray-400">&mdash; Vacant &mdash;</p>
        </div>
      );
    }

    const phone = user.phone_number || user.mobile;
    const email = user.email;

    return (
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 relative flex flex-col">
        {/* Avatar / Photo Header */}
        <div className="h-64 bg-[#1e293b] flex items-center justify-center relative rounded-t-sm m-2 overflow-hidden">
          {user.passport_image ? (
            <img
              src={user.passport_image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-heading text-7xl font-bold text-white tracking-wider">
              {getInitials(user.name)}
            </span>
          )}
          <div className="absolute top-4 left-4 w-3 h-3 border border-white/20"></div>
          <div className="absolute top-4 right-4 w-3 h-3 border border-white/20"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 border border-white/20"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border border-white/20"></div>
          {!user.passport_image && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 to-transparent"></div>
          )}
        </div>

        {/* Position Badge */}
        <div className="absolute top-[256px] left-8 transform -translate-y-1/2 z-10">
          <div
            className={`${color} text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-sm border ${
              color.includes("d97c55") ? "border-[#c16744]" : "border-black"
            }`}
          >
            {positionTitle}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-8 pt-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
              POSITION {index} / 03
            </div>

            {/* Name */}
            <h3 className="font-heading text-xl font-bold uppercase text-primary mb-1">
              {user.name}
            </h3>

            {/* Unit Subtitle */}
            <p className="text-[9px] font-bold tracking-widest text-accent uppercase mb-5">
              {district.district} HANDBALL ASSN.
            </p>
          </div>

          {/* Contact Details (Mobile No. & Email) */}
          <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
            {/* Mobile No. */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">
                  MOBILE NO.
                </span>
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="text-xs font-semibold text-gray-800 hover:text-accent transition-colors truncate"
                    title={`Call ${phone}`}
                  >
                    {phone}
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">Not available</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">
                  EMAIL
                </span>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-semibold text-gray-800 hover:text-accent transition-colors truncate"
                    title={`Email ${email}`}
                  >
                    {email}
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">Not available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const positionsCount = [
    district.adhyaksha,
    district.sachiv,
    district.koshadhyaksha,
  ].filter(Boolean).length;

  return (
    <div className="mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-12">
        <h2 className="font-heading text-4xl font-bold uppercase tracking-wide">
          OFFICE <span className="text-accent">BEARERS</span>
        </h2>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          {positionsCount} POSITIONS &middot; CURRENTLY ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {renderCard(
          district.adhyaksha,
          "PRESIDENT - ADHYAKSH",
          "President",
          "01",
          "bg-[#d97c55]"
        )}
        {renderCard(
          district.sachiv,
          "SECRETARY - SACHIV",
          "Secretary",
          "02",
          "bg-[#111827]"
        )}
        {renderCard(
          district.koshadhyaksha,
          "TREASURER - KOSHADHYAKSH",
          "Treasurer",
          "03",
          "bg-[#d97c55]"
        )}
      </div>
    </div>
  );
}
