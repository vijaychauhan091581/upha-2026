"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Award, Medal, Users, UserCheck } from "lucide-react";
import {
  listAchievements,
  createNationalMedal,
  updateNationalMedal,
  deleteNationalMedal,
  createPlayerAchievement,
  updatePlayerAchievement,
  deletePlayerAchievement,
  createCoachAchievement,
  updateCoachAchievement,
  deleteCoachAchievement,
  createFederationAward,
  updateFederationAward,
  deleteFederationAward,
  NationalMedalData,
  PlayerAchievementData,
  CoachAchievementData,
  FederationAwardData
} from "@/lib/api";

type AchievementTab = "medals" | "players" | "coaches" | "awards";

export default function ManageAchievements() {
  const [activeTab, setActiveTab] = useState<AchievementTab>("medals");
  
  // Data States
  const [medals, setMedals] = useState<NationalMedalData[]>([]);
  const [players, setPlayers] = useState<PlayerAchievementData[]>([]);
  const [coaches, setCoaches] = useState<CoachAchievementData[]>([]);
  const [awards, setAwards] = useState<FederationAwardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success'|'error'} | null>(null);

  // Form Field States - Shared
  const [year, setYear] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState("");
  
  // Specific Form Fields
  const [medalType, setMedalType] = useState("GOLD");
  const [district, setDistrict] = useState("");
  const [position, setPosition] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [awardName, setAwardName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [awardedBy, setAwardedBy] = useState("");

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await listAchievements();
      if (res.success) {
        setMedals(res.medals || []);
        setPlayers(res.players || []);
        setCoaches(res.coaches || []);
        setAwards(res.awards || []);
      }
    } catch (err) {
      showToast("Failed to load achievements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openForm = (item?: any) => {
    setEditingItem(item || null);
    
    // Reset all fields
    setYear(item?.year || "");
    setName(item?.name || "");
    setTitle(item?.title || "");
    setDescription(item?.description || "");
    setCategory(item?.category || item?.category_tag || "");
    setResult(item?.result || "");
    setMedalType(item?.medal_type || "GOLD");
    setDistrict(item?.district || "");
    setPosition(item?.position || "");
    setEventName(item?.event_name || "");
    setEventLocation(item?.event_location || "");
    setAwardName(item?.award_name || "");
    setRoleDescription(item?.role_description || "");
    setAwardedBy(item?.awarded_by || "");

    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let res: any;
      if (activeTab === "medals") {
        const payload = { year, medal_type: medalType, title, description, category, result };
        res = editingItem 
          ? await updateNationalMedal({ ...payload, id: editingItem.id })
          : await createNationalMedal(payload);
      } else if (activeTab === "players") {
        const payload = { name, district, position, event_name: eventName, event_location: eventLocation, description, category_tag: category };
        res = editingItem
          ? await updatePlayerAchievement({ ...payload, id: editingItem.id })
          : await createPlayerAchievement(payload);
      } else if (activeTab === "coaches") {
        const payload = { name, award_name: awardName, year, role_description: roleDescription };
        res = editingItem
          ? await updateCoachAchievement({ ...payload, id: editingItem.id })
          : await createCoachAchievement(payload);
      } else if (activeTab === "awards") {
        const payload = { year, award_name: awardName, awarded_by: awardedBy };
        res = editingItem
          ? await updateFederationAward({ ...payload, id: editingItem.id })
          : await createFederationAward(payload);
      }

      if (res.success) {
        showToast("Saved successfully", "success");
        setModalOpen(false);
        fetchAll();
      } else {
        showToast(res.message || "Failed to save", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      let res: any;
      if (activeTab === "medals") res = await deleteNationalMedal(id);
      if (activeTab === "players") res = await deletePlayerAchievement(id);
      if (activeTab === "coaches") res = await deleteCoachAchievement(id);
      if (activeTab === "awards") res = await deleteFederationAward(id);

      if (res.success) {
        showToast("Deleted successfully", "success");
        fetchAll();
      } else {
        showToast(res.message || "Failed to delete", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-24 right-6 z-[200] px-6 py-3 rounded text-xs font-bold tracking-widest shadow-xl text-white ${toastMessage.type === 'success' ? 'bg-[#3c8c7c]' : 'bg-red-600'}`}>
          {toastMessage.message}
        </div>
      )}

      {!modalOpen ? (
        <>
          <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-sm border border-gray-200 gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-gray-800 uppercase tracking-wide">Manage Achievements</h2>
              <p className="text-xs text-gray-500 mt-1 font-mono">Add or edit records across the Federation Honour Roll</p>
            </div>
            <button
              onClick={() => openForm()}
              className="bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
              <button 
                onClick={() => setActiveTab("medals")}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition whitespace-nowrap ${activeTab === 'medals' ? 'bg-white border-t-2 border-t-accent text-accent' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <Medal className="w-4 h-4" /> National Medals
              </button>
              <button 
                onClick={() => setActiveTab("players")}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition whitespace-nowrap ${activeTab === 'players' ? 'bg-white border-t-2 border-t-[#3c8c7c] text-[#3c8c7c]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <Users className="w-4 h-4" /> India Players
              </button>
              <button 
                onClick={() => setActiveTab("coaches")}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition whitespace-nowrap ${activeTab === 'coaches' ? 'bg-white border-t-2 border-t-[#d97c55] text-[#d97c55]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <UserCheck className="w-4 h-4" /> Coaches Honoured
              </button>
              <button 
                onClick={() => setActiveTab("awards")}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition whitespace-nowrap ${activeTab === 'awards' ? 'bg-white border-t-2 border-t-[#1e3a5f] text-[#1e3a5f]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <Award className="w-4 h-4" /> Federation Awards
              </button>
            </div>

            <div className="p-0">
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-mono text-sm">Loading data...</div>
              ) : activeTab === "medals" ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                      <th className="p-4">Year</th>
                      <th className="p-4">Medal</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medals.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-mono text-sm">No medals found</td></tr>}
                    {medals.map((m) => (
                      <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-800">{m.year}</td>
                        <td className="p-4 font-bold text-xs" style={{ color: m.medal_type === 'GOLD' ? '#d89f55' : m.medal_type === 'SILVER' ? '#a8a9a8' : '#c88d68' }}>{m.medal_type}</td>
                        <td className="p-4 text-sm">{m.title}</td>
                        <td className="p-4 text-xs text-gray-500">{m.category}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openForm(m)} className="p-2 text-gray-400 hover:text-accent bg-gray-50 hover:bg-accent/10 rounded transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(m.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : activeTab === "players" ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                      <th className="p-4">Player</th>
                      <th className="p-4">Event</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-mono text-sm">No players found</td></tr>}
                    {players.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <div className="font-bold text-sm text-gray-800">{p.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase">{p.district}</div>
                        </td>
                        <td className="p-4 text-sm">{p.event_name}</td>
                        <td className="p-4 text-xs text-gray-500">{p.category_tag}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openForm(p)} className="p-2 text-gray-400 hover:text-accent bg-gray-50 hover:bg-accent/10 rounded transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : activeTab === "coaches" ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                      <th className="p-4">Year</th>
                      <th className="p-4">Coach</th>
                      <th className="p-4">Award Name</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coaches.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-mono text-sm">No coaches found</td></tr>}
                    {coaches.map((c) => (
                      <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-800">{c.year}</td>
                        <td className="p-4 text-sm font-bold">{c.name}</td>
                        <td className="p-4 text-sm">{c.award_name}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openForm(c)} className="p-2 text-gray-400 hover:text-accent bg-gray-50 hover:bg-accent/10 rounded transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                      <th className="p-4">Year</th>
                      <th className="p-4">Award Name</th>
                      <th className="p-4">Awarded By</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awards.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-mono text-sm">No awards found</td></tr>}
                    {awards.map((a) => (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4 font-bold text-gray-800">{a.year}</td>
                        <td className="p-4 text-sm font-bold">{a.award_name}</td>
                        <td className="p-4 text-sm">{a.awarded_by}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openForm(a)} className="p-2 text-gray-400 hover:text-accent bg-gray-50 hover:bg-accent/10 rounded transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden animate-in fade-in duration-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2 className="font-heading text-xl font-bold text-gray-800 uppercase tracking-wide">
                {editingItem ? 'Edit Achievement' : 'Add Achievement'}
              </h2>
              <div className="text-xs text-accent mt-1 font-bold uppercase tracking-widest">{activeTab}</div>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {activeTab === "medals" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Year</label>
                    <input required type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" placeholder="e.g. 2023" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Medal Type</label>
                    <select value={medalType} onChange={e => setMedalType(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent bg-white">
                      <option value="GOLD">Gold</option>
                      <option value="SILVER">Silver</option>
                      <option value="BRONZE">Bronze</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Title</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" placeholder="e.g. 50th Senior National" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Description</label>
                    <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" placeholder="Location or brief details" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Category</label>
                    <input required type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" placeholder="e.g. MEN / WOMEN" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Result</label>
                    <input required type="text" value={result} onChange={e => setResult(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" placeholder="e.g. RUNNER UP" />
                  </div>
                </>
              )}

              {activeTab === "players" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Player Name</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">District</label>
                    <input required type="text" value={district} onChange={e => setDistrict(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Position</label>
                    <input required type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Category Tag</label>
                    <input required type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" placeholder="e.g. INDIA MEN'S TEAM" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Event Name</label>
                    <input required type="text" value={eventName} onChange={e => setEventName(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Event Location</label>
                    <input required type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Description</label>
                    <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                </>
              )}

              {activeTab === "coaches" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Year</label>
                    <input required type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Coach Name</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Award Name</label>
                    <input required type="text" value={awardName} onChange={e => setAwardName(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Role/Description</label>
                    <input required type="text" value={roleDescription} onChange={e => setRoleDescription(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                </>
              )}

              {activeTab === "awards" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Year</label>
                    <input required type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Award Name</label>
                    <input required type="text" value={awardName} onChange={e => setAwardName(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Awarded By</label>
                    <input required type="text" value={awardedBy} onChange={e => setAwardedBy(e.target.value)} className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:border-accent" />
                  </div>
                </>
              )}

            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? "Saving..." : editingItem ? "Update Achievement" : "Save Achievement"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
