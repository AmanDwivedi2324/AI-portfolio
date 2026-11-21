import Project from "../models/project.model.js";
import Skill from "../models/skill.model.js";
import Experience from "../models/experience.model.js";
import Education from "../models/education.model.js";
import ProcessStep from "../models/processStep.model.js";
import Message from "../models/message.model.js";
import Profile from "../models/profile.model.js";

// GET /api/admin/dashboard
export async function getDashboard(_req, res) {
  const [projects, skills, experience, education, process, messages, unread, recentMessages, profile] =
    await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      ProcessStep.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Profile.findOne().select("updatedAt").lean(),
    ]);

  res.json({
    counts: { projects, skills, experience, education, process, messages, unread },
    recentMessages,
    profileUpdatedAt: profile?.updatedAt ?? null,
  });
}
