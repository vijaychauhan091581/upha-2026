"use client";

import RefereeDashboardHeader from "./RefereeDashboardHeader";
import OfficiatingRecord from "./OfficiatingRecord";
import RefereeIdCard from "./RefereeIdCard";
import RefereeProfileStatus from "./RefereeProfileStatus";
import RefereeProfileSummary from "./RefereeProfileSummary";
import UpcomingAssignments from "./UpcomingAssignments";
import RecentHistory from "./RecentHistory";
import RefereeNotices from "./RefereeNotices";
import MyCertificates from "@/components/MyCertificates";
import { useAuth } from "@/context/AuthContext";

export default function RefereeDashboardPage() {
  const { meData } = useAuth();
  const isApproved = meData && 'paid' in meData ? meData.paid : false;

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Main Stats */}
        <RefereeDashboardHeader />
        
        {/* Record Banner */}
        {isApproved && <OfficiatingRecord />}
        
        {/* ID Card & Profile Status */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {isApproved && (
            <div className="w-full lg:w-7/12">
              <RefereeIdCard />
            </div>
          )}
          <div className={isApproved ? "w-full lg:w-5/12" : "w-full"}>
            <RefereeProfileStatus />
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
          <RefereeProfileSummary />
        </div>
        
        {/* Upcoming Assignments */}
        {isApproved && (
          <div className="mb-6">
            <UpcomingAssignments />
          </div>
        )}
        
        {/* History & Announcements */}
        {isApproved && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-7/12">
              <RecentHistory />
            </div>
            <div className="w-full lg:w-5/12">
              <RefereeNotices />
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}
