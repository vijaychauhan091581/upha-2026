"use client";

import { Check, Plus } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { CoachData } from "@/lib/api";

export default function CoachProfileStatus() {
  const { authUser, meData, loading } = useAuth();
  const coach = meData as CoachData | null;

  if (loading) return <div className="animate-pulse bg-gray-100 rounded-sm h-72"></div>;

  let completedTasks = 1; // Personal details always count as done
  let totalTasks = 4;
  
  if (authUser?.adhar_image) completedTasks++;
  if (coach?.paid) completedTasks++;
  if (coach?.transaction_image) completedTasks++;

  const percentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 h-full flex flex-col">
      
      <div className="mb-6">
        <h3 className="font-heading text-xl font-bold uppercase text-primary mb-1">COACHING SUMMARY</h3>
        <p className="text-xs text-gray-500">A snapshot of this season&apos;s coaching activity.</p>
      </div>

      {/* Circular Progress & Text */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d97c55" strokeWidth="3" strokeDasharray={`${percentage}, 100`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-lg font-bold text-primary">{percentage}%</span>
          </div>
        </div>
        <div>
          <div className="font-bold text-sm text-gray-800 mb-1">Profile completeness</div>
          <div className="text-xs text-gray-500">Add documentation to reach 100%</div>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 flex flex-col gap-4">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-600">Personal details</span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase">DONE</span>
        </div>
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            {authUser?.adhar_image ? (
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Plus className="w-3 h-3 text-accent" />
              </div>
            )}
            <span className={`text-sm ${authUser?.adhar_image ? "text-gray-600" : "font-medium text-gray-800"}`}>Aadhar verified</span>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${authUser?.adhar_image ? "text-emerald-600" : "text-accent"} uppercase`}>
            {authUser?.adhar_image ? "DONE" : "PENDING"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            {coach?.paid ? (
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Plus className="w-3 h-3 text-accent" />
              </div>
            )}
            <span className={`text-sm ${coach?.paid ? "text-gray-600" : "font-medium text-gray-800"}`}>Annual fee paid</span>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${coach?.paid ? "text-emerald-600" : "text-accent"} uppercase`}>
            {coach?.paid ? "DONE" : "PENDING"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {coach?.transaction_image ? (
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Plus className="w-3 h-3 text-accent" />
              </div>
            )}
            <span className={`text-sm ${coach?.transaction_image ? "text-gray-600" : "font-medium text-gray-800"}`}>Transaction receipt</span>
          </div>
          <span className={`text-[9px] font-bold tracking-widest ${coach?.transaction_image ? "text-emerald-600" : "text-accent"} uppercase`}>
            {coach?.transaction_image ? "DONE" : "PENDING"}
          </span>
        </div>
        
      </div>
    </div>
  );
}
