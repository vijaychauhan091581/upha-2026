"use client";

import { useEffect, useState, useRef } from "react";
import {
  CreateEventPayload,
  EventData,
  listEvents,
  deleteEvent,
  createEvent,
  updateEvent,
} from "@/lib/api";
import {
  Upload,
  Image as ImageIcon,
  X,
  Pencil,
  Trash2,
  CalendarDays,
  Check,
} from "lucide-react";

const UP_DISTRICTS = [
  "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich",
  "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr",
  "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
  "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi",
  "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow",
  "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit",
  "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur",
  "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

export const EVENT_CATEGORIES = [
  "Federation / National Championship",
  "Senior",
  "Junior",
  "Sub-Junior",
  "Youth",
  "U17",
  "U15",
  "U13",
  "U11",
  "Mini Handball",
  "Beach Handball",
  "Masters / Veterans",
  "School / College",
  "Corporate / Institutional",
  "Wheelchair Handball",
];

export default function CreateEventModal({
  onSubmit,
}: {
  onSubmit?: (form: CreateEventPayload | FormData) => Promise<void>;
}) {
  const topRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState("TOURNAMENT");
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const [form, setForm] = useState<CreateEventPayload>({
    name: "",
    location: "",
    venue: "",
    start_date: "",
    end_date: "",
    registration_end_date: "",
    category: "Senior",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [events, setEvents] = useState<EventData[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await listEvents();
      if (res.success) setEvents(res.events);
    } catch (e) {
      console.error("Failed to load events", e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (ev: EventData) => {
    setEditingEvent(ev);
    let type = "TOURNAMENT";
    let cat = ev.category || "Senior";
    const dashIndex = ev.category ? ev.category.indexOf(" - ") : -1;
    if (dashIndex !== -1) {
      type = ev.category.substring(0, dashIndex).trim();
      cat = ev.category.substring(dashIndex + 3).trim();
    } else if (ev.category) {
      cat = ev.category.trim();
    }
    setEventType(type);
    setForm({
      name: ev.name,
      location: ev.location,
      venue: ev.venue || "",
      start_date: ev.start_date,
      end_date: ev.end_date,
      registration_end_date: ev.registration_end_date || ev.start_date,
      category: cat,
    });
    setImagePreview(ev.image || null);
    setImageFile(null);

    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setForm({
      name: "",
      location: "",
      venue: "",
      start_date: "",
      end_date: "",
      registration_end_date: "",
      category: "Senior",
    });
    setImagePreview(null);
    setImageFile(null);
    setEventType("TOURNAMENT");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const finalCategory = `${eventType} - ${form.category}`;
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("location", form.location);
      if (form.venue && form.venue.trim()) {
        fd.append("venue", form.venue.trim());
      } else {
        fd.append("venue", "");
      }
      fd.append("start_date", form.start_date);
      fd.append("end_date", form.end_date);
      fd.append("registration_end_date", form.start_date || "");
      fd.append("category", finalCategory);
      if (imageFile) {
        fd.append("image", imageFile);
      }

      if (editingEvent) {
        const res = await updateEvent(editingEvent.id, fd);
        if (res.success) {
          alert("Event updated successfully!");
          cancelEdit();
          fetchEvents();
        }
      } else {
        if (onSubmit) {
          await onSubmit(fd);
        } else {
          await createEvent(fd);
        }
        alert("Event published successfully!");
        cancelEdit();
        fetchEvents();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (eventId: number, eventName: string) => {
    if (!window.confirm(`Are you sure you want to delete the event "${eventName}"? This cannot be undone.`)) return;
    setDeleting(eventId);
    try {
      const res = await deleteEvent(eventId);
      if (res.success) {
        alert("Event deleted successfully.");
        if (editingEvent?.id === eventId) {
          cancelEdit();
        }
        fetchEvents();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete event.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div ref={topRef} className="bg-white w-full rounded shadow-sm border border-gray-200 relative mb-12">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div>
          <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1">
            {editingEvent ? "ADMIN · EDIT MODE" : "ADMIN · CREATE"}
          </div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide text-[#111827]">
            {editingEvent ? "EDIT" : "NEW"} <span className="text-[#d97c55]">EVENT</span>
          </h2>
          {editingEvent && (
            <p className="text-xs text-gray-500 mt-1">
              Editing: <span className="font-semibold text-gray-900">{editingEvent.name}</span>
            </p>
          )}
        </div>
        {editingEvent && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-8">
          {/* 01 EVENT DETAILS */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-[#d97c55]">01</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                EVENT DETAILS &amp; BANNER
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                  EVENT NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Senior Handball Championship 2026"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* EVENT BANNER / POSTER UPLOAD */}
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                  EVENT BANNER / POSTER IMAGE
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-[#fcfbf9] border border-gray-200 rounded">
                  {imagePreview ? (
                    <div className="relative w-36 h-24 rounded border border-gray-200 overflow-hidden bg-gray-900 shrink-0 group">
                      <img src={imagePreview} alt="Event Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-36 h-24 rounded border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0 bg-white">
                      <ImageIcon className="w-6 h-6 mb-1 text-gray-400" />
                      <span className="text-[9px] font-semibold">No Banner</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      id="event-image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="event-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#d97c55]" />
                      <span>{imagePreview ? "Change Banner Image" : "Upload Event Poster / Banner"}</span>
                    </label>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      JPG, PNG, WebP up to 10MB. Shows on the Home page, Calendar, and event lists.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                  EVENT TYPE *
                </label>
                <div className="flex flex-wrap gap-2">
                  {["TOURNAMENT", "TRIAL", "WORKSHOP", "MEET", "CLINIC / CAMP"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                        eventType === type
                          ? "bg-[#d97c55]/10 border border-[#d97c55] text-[#d97c55]"
                          : "bg-[#fcfbf9] border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                    CATEGORY *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                    DISTRICT *
                  </label>
                  <select
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                  >
                    <option value="">Select district...</option>
                    {UP_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                    VENUE / STADIUM / GROUND NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. K.D. Singh Babu Stadium / Sports Complex Indoor Hall"
                    value={form.venue || ""}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                    START DATE *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5">
                    END DATE *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full bg-[#fcfbf9] border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#d97c55] text-gray-800"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-gray-400 font-mono">
            {editingEvent ? "Updating event details & banner image" : "Event will be published immediately to calendar & home page"}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {editingEvent && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-5 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
              >
                CANCEL EDIT
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none bg-[#d97c55] text-white px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-[#c16744] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              {loading
                ? editingEvent ? "SAVING CHANGES..." : "PUBLISHING..."
                : editingEvent ? "UPDATE EVENT" : "PUBLISH EVENT"}
            </button>
          </div>
        </div>
      </form>

      {/* 04 PUBLISHED EVENTS (EDIT & DELETE SECTION) */}
      <div className="p-6 border-t border-gray-100 bg-[#fcfbf9] rounded-b">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#d97c55]">04</span>
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
              PUBLISHED EVENTS ({events.length})
            </h3>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Click Edit to modify or Delete to remove</span>
        </div>

        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded bg-white">
              No events have been published yet.
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border rounded shadow-sm transition-all ${
                  editingEvent?.id === ev.id ? "border-[#d97c55] ring-2 ring-[#d97c55]/20" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Event Thumbnail */}
                  <div className="w-16 h-14 rounded bg-gray-100 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {ev.image ? (
                      <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                    ) : (
                      <CalendarDays className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-[#111827] truncate flex items-center gap-2">
                      <span>{ev.name}</span>
                      {editingEvent?.id === ev.id && (
                        <span className="text-[9px] bg-[#d97c55] text-white px-2 py-0.5 rounded font-bold uppercase">
                          Editing Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ev.venue ? `${ev.venue}, ${ev.location}` : ev.location} &middot; {ev.category.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{ev.start_date} to {ev.end_date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(ev)}
                    className="inline-flex items-center gap-1.5 border border-[#d97c55]/40 text-[#d97c55] hover:bg-[#d97c55]/10 px-3.5 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>EDIT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ev.id, ev.name)}
                    disabled={deleting === ev.id}
                    className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 px-3.5 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{deleting === ev.id ? "DELETING..." : "DELETE"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
