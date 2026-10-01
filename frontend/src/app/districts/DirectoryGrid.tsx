"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DistrictData } from "@/lib/api";

function DistrictLogo({ src, name }: { src: string | null; name: string }) {
  const [imageError, setImageError] = useState(false);
  const initials = (name || "UP")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (src && !imageError) {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2.5 overflow-hidden group-hover:border-accent/40 group-hover:shadow-md transition-all duration-300 relative">
        <img
          src={src}
          alt={`${name} Logo`}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151] text-white flex items-center justify-center shadow-sm border border-gray-700/30 group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
      <span className="font-heading font-bold text-2xl tracking-widest text-white/90">
        {initials}
      </span>
    </div>
  );
}

export default function DirectoryGrid({ districts }: { districts: DistrictData[] }) {
  if (districts.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-gray-200 rounded-xl shadow-sm">
        <p className="text-gray-500 font-medium">No affiliated district units found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {districts.map((row) => (
        <Link
          key={row.id}
          href={`/districts/${row.id}`}
          className="group bg-white border border-gray-200 hover:border-accent/60 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer hover:-translate-y-1"
          title={`Click to view full details of ${row.district}`}
        >
          {/* District Logo */}
          <div className="mb-4 flex items-center justify-center">
            <DistrictLogo src={row.logo} name={row.district || row.name} />
          </div>

          {/* District Name */}
          <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-wider text-[#111827] group-hover:text-accent transition-colors line-clamp-2">
            {row.district}
          </h3>
        </Link>
      ))}
    </div>
  );
}
