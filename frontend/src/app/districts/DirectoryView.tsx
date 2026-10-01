"use client";

import React, { useState, useEffect, useMemo } from "react";
import DirectoryControls from "./DirectoryControls";
import DirectoryGrid from "./DirectoryGrid";
import { listDistricts, DistrictData } from "@/lib/api";

export default function DirectoryView() {
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDistricts()
      .then((res) => {
        if (res?.success && Array.isArray(res.districts)) {
          setDistricts(res.districts);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    const q = searchQuery.toLowerCase().trim();
    return districts.filter(
      (d) =>
        (d.district && d.district.toLowerCase().includes(q)) ||
        (d.name && d.name.toLowerCase().includes(q))
    );
  }, [districts, searchQuery]);

  return (
    <>
      <div className="mt-8 mb-12">
        <DirectoryControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-8">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-primary">
            AFFILIATED DISTRICT UNITS
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Click on any district unit logo to view full association details and office bearers.
          </p>
        </div>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-2 md:mt-0">
          SHOWING <span className="text-accent font-bold">{loading ? "..." : filteredDistricts.length}</span> OF{" "}
          <span className="text-gray-800">{loading ? "..." : districts.length}</span> DISTRICT UNITS
        </div>
      </div>

      <div className="mb-20">
        {loading ? (
          <div className="py-20 text-center text-gray-500 italic animate-pulse">
            Loading district units...
          </div>
        ) : (
          <DirectoryGrid districts={filteredDistricts} />
        )}
      </div>
    </>
  );
}
