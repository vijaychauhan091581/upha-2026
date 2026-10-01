/**
 * Fetches an image URL and returns it as a base64 data URL.
 * This is used to bypass CORS restrictions when generating ID card images.
 * For same-origin images (e.g. /upha.png), it fetches directly.
 * For cross-origin backend images, it routes through our API proxy.
 */
export async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    let fetchUrl = url;

    // If it's a backend image (cross-origin), proxy through our API
    const backendBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api").replace("/api", "");
    if (url.startsWith(backendBase) || (!url.startsWith("http") && !url.startsWith("data:"))) {
      // Relative URL, prefix with backend base
      if (!url.startsWith("http") && !url.startsWith("data:")) {
        fetchUrl = `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
      }
      // Route through proxy to avoid CORS
      const path = new URL(fetchUrl).pathname;
      fetchUrl = `/api/image-proxy?url=${encodeURIComponent(fetchUrl)}`;
    }

    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("fetchImageAsBase64 failed for", url, err);
    return "";
  }
}

/**
 * Converts a local image path (e.g. /upha.png) to an absolute URL using window.location.origin
 */
export function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  if (path.startsWith("http")) return path;
  return window.location.origin + (path.startsWith("/") ? "" : "/") + path;
}

/**
 * Gets the full backend URL for a media file path.
 */
export function getBackendMediaUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api").replace("/api", "");
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}
