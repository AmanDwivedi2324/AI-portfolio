import Profile from "../models/profile.model.js";
import Project from "../models/project.model.js";
import Skill from "../models/skill.model.js";
import Experience from "../models/experience.model.js";
import Education from "../models/education.model.js";
import ProcessStep from "../models/processStep.model.js";

const CACHE_TTL_MS = 60_000;
let cache = null;
let cachedAt = 0;

/** Called after any successful admin write so the site shows changes at once. */
export function invalidatePortfolioCache() {
  cache = null;
}

const PUBLIC_FIELDS = "-createdAt -updatedAt -__v -visible";
const visibleSorted = (Model) =>
  Model.find({ visible: { $ne: false } })
    .sort({ order: 1, createdAt: 1 })
    .select(PUBLIC_FIELDS)
    .lean();

/**
 * Everything the public site renders, in one payload shaped exactly like
 * the frontend's content file. `profile` is null until the DB is seeded.
 */
export async function getPublicPortfolio() {
  if (cache && Date.now() - cachedAt < CACHE_TTL_MS) return cache;

  const [profileDoc, projects, skills, experience, education, process] = await Promise.all([
    Profile.findOne().select("-createdAt -updatedAt").lean(),
    visibleSorted(Project),
    visibleSorted(Skill),
    visibleSorted(Experience),
    visibleSorted(Education),
    visibleSorted(ProcessStep),
  ]);

  let profile = null;
  let sections = null;
  let quote = null;
  if (profileDoc) {
    ({ sections, quote, ...profile } = profileDoc);
    delete profile._id;
    if (!profile.showPhone) delete profile.phone;
  }

  cache = { profile, sections, quote, projects, skills, experience, education, process };
  cachedAt = Date.now();
  return cache;
}
