"use client";

import CoachDashboardHeader from "./CoachDashboardHeader";
import CoachingRecord from "./CoachingRecord";
import CoachIdCard from "./CoachIdCard";
import CoachProfileStatus from "./CoachProfileStatus";
import CoachProfileSummary from "./CoachProfileSummary";
import PlayersRoster from "./PlayersRoster";
import CoachEvents from "./CoachEvents";
import CoachNotices from "./CoachNotices";
import MyCertificates from "@/components/MyCertificates";
import { useAuth } from "@/context/AuthContext";

export default function CoachDashboardPage() {
  const { meData } = useAuth();
  const isApproved = meData && 'paid' in meData ? meData.paid : false;

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Main Stats */}
        <CoachDashboardHeader />
        
        {/* Tournament Banner */}
        {isApproved && <CoachingRecord />}
        
        {/* ID Card & Profile Status */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {isApproved && (
            <div className="w-full lg:w-7/12">
              <CoachIdCard />
            </div>
          )}
          <div className={isApproved ? "w-full lg:w-5/12" : "w-full"}>
            <CoachProfileStatus />
          </div>
        </div>
        
        {/* Certificates */}
        {isApproved && (
          <div className="mb-6">
            <MyCertificates />
          </div>
        )}
        
        {/* Profile Summary */}
        <div className="mb-6">
          <CoachProfileSummary />
        </div>

        {/* Players Roster */}
        {isApproved && (
          <div className="mb-6">
            <PlayersRoster />
          </div>
        )}
        
        {/* Events & Announcements */}
        {isApproved && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-7/12">
              <CoachEvents />
            </div>
            <div className="w-full lg:w-5/12">
              <CoachNotices />
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}
