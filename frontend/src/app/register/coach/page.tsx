import Link from "next/link";
import { ShieldAlert, ArrowLeft, Users, Shield, Award } from "lucide-react";

export default function CoachCertificationPage() {
  return (
    <main className="flex-1 bg-[#fcfbf9] min-h-[75vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-lg shadow-xl p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-sm">
          <Award className="w-10 h-10" />
        </div>

        <div className="inline-block bg-[#111827] text-white text-[10px] font-mono font-bold px-3 py-1 rounded mb-4 tracking-widest uppercase">
          UPHA TECHNICAL COMMITTEE NOTICE
        </div>

        <h1 className="font-heading text-3xl font-bold uppercase text-primary mb-4">
          Coach Accreditations &amp; Registrations
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Public self-registration for coaches is closed. As per the Uttar Pradesh Handball Association (UPHA) technical guidelines, coaches are directly appointed, accredited, and verified by the State Executive &amp; Technical Panel.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8 text-left text-xs text-gray-700 space-y-2">
          <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Official Accreditation Process:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-1">
            <li>District &amp; State Level coaching credentials are maintained centrally by UPHA Administration.</li>
            <li>Verified coaches are issued official UPHA Coach IDs and showcased on the state database.</li>
            <li>For inquiries regarding coach affiliations, please contact the UPHA Technical Secretariat.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/database/coaches"
            className="w-full sm:w-auto bg-[#111827] hover:bg-[#d97c55] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>View Coaches Database</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
