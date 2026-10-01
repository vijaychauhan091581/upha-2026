"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { listOfficeBearers, OfficeBearerData } from "@/lib/api";

export default function CouncilPage() {
  const [leaders, setLeaders] = useState<OfficeBearerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await listOfficeBearers();
        if (res.success && res.office_bearers) {
          setLeaders(res.office_bearers);
        }
      } catch (error) {
        console.error("Failed to load office bearers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  // Bifurcation / Categorization logic
  const executiveBoardRoles = [
    "CHAIRMAN",
    "PRESIDENT",
    "TREASURER",
    "EXEC. SECRETARY GENERAL",
    "SECRETARY GENERAL",
  ];

  const executiveBoard = leaders.filter((l) => executiveBoardRoles.includes(l.role));
  const vicePresidents = leaders.filter((l) => l.role === "VICE PRESIDENT");
  const jointSecretaries = leaders.filter((l) => l.role === "JOINT SECRETARY");
  const executiveMembers = leaders.filter((l) => l.role === "EXECUTIVE MEMBER");

  const otherMembers = leaders.filter(
    (l) => !executiveBoardRoles.includes(l.role) && l.role !== "VICE PRESIDENT" && l.role !== "JOINT SECRETARY" && l.role !== "EXECUTIVE MEMBER"
  );

  const groups = [
    { title: "EXECUTIVE BOARD", members: executiveBoard },
    { title: "VICE PRESIDENTS", members: vicePresidents },
    { title: "JOINT SECRETARIES", members: jointSecretaries },
    { title: "EXECUTIVE MEMBERS", members: executiveMembers },
    { title: "OTHER MEMBERS", members: otherMembers },
  ].filter((g) => g.members.length > 0);

  return (
    <main className="flex-1 bg-background flex flex-col pt-12 pb-24">
      {/* Header Section */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-16">
        <Link href="/#" className="inline-flex items-center gap-2 text-primary font-semibold text-xs tracking-widest uppercase mb-8 hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>
        <div className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-accent inline-block"></span> LEADERSHIP DIRECTORY
        </div>
        <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide">
          EXECUTIVE <span className="text-accent">COUNCIL</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mt-6 text-lg leading-relaxed">
          The complete list of dedicated officials driving the Uttar Pradesh Handball Association.
        </p>
      </section>

      {/* Directory Section */}
      <div className="px-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No office bearers found in the database.
          </div>
        ) : (
          <div className="space-y-24">
            {groups.map((group, groupIdx) => (
              <section key={groupIdx}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-primary">
                    {group.title}
                  </h2>
                  <div className="h-[1px] bg-gray-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded bg-white shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div className="h-72 bg-gray-50 w-full relative flex items-center justify-center p-4">
                        {member.image ? (
                          <div className="w-full h-full relative">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-contain object-center"
                            />
                          </div>
                        ) : (
                          <div className="font-heading text-4xl font-bold text-gray-300 opacity-50 uppercase">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between border-t border-gray-100">
                        <div>
                          <div className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
                            {member.role}
                          </div>
                          <h3 className="font-heading text-xl font-bold uppercase tracking-wide leading-tight mb-2">
                            {member.name}
                          </h3>
                        </div>
                        <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase mt-auto pt-3 border-t border-gray-100">
                          Term: {member.term || '2023 - 2027'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
