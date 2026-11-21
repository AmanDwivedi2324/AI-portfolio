import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../services/token.service.js";

const SESSION_EXPIRED = "Your session has expired. Please log in again.";

/** Require a valid `Authorization: Bearer <token>` for an existing admin. */
export async function requireAuth(req, _res, next) {
  const [scheme, token] = (req.get("authorization") ?? "").split(" ");
  if (scheme !== "Bearer" || !token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized(SESSION_EXPIRED);
  }

  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.ver) throw ApiError.unauthorized(SESSION_EXPIRED);

  req.user = user;
  next();
}
