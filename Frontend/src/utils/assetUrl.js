const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/**
 * Resolve an image/file reference coming from the CRM:
 *  - "" → fallback (a bundled default)
 *  - absolute http(s) URL (Cloudinary) → as is
 *  - "/uploads/…" → served by the backend, so prefix the API origin
 *  - any other "/path" → served by this frontend (e.g. /resume/…)
 */
export function resolveAssetUrl(url, fallback = "") {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return url;
}
