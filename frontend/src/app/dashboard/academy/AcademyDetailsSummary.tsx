"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AcademyData } from "@/lib/api";

export default function AcademyDetailsSummary() {
  const { meData, loading } = useAuth();
  const academy = meData as AcademyData | null;

  if (loading) return <div className="animate-pulse bg-gray-100 rounded-sm h-40"></div>;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">

      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">ACADEMY DETAILS</h3>
        <button className="text-[9px] font-bold tracking-widest text-accent uppercase hover:text-primary transition-colors">
          EDIT PROFILE
        </button>
      </div>

      {/* Director / Office Bearer */}
      <div className="border-b border-gray-100">
        <div className="px-6 md:px-8 pt-4 pb-2">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase">OFFICE BEARER</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">DIRECTOR (ADHYAKSHA)</div>
            <div className="text-sm font-semibold text-gray-800">{academy?.director?.name || "—"}</div>
            {academy?.director?.email && (
              <div className="text-xs text-gray-400 truncate mt-0.5">{academy.director.email}</div>
            )}
            {academy?.director?.phone_number && (
              <div className="text-xs text-gray-400 mt-0.5">{academy.director.phone_number}</div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">ACADEMY TYPE</div>
            <div className="text-sm font-medium text-gray-800">{academy?.academy_type || "—"}</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">DISCIPLINE FOCUS</div>
            <div className="text-sm font-medium text-gray-800">{academy?.discipline_focus || "—"}</div>
          </div>
        </div>
      </div>

      {/* Academy Info */}
      <div className="border-b border-gray-100">
        <div className="px-6 md:px-8 pt-4 pb-2">
          <div className="text-[9px] font-bold tracking-widest text-accent uppercase">ACADEMY INFORMATION</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">ACADEMY NAME</div>
            <div className="text-sm font-medium text-gray-800">{academy?.name || "—"}</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">DISTRICT</div>
            <div className="text-sm font-medium text-gray-800">{academy?.district || "—"}</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">FOUNDED</div>
            <div className="text-sm font-medium text-gray-800">{academy?.year_of_establishment || "—"}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">EMAIL</div>
            <div className="text-sm font-medium text-gray-800 truncate">{academy?.email || "—"}</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">PHONE</div>
            <div className="text-sm font-medium text-gray-800">{academy?.office_phone_number || "—"}</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">WEBSITE</div>
            <div className="text-sm font-medium text-gray-800 truncate">
              {academy?.website ? (
                <a href={academy.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {academy.website.replace(/^https?:\/\//, "")}
                </a>
              ) : "—"}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
          <div className="p-6 md:p-8 md:col-span-2">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">OFFICE ADDRESS</div>
            <div className="text-sm font-medium text-gray-800">{academy?.office_address || "—"}</div>
            {academy?.pin_code && (
              <div className="text-xs text-gray-400 mt-0.5">Pin: {academy.pin_code}</div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">TRAINING VENUE</div>
            <div className="text-sm font-medium text-gray-800">{academy?.training_venue || "—"}</div>
          </div>
        </div>
        {academy?.categories_trained && (
          <div className="p-6 md:p-8 border-t border-gray-100">
            <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">CATEGORIES TRAINED</div>
            <div className="text-sm font-medium text-gray-800">{academy.categories_trained}</div>
          </div>
        )}
      </div>

      {/* Coach Details */}
      {academy?.coach_name && (
        <div>
          <div className="px-6 md:px-8 pt-4 pb-2">
            <div className="text-[9px] font-bold tracking-widest text-accent uppercase">COACH DETAILS</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6 md:p-8">
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">COACH NAME</div>
              <div className="text-sm font-medium text-gray-800">{academy.coach_name}</div>
              {academy.coach_email && (
                <div className="text-xs text-gray-400 truncate mt-0.5">{academy.coach_email}</div>
              )}
            </div>
            <div className="p-6 md:p-8">
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">COACH MOBILE</div>
              <div className="text-sm font-medium text-gray-800">{academy.coach_mobile || "—"}</div>
            </div>
            <div className="p-6 md:p-8">
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">EXPERIENCE / GRADE</div>
              <div className="text-sm font-medium text-gray-800">
                {academy.coach_experience ? `${academy.coach_experience} Yrs` : "—"}
                {academy.coach_grade ? ` · ${academy.coach_grade}` : ""}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
