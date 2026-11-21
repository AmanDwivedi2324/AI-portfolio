import { Router } from "express";
import authRoutes from "./auth.route.js";
import adminRoutes from "./admin.route.js";
import { getPortfolio } from "../controllers/portfolio.controller.js";
import { createMessage } from "../controllers/message.controller.js";
import { contactLimiter } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { contactMessageSchema } from "../validators/message.validator.js";

/** Everything under /api. */
const router = Router();

// Public
router.get("/health", (_req, res) => res.json({ status: "ok", uptime: Math.round(process.uptime()) }));
router.get("/portfolio", getPortfolio);
router.post("/contact", contactLimiter, validate({ body: contactMessageSchema }), createMessage);

// Auth + CRM
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
