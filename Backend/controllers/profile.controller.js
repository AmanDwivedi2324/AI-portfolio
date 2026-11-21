import Profile from "../models/profile.model.js";
import ApiError from "../utils/ApiError.js";

// GET /api/admin/profile
export async function getProfile(_req, res) {
  const profile = await Profile.findOne();
  if (!profile) throw ApiError.notFound("No profile yet. Run `npm run seed` or save the form to create one.");
  res.json(profile);
}

// PUT /api/admin/profile — creates the single profile document if missing
export async function updateProfile(req, res) {
  const profile = (await Profile.findOne()) ?? new Profile();
  profile.set(req.body);
  await profile.save();
  res.json(profile);
}
