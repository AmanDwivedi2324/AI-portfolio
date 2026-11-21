import { Router } from "express";
import { changePassword, login, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { loginLimiter } from "../middleware/rateLimit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { changePasswordSchema, loginSchema } from "../validators/auth.validator.js";

// There is deliberately no /register route: admins are created from the CLI.
const router = Router();

router.post("/login", loginLimiter, validate({ body: loginSchema }), login);
router.get("/me", requireAuth, me);
router.put("/password", requireAuth, loginLimiter, validate({ body: changePasswordSchema }), changePassword);

export default router;
