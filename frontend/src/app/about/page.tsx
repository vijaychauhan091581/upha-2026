"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listOfficeBearers, OfficeBearerData } from "@/lib/api";

export default function AboutPage() {
  const [leaders, setLeaders] = useState<OfficeBearerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await listOfficeBearers();
        if (res.success && res.office_bearers) {
          setLeaders(res.office_bearers.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load office bearers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#fcfbf9] w-full">
      {/* 1. HERO BANNER */}
      <section className="bg-[#111827] pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-6 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-gray-300">ABOUT</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide text-white mb-6">
            ABOUT <span className="text-[#d97c55]">UPHA</span>
          </h1>

          <p className="text-gray-400 font-serif italic text-xl md:text-2xl max-w-3xl leading-relaxed">
            For over five decades, the Uttar Pradesh Handball Association has been the
            official custodian of handball in India's most populous state — nurturing talent,
            organising tournaments, and shaping the sport's future across 75 districts.
          </p>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-wrap gap-12 md:gap-20">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">FOUNDED</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">1972 &middot; Lucknow</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">DISTRICTS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">60 Affiliated</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">RECOGNISED BY</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">Handball Association India</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">HEADQUARTERS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">Lucknow, U.P.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                OUR STORY
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-8 text-[#111827] max-w-2xl">
              FIVE DECADES OF <span className="text-[#d97c55]">HANDBALL</span> IN UTTAR PRADESH
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed font-serif text-lg">
              <p>
                The Uttar Pradesh Handball Association was founded in <strong>1972</strong> in Lucknow with the singular
                purpose of bringing organised handball — then a relatively new sport in India — to the
                schools, colleges, and clubs of Uttar Pradesh.
              </p>
              <p>
                From a small founding committee of physical education teachers and athletes, UPHA has
                grown into the state's <strong>recognised governing body</strong> for handball, affiliated to Handball
                Association India, the U.P. Olympic Association, and the Sports Directorate, Govt of Uttar Pradesh. Today, the federation oversees 60
                district units, accredits coaches and referees, and conducts the official state championship
                pathway — from sub-junior trials to senior national selection.
              </p>
              <p>
                Players who began their journey through UPHA's district-level tournaments now represent
                India at the Asian Championships, the South Asian Games, and the Junior World
                Championship. Our work is to make sure the next generation has the same path open to
                them.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[450px] shrink-0">
            <div className="bg-[#111827] text-white p-2 flex flex-col h-full rounded-sm shadow-xl relative aspect-square overflow-hidden">
              <div className="absolute top-6 left-6 bg-[#d97c55] text-white px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-sm shadow-sm">
                ESTABLISHED
              </div>
              <div className="flex-1 flex flex-col items-center justify-center border border-white/10 m-2 relative">
                <div className="font-heading text-8xl md:text-[140px] font-bold text-[#d97c55] leading-none mb-4">
                  '72
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">
                  LUCKNOW, UTTAR PRADESH
                </div>
              </div>
              <div className="text-center pb-6 pt-4 italic font-serif text-gray-500">
                "From district courts to international arenas"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION */}
      <section className="bg-[#fcfbf9] pb-24 max-w-7xl mx-auto px-6 w-full">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#d97c55]"></div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
              OUR VISION
            </div>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-8 text-[#111827]">
            THE NORTH STAR <span className="text-[#d97c55]">THAT GUIDES US</span>
          </h2>

          <div className="border border-[#d97c55] bg-white p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 items-start rounded-sm shadow-sm relative overflow-hidden">
            <div className="shrink-0 w-full md:w-64">
              <div className="font-heading text-6xl md:text-7xl font-bold text-[#d97c55] mb-2 leading-none">
                VISION
              </div>
              <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                THE HORIZON WE WORK TOWARD
              </div>
            </div>
            <div className="flex-1">
              <p className="font-serif italic text-2xl md:text-3xl text-gray-800 leading-snug mb-6">
                "To make Uttar Pradesh the leading state in Indian handball — producing world-class
                athletes, coaches, and officials, and building a sporting culture where every child in
                every district has the opportunity to play, compete, and excel."
              </p>
              <p className="text-sm text-gray-500 leading-relaxed font-serif max-w-3xl">
                We see a future where handball is taught in every government school across U.P., where district-level tournaments draw thousands of young
                players each season, and where the journey from a panchayat court to the national team is open to anyone with the talent and the will to take it.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#d97c55]"></div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
              OUR MISSION
            </div>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[#111827]">
            FOUR PILLARS OF OUR <span className="text-[#d97c55]">DAILY WORK</span>
          </h2>
          <p className="text-gray-500 font-serif italic text-lg max-w-3xl mb-12">
            Our mission breaks the vision into four concrete commitments that guide every tournament we
            organise, every coach we accredit, and every player we register.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-heading font-bold text-gray-200 mb-4">01</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827] mb-3">GROW THE GAME</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Expand handball into every district of Uttar Pradesh through grassroots programmes, school partnerships, and equipment grants to under-served regions.</p>
            </div>
            <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-heading font-bold text-gray-200 mb-4">02</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827] mb-3">DEVELOP TALENT</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Identify and nurture promising players through structured age-group tournaments, residential camps, and a transparent selection pathway from district to state to national.</p>
            </div>
            <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-heading font-bold text-gray-200 mb-4">03</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827] mb-3">BUILD CAPACITY</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Train and accredit a strong network of coaches, referees, and academy partners who uphold the technical and ethical standards of the sport.</p>
            </div>
            <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-heading font-bold text-gray-200 mb-4">04</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827] mb-3">GOVERN WITH INTEGRITY</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Run the federation transparently — published rulebooks, fair selection processes, audited finances, and open communication with our members and the public.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="bg-[#fcfbf9] py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#d97c55]"></div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
              OUR JOURNEY
            </div>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-16 text-[#111827]">
            MILESTONES ACROSS <span className="text-[#d97c55]">THE DECADES</span>
          </h2>

          <div className="relative border-l border-[#eecab5] ml-3 md:ml-6 space-y-12">
            {[
              {
                year: "1972",
                title: "ASSOCIATION FOUNDED",
                desc: "The Uttar Pradesh Handball Association is established in Lucknow by a group of physical education teachers and Olympic federation officials, recognised by Handball Association India in its founding year."
              },
              {
                year: "1981",
                title: "FIRST STATE CHAMPIONSHIP",
                desc: "UPHA conducts its inaugural State Senior Championship, with 14 districts participating — Lucknow takes the men's title and Kanpur Nagar the women's."
              },
              {
                year: "1996",
                title: "NATIONAL RECOGNITION",
                desc: "U.P. wins the National Handball Championship (Senior Men) for the first time, with eight players from the squad later representing India at the South Asian Games."
              },
              {
                year: "2008",
                title: "DISTRICT NETWORK COMPLETED",
                desc: "Affiliated district units established in all 60 administrative districts of Uttar Pradesh, completing the federation's grassroots network."
              },
              {
                year: "2018",
                title: "BEACH HANDBALL PROGRAMME",
                desc: "UPHA becomes one of the first state federations in India to formally include Beach Handball, with a dedicated annual tournament and selection trials."
              },
              {
                year: "2024",
                title: "DIGITAL TRANSFORMATION",
                desc: "The federation launches its online portal — member registration, event entries, results, and admin operations consolidated into a single platform serving athletes, coaches, and district units across the state."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#d97c55]"></div>
                <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">{item.year}</div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-serif max-w-3xl">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP & AFFILIATIONS */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 w-full">
          {/* LEADERSHIP */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                OFFICE BEARERS
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4 text-[#111827]">
              ASSOCIATION <span className="text-[#d97c55]">LEADERSHIP</span>
            </h2>
            <p className="text-gray-500 font-serif italic text-lg max-w-3xl mb-12">
              The current executive committee of the Uttar Pradesh Handball Association, elected for the 2024-2027 term.
            </p>

            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97c55]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {leaders.map((ldr, idx) => {
                  const colors = [
                    "bg-[#1e3a5f] text-white",
                    "bg-[#111827] text-white",
                    "bg-[#d97c55] text-[#111827]",
                    "bg-[#eecab5] text-[#111827]"
                  ];
                  const colorClass = colors[idx % colors.length];
                  const initials = ldr.name ? ldr.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'UP';

                  return (
                    <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-sm flex flex-col hover:shadow-md transition-shadow">
                      {ldr.image ? (
                        <div className="aspect-[4/5] w-full relative">
                          <img src={ldr.image} alt={ldr.name} className="w-full h-full object-cover object-center" />
                        </div>
                      ) : (
                        <div className={`${colorClass} aspect-[4/5] flex items-center justify-center`}>
                          <span className="font-heading text-5xl md:text-6xl font-bold tracking-widest">{initials}</span>
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="text-[8px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">{ldr.role}</div>
                        <div className="font-heading text-base font-bold uppercase tracking-wide text-[#111827] mb-3 leading-tight">{ldr.name}</div>
                        <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase mt-auto pt-3 border-t border-gray-100">Term: {ldr.term || '2023 - 2027'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AFFILIATIONS */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                AFFILIATIONS & RECOGNITION
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-12 text-[#111827]">
              GOVERNING BODIES <span className="text-[#d97c55]">WE REPORT TO</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "HAI", title: "HANDBALL ASSOCIATION INDIA", desc: "National governing body • Affiliated since 1972", color: "bg-[#111827]" },
                { icon: "UPO", title: "U.P. OLYMPIC ASSOCIATION", desc: "State Olympic body • Affiliated since 1975", color: "bg-[#d97c55]" },
                { icon: "SD", title: "SPORTS DIRECTORATE", desc: "Govt of Uttar Pradesh • Affiliated", color: "bg-[#c88d68]" }
              ].map((aff, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm flex items-center gap-5 hover:shadow transition-shadow">
                  <div className={`${aff.color} w-14 h-14 rounded-full text-white text-xs font-bold tracking-widest flex items-center justify-center shrink-0`}>
                    {aff.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-[#111827] mb-1 leading-snug">{aff.title}</h3>
                    <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest leading-relaxed">{aff.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="bg-[#fcfbf9] py-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="bg-[#111827] rounded-sm p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3 text-white">
                BE PART OF THE <span className="text-[#d97c55]">JOURNEY</span>
              </h2>
              <p className="text-gray-400 font-serif italic text-lg max-w-xl">
                Register as a player, coach, referee or academy — and join the U.P. handball family.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 bg-[#d97c55] text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#c16744] transition-colors rounded-sm shadow-sm hover:shadow group"
              >
                REGISTER NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </section>

    </div>
  );
}
