import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ISSUER = "portfolio-api";

/** Sign an admin session token. `ver` ties it to the user's tokenVersion. */
export function signToken(user) {
  return jwt.sign({ ver: user.tokenVersion }, env.JWT_SECRET, {
    subject: user.id,
    issuer: ISSUER,
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/** Returns the payload, or throws if the token is invalid or expired. */
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"], issuer: ISSUER });
}
