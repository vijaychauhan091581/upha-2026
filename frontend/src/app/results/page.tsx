"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Calendar, MapPin, Award, Star, User } from "lucide-react";
import { listAchievements, TournamentResultData } from "@/lib/api";

export default function ResultsPage() {
  const [results, setResults] = useState<TournamentResultData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAchievements()
      .then((res) => {
        if (res.success) {
          setResults(res.tournament_results || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#fcfbf9] w-full min-h-screen">
      {/* HERO BANNER */}
      <section className="bg-[#111827] pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-6 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-gray-300">TOURNAMENT RESULTS</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-wide text-white mb-6">
            TOURNAMENT <span className="text-accent">RESULTS</span>
          </h1>

          <p className="text-gray-400 font-serif italic text-xl max-w-3xl leading-relaxed mb-8">
            Complete standings and individual honours from recent Uttar Pradesh state championships, invitational cups, and league events.
          </p>
        </div>
      </section>

      {/* RESULTS LIST */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 w-full">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-100 p-8 rounded-sm h-64"></div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 text-center rounded-sm">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-[#111827] mb-2 uppercase tracking-wide">No Results Found</h3>
              <p className="text-sm text-gray-500">Tournament results will be published here once they are finalized.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {results.map((result) => (
                <div key={result.event_id} className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden flex flex-col hover:border-gray-300 transition-colors">
                  {/* Header */}
                  <div className="bg-[#111827] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest text-accent uppercase mb-3">
                        {result.event_category}
                      </div>
                      <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-white mb-2">
                        {result.event_name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                        {result.final_date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(result.final_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {result.event_location}
                        </div>
                        {result.total_matches && (
                          <div className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            {result.total_matches} Matches
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {/* Standings */}
                    <div className="p-6 md:p-8 md:col-span-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-[1px] bg-accent"></div>
                        <div className="text-[10px] font-bold tracking-widest text-accent uppercase">
                          FINAL STANDINGS
                        </div>
                      </div>

                      <div className="space-y-4">
                        {result.standings.map((standing) => {
                          const isGold = standing.position === 1;
                          const isSilver = standing.position === 2;
                          const isBronze = standing.position === 3;
                          let bgClass = "bg-gray-50 border-gray-200 text-gray-500";
                          if (isGold) bgClass = "bg-[#d89f55]/10 border-[#d89f55] text-[#d89f55]";
                          else if (isSilver) bgClass = "bg-[#a8a9a8]/10 border-[#a8a9a8] text-[#a8a9a8]";
                          else if (isBronze) bgClass = "bg-[#c88d68]/10 border-[#c88d68] text-[#c88d68]";

                          return (
                            <div key={standing.position} className={`flex items-center p-4 border rounded-sm ${bgClass.split(' ')[0]} ${bgClass.split(' ')[1]}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${bgClass.split(' ')[2]}`}>
                                {standing.position}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className={`font-heading text-lg font-bold uppercase tracking-wide ${standing.position <= 3 ? 'text-[#111827]' : 'text-gray-700'}`}>
                                  {standing.team_name}
                                </div>
                                {standing.notes && (
                                  <div className="text-xs text-gray-500 mt-0.5">{standing.notes}</div>
                                )}
                              </div>
                              {isGold && <Trophy className="w-5 h-5 text-[#d89f55] shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual Honours */}
                    <div className="p-6 md:p-8 bg-[#fcfbf9]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-[1px] bg-[#3c8c7c]"></div>
                        <div className="text-[10px] font-bold tracking-widest text-[#3c8c7c] uppercase">
                          INDIVIDUAL HONOURS
                        </div>
                      </div>

                      <div className="space-y-6">
                        {result.best_player && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-[#111827]">
                              <Star className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">PLAYER OF THE TOURNAMENT</div>
                              <div className="font-heading text-lg font-bold text-[#111827] uppercase">{result.best_player}</div>
                            </div>
                          </div>
                        )}

                        {result.top_scorer && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-accent">
                              <Award className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">TOP SCORER</div>
                              <div className="font-heading text-lg font-bold text-[#111827] uppercase">{result.top_scorer}</div>
                            </div>
                          </div>
                        )}

                        {result.best_goalkeeper && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-[#3c8c7c]">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">BEST GOALKEEPER</div>
                              <div className="font-heading text-lg font-bold text-[#111827] uppercase">{result.best_goalkeeper}</div>
                            </div>
                          </div>
                        )}
                        
                        {result.most_promising_junior && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm text-gray-400">
                              <Star className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">PROMISING JUNIOR</div>
                              <div className="font-heading text-lg font-bold text-[#111827] uppercase">{result.most_promising_junior}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
