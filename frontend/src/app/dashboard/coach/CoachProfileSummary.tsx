"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CoachData } from "@/lib/api";

export default function CoachProfileSummary() {
  const { authUser, meData, loading } = useAuth();
  const coach = meData as CoachData | null;

  if (loading) {
    return <div className="bg-white border border-gray-200 shadow-sm rounded-sm h-40 animate-pulse" />;
  }

  const dob = authUser?.date_of_birth
    ? new Date(authUser.date_of_birth).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const fields = [
    ["FULL NAME", authUser?.name || "—"],
    ["DATE OF BIRTH", dob],
    ["GENDER", authUser?.gender || "—"],
    ["DISTRICT", coach?.district || "—"],
    ["OCCUPATION", coach?.occupation?.replace("_", " ") || "—"],
    ["COACHING GRADE", coach?.highest_coaching_grade || "—"],
    ["MOBILE", authUser?.phone_number ? `+91 ${authUser.phone_number}` : "—"],
    ["EMAIL", authUser?.email || "—"],
    ["TRANSACTION ID", coach?.transaction_id || "—"],
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
      <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100">
        <h3 className="font-heading text-xl font-bold uppercase text-primary">PROFILE SUMMARY</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {fields.map(([label, value]) => (
          <div key={label} className="p-6 md:p-8 border-b border-gray-100 last:border-b-0">
            <div className="text-[9px] font-bold tracking-widest text-accent uppercase mb-2">{label}</div>
            <div className="text-sm font-medium text-gray-800 capitalize">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
