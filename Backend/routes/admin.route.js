import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { createCrudRouter } from "./crud.route.js";
import { invalidatePortfolioCache } from "../services/portfolio.service.js";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { deleteMessage, listMessages, updateMessage } from "../controllers/message.controller.js";
import { uploadFile } from "../controllers/upload.controller.js";
import { idParams } from "../validators/common.js";
import { profileUpdateSchema } from "../validators/profile.validator.js";
import { messageListQuery, messageUpdateSchema } from "../validators/message.validator.js";
import { uploadQuery } from "../validators/auth.validator.js";
import {
  educationSchema,
  experienceSchema,
  processStepSchema,
  projectSchema,
  skillSchema,
} from "../validators/content.validator.js";
import Project from "../models/project.model.js";
import Skill from "../models/skill.model.js";
import Experience from "../models/experience.model.js";
import Education from "../models/education.model.js";
import ProcessStep from "../models/processStep.model.js";

const router = Router();

// Every admin route needs a logged-in admin.
router.use(requireAuth);

// Any successful change clears the public portfolio cache.
router.use((req, res, next) => {
  if (req.method !== "GET") {
    res.on("finish", () => {
      if (res.statusCode < 400) invalidatePortfolioCache();
    });
  }
  next();
});

router.get("/dashboard", getDashboard);

router.get("/profile", getProfile);
router.put("/profile", validate({ body: profileUpdateSchema }), updateProfile);

router.use("/projects", createCrudRouter(Project, "Project", projectSchema));
router.use("/skills", createCrudRouter(Skill, "Skill", skillSchema));
router.use("/experience", createCrudRouter(Experience, "Experience", experienceSchema));
router.use("/education", createCrudRouter(Education, "Education", educationSchema));
router.use("/process", createCrudRouter(ProcessStep, "Process step", processStepSchema));

router.get("/messages", validate({ query: messageListQuery }), listMessages);
router.patch("/messages/:id", validate({ params: idParams, body: messageUpdateSchema }), updateMessage);
router.delete("/messages/:id", validate({ params: idParams }), deleteMessage);

router.post("/uploads", validate({ query: uploadQuery }), uploadSingle, uploadFile);

export default router;
