import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { signToken } from "../services/token.service.js";

const INVALID_LOGIN = "Incorrect username or password.";
// Compared against when the username does not exist, so a wrong username and
// a wrong password take the same time (no username probing).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

// POST /api/auth/login
export async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+passwordHash");

  const ok = user ? await user.checkPassword(password) : await bcrypt.compare(password, DUMMY_HASH);
  if (!user || !ok) throw ApiError.unauthorized(INVALID_LOGIN);

  user.lastLoginAt = new Date();
  await user.save();
  res.json({ token: signToken(user), user: user.toJSON() });
}

// GET /api/auth/me
export function me(req, res) {
  res.json({ user: req.user.toJSON() });
}

// PUT /api/auth/password — also signs out every other session
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+passwordHash");

  if (!(await user.checkPassword(currentPassword))) {
    throw ApiError.badRequest("Your current password is incorrect.", [
      { path: "currentPassword", message: "Incorrect password" },
    ]);
  }

  await user.setPassword(newPassword);
  user.tokenVersion += 1;
  await user.save();
  res.json({ token: signToken(user), user: user.toJSON() });
}
