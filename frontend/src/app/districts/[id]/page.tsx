"use client";

import DistrictProfileHero from "./DistrictProfileHero";
import OfficeBearersSection from "./OfficeBearersSection";
import OfficeDetailsSection from "./OfficeDetailsSection";
import GetInvolvedSection from "./GetInvolvedSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDistrict, listDistricts, DistrictData } from "@/lib/api";

export default function DistrictProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [district, setDistrict] = useState<DistrictData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDistrict(id)
      .then((res) => {
        if (res?.success && res.district) {
          setDistrict(res.district);
        } else {
          return listDistricts().then((r) => {
            const found = r.districts.find((d) => d.id.toString() === id);
            setDistrict(found || null);
          });
        }
      })
      .catch(() => {
        return listDistricts().then((r) => {
          const found = r.districts.find((d) => d.id.toString() === id);
          setDistrict(found || null);
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="flex-1 bg-[#fcfbf9] min-h-screen pb-24 flex items-center justify-center animate-pulse text-gray-400 tracking-widest font-bold text-xs uppercase">Loading District Data...</main>;
  }

  if (!district) {
    return <main className="flex-1 bg-[#fcfbf9] min-h-screen pb-24 flex items-center justify-center flex-col gap-4">
      <div className="text-gray-500 uppercase tracking-widest font-bold text-sm">District not found</div>
      <Link href="/districts" className="text-accent hover:underline text-xs tracking-widest uppercase font-bold">Return to Directory</Link>
    </main>;
  }

  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-screen pb-24">
      <DistrictProfileHero district={district} />
      
      <div className="max-w-7xl mx-auto px-6 mt-32">
        {/* Back Link */}
        <Link href="/districts" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-primary transition-colors border border-gray-200 bg-white px-4 py-2.5 rounded-sm shadow-sm mb-16">
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO ALL DISTRICTS
        </Link>
        
        {/* Sections */}
        <OfficeBearersSection district={district} />
        <OfficeDetailsSection district={district} />
        <GetInvolvedSection district={district} />
      </div>
    </main>
  );
}
