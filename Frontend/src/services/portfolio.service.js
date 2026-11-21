import apiClient from "./apiClient";
import bundled from "../data/portfolio.data";
import { resolveAssetUrl } from "../utils/assetUrl";

const CACHE_KEY = "portfolio.content.v1";
/** Free hosting can take ~40 s to wake up; don't keep visitors waiting that long. */
const API_TIMEOUT_MS = 8000;

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

/**
 * Make CRM data safe to render: resolve uploaded file URLs, fall back to the
 * bundled photos/résumé when a URL is empty, and fill any missing pieces.
 */
function normalize(data) {
  const profile = {
    ...bundled.profile,
    ...data.profile,
    status: { ...bundled.profile.status, ...data.profile?.status },
    socials: data.profile?.socials ?? bundled.profile.socials,
    stats: data.profile?.stats ?? bundled.profile.stats,
  };
  profile.portraitUrl = resolveAssetUrl(data.profile?.portraitUrl, bundled.profile.portraitUrl);
  profile.secondaryPhotoUrl = resolveAssetUrl(data.profile?.secondaryPhotoUrl, bundled.profile.secondaryPhotoUrl);
  profile.resumeUrl = resolveAssetUrl(data.profile?.resumeUrl, bundled.profile.resumeUrl);

  const sections = Object.fromEntries(
    Object.entries(bundled.sections).map(([key, value]) => [key, { ...value, ...data.sections?.[key] }]),
  );

  return {
    profile,
    sections,
    quote: data.quote?.text ? data.quote : bundled.quote,
    projects: (data.projects ?? [])
      .map((p) => ({
        ...p,
        slug: p.slug ?? p._id,
        category: p.category ?? "Projects",
        summary: p.summary ?? p.description ?? "",
        techStack: p.techStack ?? [],
        pipeline: p.pipeline ?? [],
        highlights: p.highlights ?? [],
        links: { ...p.links },
        imageUrl: resolveAssetUrl(p.imageUrl),
      }))
      .sort(byOrder),
    skills: [...(data.skills ?? [])].sort(byOrder),
    experience: (data.experience ?? []).map((e) => ({ ...e, highlights: e.highlights ?? [] })).sort(byOrder),
    education: [...(data.education ?? [])].sort(byOrder),
    process: [...(data.process ?? [])].sort(byOrder),
  };
}

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};
const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked — not important */
  }
};

/**
 * Content for the public site.
 * 1. live from the CRM API
 * 2. if the API is down or slow: the last copy this browser received
 * 3. otherwise: the snapshot bundled with the site (src/data/portfolio.data.js)
 */
export async function getPortfolio() {
  try {
    const { data } = await apiClient.get("/api/portfolio", { timeout: API_TIMEOUT_MS });
    if (!data?.profile) throw new Error("the CRM has no profile yet (run `npm run seed` in Backend)");
    writeCache(data);
    return { ...normalize(data), source: "api" };
  } catch (error) {
    console.warn(`[portfolio] Using fallback content: ${error.message}`);
    const cached = readCache();
    if (cached?.profile) return { ...normalize(cached), source: "cache" };
    return { ...normalize(bundled), source: "bundled" };
  }
}
