"use client";

import { useEffect, useState } from "react";
import { Check, X, UserPlus, Image as ImageIcon, Trophy } from "lucide-react";
import { getDecisionLog, DecisionLogData } from "@/lib/api";

export default function RecentDecisionsLog() {
  const [activities, setActivities] = useState<DecisionLogData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await getDecisionLog();
      if (res.success) {
        setActivities(res.decisions);
      }
    } catch (err) {
      console.error("Failed to load decisions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Auto-refresh every 10 seconds to show newly approved applications
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24 && now.getDate() === d.getDate()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffHours < 48) {
      return "Yesterday";
    }
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm mt-8">
      {/* Header */}
      <div className="flex justify-between items-end p-6 border-b border-gray-100">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827]">
          RECENT <span className="text-[#d97c55]">ACTIVITY</span>
        </h2>
        <button className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase hover:underline" onClick={fetchActivities}>
          REFRESH
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {loading && activities.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No recent activity.</div>
        ) : (
          activities.map((act) => {
            let icon = null;
            let iconBg = "";
            let iconColor = "";

            if (act.action === "Approved") {
              icon = <Check className="w-4 h-4" />;
              iconBg = "bg-emerald-50 border-emerald-100";
              iconColor = "text-emerald-500";
            } else if (act.action === "Rejected") {
              icon = <X className="w-4 h-4" />;
              iconBg = "bg-red-50 border-red-100";
              iconColor = "text-red-500";
            } else if (act.action === "Created Admin" || act.action === "Invited") {
              icon = <UserPlus className="w-4 h-4" />;
              iconBg = "bg-purple-50 border-purple-100";
              iconColor = "text-purple-500";
            } else {
              icon = <Check className="w-4 h-4" />;
              iconBg = "bg-gray-50 border-gray-100";
              iconColor = "text-gray-500";
            }

            return (
              <div key={act.id} className="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <div className="text-sm">
                      <span className="font-bold text-[#111827]">{act.action}</span> <span className="text-gray-400 mx-1">·</span> <span className="text-gray-600">{act.applicant_name_ref}</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 shrink-0 mt-1 sm:mt-0">
                      {formatTime(act.created_at)}
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {act.details && <span>{act.details} · </span>}By {act.admin_name}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
