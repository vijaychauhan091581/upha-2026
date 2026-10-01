"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AlbumData, listAlbums } from "@/lib/api";
import { Image as ImageIcon, Search, X, ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";

function getYouTubeThumbnail(url: string) {
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<AlbumData | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    listAlbums()
      .then((res) => {
        if (res.success) setAlbums(res.albums);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPhotos = albums.reduce((acc, album) => acc + album.photo_count, 0);
  const latestAlbum = albums.length > 0 ? albums[0] : null;
  const latestDateStr = latestAlbum?.date
    ? new Date(latestAlbum.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

  const albumsByCat = albums.reduce((acc, a) => {
    const cat = (a.category || a.event?.category || "OTHER").toUpperCase();
    if (cat.includes("TOURNAMENT")) acc["TOURNAMENT"] = (acc["TOURNAMENT"] || 0) + 1;
    else if (cat.includes("TRIAL")) acc["TRIAL"] = (acc["TRIAL"] || 0) + 1;
    else if (cat.includes("WORKSHOP")) acc["WORKSHOP"] = (acc["WORKSHOP"] || 0) + 1;
    else if (cat.includes("FEDERATION")) acc["FEDERATION"] = (acc["FEDERATION"] || 0) + 1;
    else acc["OTHER"] = (acc["OTHER"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = ["ALL", "TOURNAMENTS", "TRIALS", "WORKSHOPS", "FEDERATION EVENTS"];

  const filteredAlbums = albums
    .filter((a) => {
      const eventCat = (a.category || a.event?.category || "OTHER").toUpperCase();
      if (filter === "ALL") return true;
      if (filter === "TOURNAMENTS" && eventCat.includes("TOURNAMENT")) return true;
      if (filter === "TRIALS" && eventCat.includes("TRIAL")) return true;
      if (filter === "WORKSHOPS" && eventCat.includes("WORKSHOP")) return true;
      if (filter === "FEDERATION EVENTS" && eventCat.includes("FEDERATION")) return true;
      return false;
    })
    .filter((a) => {
      const searchMatch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.event?.location?.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch;
    });

  // Only albums that have a visible cover photo or video (for lightbox cycling)
  const photoAlbums = filteredAlbums.filter(
    (a) => (a.cover_photo || a.youtube_link) && !imageErrors[a.id]
  );

  const openLightbox = (filteredIdx: number) => {
    const album = filteredAlbums[filteredIdx];

    // Fallback to cover_photo if the backend hasn't been updated to return the 'photos' array yet
    const photos = album.photos && album.photos.length > 0
      ? album.photos
      : (album.cover_photo ? [album.cover_photo] : []);

    if (photos.length === 0 && !album.youtube_link) return;

    setActiveAlbum({ ...album, photos });
    setLightboxIndex(0);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveAlbum(null);
    document.body.style.overflow = "";
  };

  const lightboxPrev = useCallback(() => {
    if (!activeAlbum || !activeAlbum.photos) return;
    setLightboxIndex((i) => (i - 1 + activeAlbum.photos.length) % activeAlbum.photos.length);
  }, [activeAlbum]);

  const lightboxNext = useCallback(() => {
    if (!activeAlbum || !activeAlbum.photos) return;
    setLightboxIndex((i) => (i + 1) % activeAlbum.photos.length);
  }, [activeAlbum]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // lightboxAlbum removed since we use activeAlbum directly

  return (
    <div className="flex-1 flex flex-col bg-[#fcfbf9] w-full">

      {/* ── LIGHTBOX POPUP ── */}
      {lightboxOpen && activeAlbum && (
        <div
          className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          {!activeAlbum.youtube_link && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/50 text-[11px] font-mono tracking-widest select-none">
              {lightboxIndex + 1} / {activeAlbum.photos.length}
            </div>
          )}

          {/* Prev arrow */}
          {activeAlbum.photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next arrow */}
          {activeAlbum.photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image/Video + caption */}
          <div
            className="flex flex-col items-center gap-5 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {activeAlbum.youtube_link ? (
              <div className="w-full max-w-5xl aspect-video bg-black rounded-sm shadow-2xl overflow-hidden mt-8 md:mt-0" style={{ width: '85vw', maxWidth: '1000px' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeAlbum.youtube_link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/)?.[1]}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <img
                src={activeAlbum.photos[lightboxIndex]}
                alt={activeAlbum.title}
                className="max-w-[88vw] max-h-[76vh] w-auto h-auto object-contain rounded-sm shadow-2xl select-none"
                draggable={false}
              />
            )}
            {/* Caption */}
            <div className="text-center">
              <div className="text-white font-heading font-bold uppercase tracking-wider text-xl">
                {activeAlbum.title}
              </div>
              <div className="flex items-center justify-center gap-3 text-white/40 text-[10px] font-mono tracking-widest uppercase mt-2">
                {(activeAlbum.category || activeAlbum.event?.category) && (
                  <span className="bg-[#d97c55]/30 text-[#d97c55] px-2 py-0.5 rounded-sm">
                    {activeAlbum.category || activeAlbum.event?.category}
                  </span>
                )}
                {activeAlbum.event?.location && (
                  <><span>·</span><span>{activeAlbum.event.location}</span></>
                )}
                {activeAlbum.date && (
                  <>
                    <span>·</span>
                    <span>
                      {new Date(activeAlbum.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </>
                )}
                {!activeAlbum.youtube_link && (
                  <>
                    <span>·</span>
                    <span>{activeAlbum.photos.length} photos</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-[#111827] text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-4">
            HOME / GALLERY
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-wide mb-6">
            PHOTO <span className="text-accent">GALLERY</span>
          </h1>
          <p className="text-gray-400 font-serif italic text-lg max-w-2xl mb-12">
            Moments captured from tournaments, selection trials, workshops, and
            association events across Uttar Pradesh — the U.P. handball season in pictures.
          </p>

          <div className="flex flex-wrap gap-12 border-t border-gray-800 pt-8">
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">TOTAL ALBUMS</div>
              <div className="font-bold font-mono text-xl">{albums.length}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">TOTAL PHOTOS</div>
              <div className="font-bold font-mono text-xl">{totalPhotos}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">LATEST ALBUM</div>
              <div className="font-bold font-mono text-xl">{latestDateStr.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">SEASONS COVERED</div>
              <div className="font-bold font-mono text-xl">2024 - 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="border-b border-gray-200 bg-white relative z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              let count = 0;
              if (cat === "ALL") count = albums.length;
              else if (cat === "TOURNAMENTS") count = albumsByCat["TOURNAMENT"] || 0;
              else if (cat === "TRIALS") count = albumsByCat["TRIAL"] || 0;
              else if (cat === "WORKSHOPS") count = albumsByCat["WORKSHOP"] || 0;
              else if (cat === "FEDERATION EVENTS") count = albumsByCat["FEDERATION"] || 0;

              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${isActive
                      ? "bg-[#111827] text-white"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {cat}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[8px] ${isActive ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tournaments, year, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfbf9] border border-gray-200 rounded-sm pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-accent text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-[#111827]">
            2025 - <span className="text-accent">2026 SEASON</span>
          </h2>
          <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            SHOWING {filteredAlbums.length} ALBUMS &middot;{" "}
            {filteredAlbums.reduce((acc, a) => acc + a.photo_count, 0)} PHOTOS
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-sm h-[320px]"></div>
            ))}
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="text-center py-32 text-gray-500 border border-dashed border-gray-300 rounded bg-white min-h-[300px] flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <div className="text-sm font-bold text-[#111827] mb-1">No albums found</div>
            <div className="text-xs">Try adjusting your filters or search query.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album, filteredIdx) => {
              const displayCat = album.event?.category || "Federation";
              let catColor = "bg-accent";
              if (displayCat.toLowerCase() === "trial") catColor = "bg-emerald-600";
              else if (displayCat.toLowerCase() === "workshop") catColor = "bg-amber-600";
              else if (displayCat.toLowerCase() === "federation") catColor = "bg-[#111827]";

              const formattedDate = album.date
                ? new Date(album.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "TBD";

              const hasContent = (album.cover_photo || album.youtube_link) && !imageErrors[album.id];
              const displayImage = album.cover_photo || (album.youtube_link ? getYouTubeThumbnail(album.youtube_link) : null);

              return (
                <div
                  key={album.id}
                  className={`bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden group flex flex-col transition-colors ${hasContent
                      ? "cursor-pointer hover:border-accent"
                      : "cursor-default"
                    }`}
                  onClick={() => hasContent && openLightbox(filteredIdx)}
                >
                  {/* Image Area */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {displayImage ? (
                      <>
                        <img
                          src={displayImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [album.id]: true }))
                          }
                        />
                        {/* Hover zoom overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            {album.youtube_link ? <Play className="w-6 h-6 text-white ml-1" /> : <ZoomIn className="w-6 h-6 text-white" />}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}

                    {/* Category badge */}
                    <div
                      className={`absolute top-4 left-4 ${catColor} text-white px-2 py-1 text-[8px] font-bold tracking-widest uppercase rounded-sm`}
                    >
                      {displayCat}
                    </div>

                    {/* Photo count badge */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 text-[9px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-1.5">
                      {album.youtube_link ? (
                        <>
                          <Play className="w-3 h-3" />
                          VIDEO
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3" />
                          {album.photo_count} PHOTOS
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-[#111827] line-clamp-2 leading-tight">
                      {album.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-4 text-[9px] font-bold tracking-widest uppercase text-gray-500">
                      <span className="text-accent">{displayCat}</span>
                      <span>&middot;</span>
                      <span>{formattedDate}</span>
                      {album.event?.location && (
                        <>
                          <span>&middot;</span>
                          <span className="truncate">{album.event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
