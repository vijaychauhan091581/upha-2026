"use client";

import { Search } from "lucide-react";

interface DirectoryControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion?: string;
  onRegionChange?: (region: string) => void;
}

export default function DirectoryControls({
  searchQuery,
  onSearchChange,
  selectedRegion = "",
  onRegionChange,
}: DirectoryControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-28">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search district unit by name or district..." 
          className="w-full bg-white border border-gray-200 shadow-sm rounded-lg pl-12 pr-6 py-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-gray-800 placeholder:text-gray-400"
        />
      </div>
      
      {/* Region Filter */}
      {onRegionChange && (
        <div className="flex gap-4">
          <select 
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-white border border-gray-200 shadow-sm rounded-lg px-6 py-3.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-gray-700 min-w-[170px]"
          >
            <option value="">All Regions</option>
            <option value="western">Western UP</option>
            <option value="eastern">Eastern UP</option>
            <option value="central">Central UP</option>
            <option value="bundelkhand">Bundelkhand</option>
          </select>
        </div>
      )}
    </div>
  );
}
