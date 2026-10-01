"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, Check, X, Search } from "lucide-react";
import { UP_DISTRICTS } from "@/lib/constants";

export interface DistrictComboboxProps {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  id?: string;
  className?: string;
}

export default function DistrictCombobox({
  value,
  onChange,
  required = false,
  placeholder = "Select or search district (e.g. Varanasi, Lucknow...)",
  disabled = false,
  label = "District (Uttar Pradesh - 75 Districts)",
  error,
  id = "district-combobox",
  className = "",
}: DistrictComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize internal query state with parent value if value changes externally
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If query was typed but doesn't match, restore parent value
        if (query.trim() && query.trim() !== value) {
          const exactMatch = UP_DISTRICTS.find(
            (d) => d.toLowerCase() === query.trim().toLowerCase()
          );
          if (exactMatch) {
            onChange(exactMatch);
            setQuery(exactMatch);
          } else {
            setQuery(value || "");
          }
        } else if (!query.trim() && value) {
          setQuery(value);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, value, onChange]);

  // Filter districts based on query:
  // Prefix matches come first, followed by substring matches
  const trimmed = query.trim().toLowerCase();
  const filteredDistricts = trimmed
    ? UP_DISTRICTS.filter((d) => d.toLowerCase().includes(trimmed)).sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(trimmed);
        const bStarts = b.toLowerCase().startsWith(trimmed);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
    : UP_DISTRICTS;

  const handleSelectDistrict = (district: string) => {
    onChange(district);
    setQuery(district);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    // If typed value exactly matches a district, trigger onChange
    const exact = UP_DISTRICTS.find((d) => d.toLowerCase() === val.trim().toLowerCase());
    if (exact) {
      onChange(exact);
    } else {
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      if (filteredDistricts.length > 0 && isOpen) {
        e.preventDefault();
        handleSelectDistrict(filteredDistricts[0]);
      }
    } else if (e.key === "ArrowDown" && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[10px] font-medium text-gray-400">
            75 UP Districts
          </span>
        </div>
      )}

      {/* Input container */}
      <div
        className={`relative flex items-center bg-white border rounded transition-all shadow-xs ${
          error
            ? "border-red-400 ring-1 ring-red-300"
            : isOpen
            ? "border-[#d97c55] ring-2 ring-[#d97c55]/20"
            : "border-gray-200 hover:border-gray-300"
        } ${disabled ? "opacity-60 bg-gray-100 cursor-not-allowed" : ""}`}
      >
        <div className="pl-3 pr-2 text-gray-400 shrink-0 pointer-events-none">
          <MapPin className="w-4 h-4 text-[#d97c55]" />
        </div>

        <input
          id={id}
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full py-2.5 bg-transparent text-xs text-gray-800 font-medium placeholder-gray-400 focus:outline-none"
        />

        <div className="flex items-center pr-2.5 gap-1 shrink-0">
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 text-gray-400 hover:text-[#d97c55] transition-colors"
            title="Toggle district list"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#d97c55]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}

      {/* Dropdown list */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Dropdown status header */}
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Search className="w-3 h-3 text-[#d97c55]" />
              <span>
                {trimmed ? `Filtered: ${filteredDistricts.length} found` : "All 75 Districts"}
              </span>
            </span>
            <span className="text-[9px] text-[#d97c55] font-bold">Uttar Pradesh</span>
          </div>

          {/* District items */}
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
            {filteredDistricts.length > 0 ? (
              filteredDistricts.map((district) => {
                const isSelected = value.toLowerCase() === district.toLowerCase();
                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleSelectDistrict(district)}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#d97c55]/10 text-[#d97c55] font-bold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-[#d97c55]" : "bg-gray-300"
                        }`}
                      />
                      <span>{district}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#d97c55] shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                <p className="font-semibold text-gray-600 mb-1">Koi district nahi mila</p>
                <p className="text-[11px]">"{query}" UP ke 75 districts me match nahi hua.</p>
              </div>
            )}
          </div>

          {/* Quick footer helper */}
          <div className="bg-gray-50/70 px-3 py-1.5 border-t border-gray-100 text-[10px] text-gray-400 text-center">
            Click district to select or press Enter
          </div>
        </div>
      )}
    </div>
  );
}
