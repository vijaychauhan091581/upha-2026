"use client";

import AcademyDashboardHeader from "./AcademyDashboardHeader";
import AcademyRecord from "./AcademyRecord";
import AcademyIdCard from "./AcademyIdCard";
import AcademyProfileStatus from "./AcademyProfileStatus";
import AcademyDetailsSummary from "./AcademyDetailsSummary";
import AcademyPlayersGrid from "./AcademyPlayersGrid";
import AcademyStaffAndSchedule from "./AcademyStaffAndSchedule";
import AcademyNotices from "./AcademyNotices";
import MyCertificates from "@/components/MyCertificates";
import { useAuth } from "@/context/AuthContext";

export default function AcademyDashboardPage() {
  const { meData } = useAuth();
  const isApproved = meData && 'paid' in meData ? meData.paid : false;

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Main Stats */}
        <AcademyDashboardHeader />
        
        {/* Tournament Banner */}
        {isApproved && <AcademyRecord />}
        
        {/* ID Card & Profile Status */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {isApproved && (
            <div className="w-full lg:w-7/12">
              <AcademyIdCard />
            </div>
          )}
          <div className={isApproved ? "w-full lg:w-5/12" : "w-full"}>
            <AcademyProfileStatus />
          </div>
        </div>
        
        {/* Certificates */}
        {isApproved && (
          <div className="mb-6">
            <MyCertificates />
          </div>
        )}
        
        {/* Academy Details Summary */}
        <div className="mb-6">
          <AcademyDetailsSummary />
        </div>

        {/* Players Grid */}
        {isApproved && (
          <div className="mb-6">
            <AcademyPlayersGrid />
          </div>
        )}
        
        {/* Staff & Schedule */}
        {isApproved && (
          <div className="mb-6">
            <AcademyStaffAndSchedule />
          </div>
        )}

        {/* Announcements */}
        {isApproved && (
          <div>
            <AcademyNotices />
          </div>
        )}
        
      </div>
    </main>
  );
}
