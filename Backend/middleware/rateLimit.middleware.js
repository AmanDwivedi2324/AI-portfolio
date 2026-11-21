import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";

const limiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit: env.isTest ? 10_000 : limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: { message } },
  });

/** Brute-force protection for the admin login. */
export const loginLimiter = limiter(15 * 60_000, 10, "Too many login attempts. Please try again in 15 minutes.");

/** Spam protection for the public contact form. */
export const contactLimiter = limiter(60 * 60_000, 5, "Too many messages from this network. Please try again later.");

/** General ceiling for the whole API. */
export const apiLimiter = limiter(60_000, 300, "Too many requests. Please slow down.");
