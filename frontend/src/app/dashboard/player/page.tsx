"use client";

import DashboardHeader from "./DashboardHeader";
import TournamentRecord from "./TournamentRecord";
import DigitalIdCard from "./DigitalIdCard";
import ProfileStatus from "./ProfileStatus";
import ProfileSummary from "./ProfileSummary";
import DashboardEvents from "./DashboardEvents";
import DashboardNotices from "./DashboardNotices";
import MyCertificates from "@/components/MyCertificates";
import { useAuth } from "@/context/AuthContext";

export default function PlayerDashboardPage() {
  const { meData, loading } = useAuth();
  
  // If not loaded yet, we can just render the skeleton implicitly 
  // via the components themselves, or we can just let them handle it.
  // Actually, we can check `meData?.paid`
  const isApproved = meData && 'paid' in meData ? meData.paid : false;

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Main Stats */}
        <DashboardHeader />
        
        {/* Tournament Banner - Only show if approved */}
        {isApproved && <TournamentRecord />}
        
        {/* ID Card & Profile Status */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {isApproved && (
            <div className="w-full lg:w-7/12">
              <DigitalIdCard />
            </div>
          )}
          <div className={isApproved ? "w-full lg:w-5/12" : "w-full"}>
            <ProfileStatus />
          </div>
        </div>
        
        {/* Certificates - Only show if approved */}
        {isApproved && (
          <div className="mb-6">
            <MyCertificates />
          </div>
        )}
        
        {/* Profile Summary - Always visible so they know what they submitted */}
        <div className="mb-6">
          <ProfileSummary />
        </div>
        
        {/* Events & Announcements - Only show if approved */}
        {isApproved && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-7/12">
              <DashboardEvents />
            </div>
            <div className="w-full lg:w-5/12">
              <DashboardNotices />
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}
