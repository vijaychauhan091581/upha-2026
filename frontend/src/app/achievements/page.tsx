"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, Trophy, MapPin, Calendar } from "lucide-react";
import {
  listAchievements,
  PlayerAchievementData,
  CoachAchievementData,
  FederationAwardData,
  NationalMedalData,
  TournamentResultData,
} from "@/lib/api";

export default function AchievementsPage() {
  const [players, setPlayers] = useState<PlayerAchievementData[]>([]);
  const [coaches, setCoaches] = useState<CoachAchievementData[]>([]);
  const [awards, setAwards] = useState<FederationAwardData[]>([]);
  const [medals, setMedals] = useState<NationalMedalData[]>([]);
  const [tournamentResults, setTournamentResults] = useState<TournamentResultData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAchievements()
      .then((res) => {
        if (res.success) {
          setPlayers(res.players);
          setCoaches(res.coaches);
          setAwards(res.awards);
          setMedals(res.medals || []);
          setTournamentResults(res.tournament_results || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#fcfbf9] w-full">
      {/* HERO BANNER */}
      <section className="bg-[#111827] pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-6 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-gray-300">ACHIEVEMENTS</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide text-white mb-6">
            ASSOCIATION <span className="text-[#d97c55]">ACHIEVEMENTS</span>
          </h1>

          <p className="text-gray-400 font-serif italic text-xl md:text-2xl max-w-3xl leading-relaxed">
            Celebrating U.P.'s handball legacy — national medals, the players who have worn India colours, and the coaches and officials who built the foundation.
          </p>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-wrap gap-12 md:gap-20">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">NATIONAL MEDALS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{loading ? "..." : medals.length} Since 1996</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">INDIA INTERNATIONALS</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{loading ? "..." : players.length} Players</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">COACHES HONOURED</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{loading ? "..." : coaches.length} Awarded</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">YEARS ACTIVE</div>
              <div className="text-white font-bold text-sm font-mono tracking-wide">{new Date().getFullYear() - 1970} Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS ROW (Overlapping) */}
      <section className="relative -mt-16 z-10 max-w-7xl mx-auto px-6 w-full mb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 shadow-sm border-t-4 border-[#d97c55] rounded-sm">
            <div className="text-5xl font-heading font-bold text-[#111827]">{loading ? "—" : medals.filter(m => m.medal_type === 'GOLD').length.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#111827] mt-3 mb-2">GOLD MEDALS</div>
            <p className="text-[10px] text-gray-500 leading-relaxed">National Championships across Senior, Junior & Sub-Junior categories</p>
          </div>
          <div className="bg-white p-6 shadow-sm border-t-4 border-[#3c8c7c] rounded-sm">
            <div className="text-5xl font-heading font-bold text-[#111827]">{loading ? "—" : players.length.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#111827] mt-3 mb-2">INDIA INTERNATIONALS</div>
            <p className="text-[10px] text-gray-500 leading-relaxed">U.P. players selected to represent India at Asian & South Asian events</p>
          </div>
          <div className="bg-white p-6 shadow-sm border-t-4 border-[#d97c55] rounded-sm">
            <div className="text-5xl font-heading font-bold text-[#111827]">{loading ? "—" : coaches.length.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#111827] mt-3 mb-2">COACHES HONOURED</div>
            <p className="text-[10px] text-gray-500 leading-relaxed">U.P. coaches with national/state recognition for service to handball</p>
          </div>
          <div className="bg-white p-6 shadow-sm border-t-4 border-[#1e3a5f] rounded-sm">
            <div className="text-5xl font-heading font-bold text-[#111827]">{loading ? "—" : awards.length.toString().padStart(2, '0')}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#111827] mt-3 mb-2">FEDERATION AWARDS</div>
            <p className="text-[10px] text-gray-500 leading-relaxed">National-level recognition of UPHA for governance & grassroots work</p>
          </div>
        </div>
      </section>

      {/* ROLL OF HONOUR - MEDALS */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-24">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[#d97c55]"></div>
            <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
              ROLL OF HONOUR
            </div>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[#111827]">
            NATIONAL CHAMPIONSHIP <span className="text-[#d97c55]">MEDALS</span>
          </h2>
          <p className="text-gray-500 font-serif italic text-lg max-w-3xl">
            Medals won by Uttar Pradesh teams at the Senior National, Junior National and Sub-Junior National Handball Championships — the highest-level competitions in Indian handball.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="animate-pulse space-y-3">
               {[1, 2, 3].map(i => <div key={i} className="bg-white border border-gray-100 p-5 rounded-sm h-24"></div>)}
            </div>
          ) : medals.length === 0 ? (
            <div className="text-gray-500 italic py-6">No national medals found.</div>
          ) : medals.map((medal, idx) => {
            let badgeColor = "bg-[#d89f55]"; // Gold
            if (medal.medal_type === "SILVER") badgeColor = "bg-[#a8a9a8]";
            if (medal.medal_type === "BRONZE") badgeColor = "bg-[#c88d68]";

            return (
              <div key={idx} className="bg-white border border-gray-100 p-5 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center gap-4 hover:shadow transition-shadow">
                <div className="font-heading text-2xl md:text-3xl font-bold text-[#111827] min-w-[4rem] max-w-[10rem] break-words shrink-0">
                  {medal.year}
                </div>
                
                <div className={`w-12 h-12 rounded-full text-white text-[9px] font-bold tracking-widest flex items-center justify-center shrink-0 uppercase shadow-sm ${badgeColor}`}>
                  {medal.medal_type}
                </div>

                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg uppercase tracking-wide text-[#111827] mb-1">
                    {medal.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                    {medal.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="bg-[#fcfbf9] border border-gray-100 px-4 py-2 text-[9px] font-bold tracking-widest uppercase text-gray-500 rounded-sm">
                    {medal.category}
                  </div>
                  <div className="text-xs font-bold text-[#d97c55] min-w-[80px] text-right uppercase tracking-widest">
                    {medal.result}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOURNAMENT RESULTS */}
      {(loading || tournamentResults.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 w-full mb-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                TOURNAMENT RESULTS
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[#111827]">
              OFFICIAL <span className="text-[#d97c55]">STANDINGS</span>
            </h2>
            <p className="text-gray-500 font-serif italic text-lg max-w-3xl">
              Final standings and individual awards from UPHA tournaments — published by the federation.
            </p>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              {[1, 2].map(i => <div key={i} className="bg-white border border-gray-100 rounded-sm h-52"></div>)}
            </div>
          ) : (
            <div className="space-y-8">
              {tournamentResults.map((result) => {
                const positionColors = ["bg-[#d19b67] text-[#111827]", "bg-[#b3b0a7] text-[#111827]", "bg-[#9e6d4c] text-white"];
                return (
                  <div key={result.event_id} className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                    {/* Event Header */}
                    <div className="bg-[#111827] px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#d97c55]/20 rounded-full flex items-center justify-center shrink-0">
                          <Trophy className="w-5 h-5 text-[#d97c55]" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
                            {result.event_name}
                          </h3>
                          <div className="flex items-center gap-3 text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{result.event_location}</span>
                            {result.final_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{result.final_date}</span>}
                            <span className="bg-[#d97c55]/20 text-[#d97c55] px-2 py-0.5 rounded-sm">{result.event_category}</span>
                          </div>
                        </div>
                      </div>
                      {result.total_matches && (
                        <div className="text-right">
                          <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Total Matches</div>
                          <div className="text-2xl font-heading font-bold text-white">{result.total_matches}</div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-8">
                      {/* Standings */}
                      {result.standings.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-4">Final Standings</div>
                          <div className="space-y-2">
                            {result.standings.map((s, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-[#fcfbf9] border border-gray-100 rounded px-3 py-2.5">
                                <div className={`w-12 text-center py-1.5 rounded text-xs font-bold tracking-widest shrink-0 ${positionColors[idx] || "bg-[#18202f] text-white"}`}>
                                  {["1ST","2ND","3RD","4TH","5TH","6TH","7TH","8TH"][idx] ?? `${idx+1}TH`}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-sm text-[#111827] truncate">{s.team_name}</div>
                                  {s.notes && <div className="text-[10px] text-gray-400 truncate">{s.notes}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Individual Awards */}
                      {(result.top_scorer || result.best_player || result.best_goalkeeper || result.most_promising_junior) && (
                        <div>
                          <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-4">Individual Awards</div>
                          <div className="space-y-3">
                            {result.top_scorer && (
                              <div className="flex items-start gap-3">
                                <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 w-28 shrink-0 pt-0.5">Top Scorer</div>
                                <div className="text-sm text-[#111827] font-medium">{result.top_scorer}</div>
                              </div>
                            )}
                            {result.best_player && (
                              <div className="flex items-start gap-3">
                                <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 w-28 shrink-0 pt-0.5">Best Player</div>
                                <div className="text-sm text-[#111827] font-medium">{result.best_player}</div>
                              </div>
                            )}
                            {result.best_goalkeeper && (
                              <div className="flex items-start gap-3">
                                <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 w-28 shrink-0 pt-0.5">Best Goalkeeper</div>
                                <div className="text-sm text-[#111827] font-medium">{result.best_goalkeeper}</div>
                              </div>
                            )}
                            {result.most_promising_junior && (
                              <div className="flex items-start gap-3">
                                <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 w-28 shrink-0 pt-0.5">Best Junior</div>
                                <div className="text-sm text-[#111827] font-medium">{result.most_promising_junior}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="py-24 bg-[#fcfbf9] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                INDIA INTERNATIONALS
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[#111827]">
              U.P. PLAYERS IN <span className="text-[#d97c55]">INDIA COLOURS</span>
            </h2>
            <p className="text-gray-500 font-serif italic text-lg max-w-3xl">
              Players from Uttar Pradesh who progressed through UPHA's pathway and
              went on to represent India at international handball competitions.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 h-[400px] rounded-sm"></div>
              ))}
            </div>
          ) : players.length === 0 ? (
            <div className="py-12 text-center text-gray-500 italic">No player achievements found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {players.map((p) => {
                const initials = p.name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase();
                
                let bgColorClass = "bg-[#111827]";
                if (p.color_theme === "orange") bgColorClass = "bg-[#d97c55]";
                else if (p.color_theme === "green") bgColorClass = "bg-[#3c8c7c]";
                else if (p.color_theme === "blue") bgColorClass = "bg-[#1e3a5f]"; 

                return (
                  <div key={p.id} className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                    {/* Top Colored Box */}
                    <div className={`relative ${bgColorClass} flex items-center justify-center p-16 aspect-video`}>
                      <div className="absolute top-4 right-4 bg-[#111827] text-[#d97c55] px-2 py-1 text-[8px] font-bold tracking-widest uppercase flex items-center gap-1.5 rounded-sm shadow-sm">
                        <span className="text-[6px]">★</span> {p.category_tag}
                      </div>
                      <span className="text-white text-5xl md:text-6xl font-heading font-bold tracking-widest">
                        {initials}
                      </span>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-[#111827] mb-2">
                        {p.name}
                      </h3>
                      <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase flex gap-2 items-center mb-6">
                        <span>{p.district}</span>
                        <span className="text-gray-300">&middot;</span>
                        <span>{p.position}</span>
                        {p.player_id_str && (
                          <>
                            <span className="text-gray-300">&middot;</span>
                            <span>{p.player_id_str}</span>
                          </>
                        )}
                      </div>

                      <div className="border-t border-dashed border-gray-200 pt-6">
                        <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-2">
                          {p.event_name}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-serif">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 2. COACHES HONOURED */}
      <section className="border-t border-gray-200 bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                BEHIND THE BENCH
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-[#111827]">
              COACHES <span className="text-[#d97c55]">HONOURED</span>
            </h2>
            <p className="text-gray-500 font-serif italic text-lg max-w-3xl">
              UPHA-affiliated coaches whose service to handball has been
              recognised with national or state-level honours.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 h-[100px] rounded-sm"></div>
              ))}
            </div>
          ) : coaches.length === 0 ? (
            <div className="py-12 text-center text-gray-500 italic">No coach achievements found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coaches.map((c, idx) => {
                const initials = c.name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase();
                
                const colorModes = [
                  "bg-[#111827] text-white",
                  "bg-[#d97c55] text-white",
                  "bg-[#eecab5] text-[#d97c55]"
                ];
                const circleColor = colorModes[idx % colorModes.length];

                return (
                  <div key={c.id} className="border border-gray-100 bg-white rounded-sm p-6 shadow-sm flex items-start gap-5 hover:border-gray-300 transition-colors">
                    <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-heading text-xl font-bold ${circleColor}`}>
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827] mb-1">
                        {c.name}
                      </h3>
                      <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase mb-2">
                        {c.award_name}
                      </div>
                      <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase flex gap-2 items-center flex-wrap">
                        <span>{c.year}</span>
                        <span className="text-gray-300">&middot;</span>
                        <span>{c.role_description}</span>
                        {c.coach_id_str && (
                          <>
                            <span className="text-gray-300">&middot;</span>
                            <span>{c.coach_id_str}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. AWARDS RECEIVED BY UPHA */}
      <section className="bg-[#111827] py-24 text-white relative">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#d97c55]"></div>
              <div className="text-[10px] font-bold tracking-widest text-[#d97c55] uppercase">
                FEDERATION RECOGNITION
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6">
              AWARDS RECEIVED BY <span className="text-[#d97c55]">UPHA</span>
            </h2>
            <p className="text-gray-400 font-serif italic text-lg max-w-2xl">
              National- and state-level honours received by the Uttar Pradesh
              Handball Association as a federation for governance, grassroots
              development, and contribution to the sport.
            </p>
          </div>

          <div className="max-w-4xl space-y-4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-800 h-[80px] rounded-sm"></div>
                ))}
              </div>
            ) : awards.length === 0 ? (
              <div className="py-12 text-gray-500 italic">No federation awards found.</div>
            ) : (
              awards.map((a) => (
                <div key={a.id} className="bg-[#1a2332] border border-gray-800 p-6 md:p-8 rounded-sm flex flex-col md:flex-row md:items-center gap-6 hover:border-gray-700 transition-colors">
                  <div className="font-heading text-3xl font-bold text-[#d97c55] md:w-24 shrink-0">
                    {a.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wide mb-2">
                      {a.award_name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-mono">
                      {a.awarded_by}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex flex-col items-center justify-center shrink-0 text-[#d97c55] border border-white/10 hidden md:flex">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. CTA: Are you a U.P. player with an achievement? */}
      <section className="bg-[#fcfbf9] py-24">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3 text-[#111827]">
              ARE YOU A U.P. PLAYER WITH AN <span className="text-[#d97c55]">ACHIEVEMENT?</span>
            </h2>
            <p className="text-gray-500 font-serif italic text-lg max-w-xl">
              Registered UPHA members can submit national or international
              honours to be added to this page.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard/player"
              className="inline-flex items-center gap-3 bg-[#d97c55] text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#c16744] transition-colors rounded-sm shadow-sm hover:shadow group"
            >
              SUBMIT ACHIEVEMENT
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CTA: Be part of the journey */}
      <section className="bg-[#111827] py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4 text-white">
              BE PART OF THE <span className="text-[#d97c55]">JOURNEY</span>
            </h2>
            <p className="text-gray-400 font-serif italic text-lg max-w-xl">
              Register as a player, coach, referee or academy — and join the
              U.P. handball family.
            </p>
          </div>
          <div>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-[#d97c55] text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#c16744] transition-colors rounded-sm shadow-sm hover:shadow group"
            >
              REGISTER NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
