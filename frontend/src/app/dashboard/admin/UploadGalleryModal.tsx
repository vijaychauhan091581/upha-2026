"use client";

import { UploadCloud, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { listEvents, EventData, createAlbum, listAlbums, deleteAlbum, AlbumData } from "@/lib/api";

export default function UploadGalleryModal() {
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [albumType, setAlbumType] = useState<"PHOTOS" | "VIDEO">("PHOTOS");
  const [category, setCategory] = useState("TOURNAMENT");
  const [eventId, setEventId] = useState("");
  
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);

  const [events, setEvents] = useState<EventData[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchAlbums = async () => {
    try {
      const res = await listAlbums();
      if (res.success) setAlbums(res.albums);
    } catch (e) {
      console.error("Failed to load albums", e);
    }
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await listEvents();
        if (res.success && res.events) {
          setEvents(res.events);
        }
      } catch (e) {
        console.error("Failed to load events", e);
      }
    }
    fetchEvents();
    fetchAlbums();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex(coverIndex - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please provide a title.");
      return;
    }
    if (albumType === "PHOTOS" && photos.length === 0) {
      alert("Please provide at least one photo.");
      return;
    }
    if (albumType === "VIDEO" && !youtubeLink) {
      alert("Please provide a YouTube video link.");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (date) formData.append("date", date);
      if (youtubeLink) formData.append("youtube_link", youtubeLink);
      formData.append("category", category);
      if (eventId) formData.append("event_id", eventId);
      formData.append("cover_index", coverIndex.toString());
      
      photos.forEach(photo => {
        formData.append("photos", photo);
      });

      const res = await createAlbum(formData);
      if (res.success) {
        alert("Gallery published successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setDate("");
        setYoutubeLink("");
        setCategory("TOURNAMENT");
        setEventId("");
        setPhotos([]);
        setPhotoPreviews([]);
        setCoverIndex(0);
        fetchAlbums();
      }
    } catch (error: any) {
      alert(error.message || "Failed to publish album.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (albumId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the album "${title}"?`)) return;
    setDeleting(albumId);
    try {
      const res = await deleteAlbum(albumId);
      if (res.success) {
        alert("Album deleted successfully.");
        fetchAlbums();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete album.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="bg-[#fcfbf9] p-8 pb-6 border-b border-gray-100 flex justify-between items-start rounded-t-sm">
        <div>
          <div className="text-[9px] font-bold tracking-widest text-[#d97c55] uppercase mb-1.5 font-mono">
            ADMIN &middot; GALLERY
          </div>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827]">
            UPLOAD <span className="text-[#d97c55]">GALLERY</span>
          </h2>
        </div>
        <div className="w-8 h-8 pointer-events-none invisible" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-sm">
        <div className="p-8 space-y-10">
          
          {/* 01 ALBUM DETAILS */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-dashed border-gray-200 pb-3">
              <span className="text-[10px] font-bold text-[#d97c55] font-mono">01</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                ALBUM DETAILS
              </h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  ALBUM TYPE <span className="text-[#d97c55]">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                    <input type="radio" checked={albumType === "PHOTOS"} onChange={() => { setAlbumType("PHOTOS"); setYoutubeLink(""); }} className="accent-[#d97c55]" />
                    Photos
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                    <input type="radio" checked={albumType === "VIDEO"} onChange={() => { setAlbumType("VIDEO"); setPhotos([]); setPhotoPreviews([]); }} className="accent-[#d97c55]" />
                    YouTube Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  TOURNAMENT <span className="text-gray-400 lowercase font-mono">(optional)</span>
                </label>
                <select 
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value);
                    if (e.target.value) {
                      const selectedEv = events.find(ev => ev.id.toString() === e.target.value);
                      if (selectedEv && selectedEv.category) {
                        setCategory(selectedEv.category.toUpperCase().includes("TRIAL") ? "TRIAL" : selectedEv.category.toUpperCase().includes("WORKSHOP") ? "WORKSHOP" : selectedEv.category.toUpperCase().includes("FEDERATION") ? "FEDERATION" : "TOURNAMENT");
                      }
                    }
                  }}
                  className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#d97c55]"
                >
                  <option value="">Select a tournament...</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  ALBUM CATEGORY <span className="text-[#d97c55]">*</span>
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#d97c55]"
                  required
                >
                  <option value="TOURNAMENT">TOURNAMENT</option>
                  <option value="TRIAL">SELECTION TRIAL</option>
                  <option value="WORKSHOP">COACHING/REFEREE WORKSHOP</option>
                  <option value="FEDERATION">FEDERATION EVENT</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                    ALBUM TITLE <span className="text-[#d97c55]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                    EVENT DATE
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  ALBUM DESCRIPTION <span className="text-gray-400 lowercase font-mono">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#d97c55]"
                />
              </div>

              {albumType === "VIDEO" && (
                <div>
                  <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                    YOUTUBE VIDEO LINK <span className="text-[#d97c55]">*</span>
                  </label>
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    required={albumType === "VIDEO"}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#d97c55]"
                  />
                </div>
              )}
            </div>
          </section>

          {/* 02 PHOTOS */}
          {albumType === "PHOTOS" && (
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-dashed border-gray-200 pb-3">
              <span className="text-[10px] font-bold text-[#d97c55] font-mono">02</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827] flex items-center">
                PHOTOS <span className="text-[10px] text-gray-400 font-mono tracking-normal ml-3 lowercase font-normal">&middot; {photos.length} selected &middot; click a tile to set as cover</span>
              </h3>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-300 bg-[#fcfbf9] rounded-sm py-10 px-6 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-6"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 text-[#d97c55]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-2 font-heading">DROP PHOTOS HERE</div>
              <div className="text-[10px] text-gray-500 font-mono">or click to browse - JPG / PNG - max 8 MB each - up to 200 photos per album</div>
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {photoPreviews.map((src, i) => (
                  <div 
                    key={i} 
                    className={`relative aspect-square rounded-sm overflow-hidden bg-[#37485c] cursor-pointer flex flex-col justify-end p-2 border-2 ${coverIndex === i ? "border-[#d97c55]" : "border-transparent"}`}
                    onClick={() => setCoverIndex(i)}
                    style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b263b]/90 to-transparent"></div>
                    {coverIndex === i && (
                      <div className="absolute top-2 right-2 bg-[#d97c55] text-white px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase z-10">
                        COVER
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                      className="absolute top-2 left-2 bg-red-500 text-white w-5 h-5 rounded-sm flex items-center justify-center text-xs z-10 hover:bg-red-600"
                    >
                      &times;
                    </button>
                    <span className="text-[8px] text-white font-mono tracking-wider z-10 relative truncate">{photos[i].name}</span>
                  </div>
                ))}
              </div>
            )}
            
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </section>
          )}

          {/* 03 PUBLICATION */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-dashed border-gray-200 pb-3">
              <span className="text-[10px] font-bold text-[#d97c55] font-mono">03</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
                PUBLICATION
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  VISIBILITY
                </label>
                <select className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2 text-sm text-gray-800">
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest text-[#111827] uppercase mb-2 font-mono">
                  SHOW ON HOMEPAGE
                </label>
                <select className="w-full bg-[#fcfbf9] border border-gray-100 rounded-sm px-4 py-2 text-sm text-gray-800">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-between">
          <div className="text-[10px] text-gray-500 font-mono lowercase">
            {photos.length} photos &middot; ready to publish
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="border border-gray-300 bg-white text-gray-600 px-6 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#d97c55] text-white px-6 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase hover:bg-[#c16744] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm border border-[#c16744]"
            >
              <Check className="w-3.5 h-3.5" />
              {loading ? "PUBLISHING..." : "PUBLISH ALBUM"}
            </button>
          </div>
        </div>
      </form>

      {/* RECENT ALBUMS (DELETE SECTION) */}
      <div className="p-8 border-t border-gray-100 bg-[#fcfbf9] rounded-b-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-dashed border-gray-200 pb-3">
          <span className="text-[10px] font-bold text-[#d97c55] font-mono">04</span>
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#111827]">
            PUBLISHED ALBUMS
          </h3>
        </div>
        
        <div className="space-y-3">
          {albums.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-200 rounded">
              No albums have been published yet.
            </div>
          ) : (
            albums.map((album) => (
              <div key={album.id} className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded shadow-sm">
                <div className="flex items-center gap-4">
                  {album.cover_photo && (
                    <div 
                      className="w-12 h-12 rounded bg-gray-200"
                      style={{ backgroundImage: `url(${album.cover_photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  )}
                  {!album.cover_photo && album.youtube_link && (
                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-red-500">
                      ▶
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm text-[#111827]">{album.title}</div>
                    <div className="text-xs text-gray-500">{album.category} &middot; {album.photo_count > 0 ? `${album.photo_count} photos` : "Video"}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(album.id, album.title)}
                  disabled={deleting === album.id}
                  className="border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-colors"
                >
                  {deleting === album.id ? "DELETING..." : "DELETE"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
