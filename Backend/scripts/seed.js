/**
 * Load the initial portfolio content into MongoDB.
 *
 *   npm run seed           only fills collections that are empty
 *   npm run seed -- --force  replaces ALL content (not users or messages)
 */
import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import Profile from "../models/profile.model.js";
import Project from "../models/project.model.js";
import Skill from "../models/skill.model.js";
import Experience from "../models/experience.model.js";
import Education from "../models/education.model.js";
import ProcessStep from "../models/processStep.model.js";
import * as content from "../data/seedContent.js";

const force = process.argv.includes("--force");
const withOrder = (items) => items.map((item, i) => ({ ...item, order: i + 1 }));

const collections = [
  { Model: Profile, name: "profile", docs: [content.profile] },
  { Model: Project, name: "projects", docs: withOrder(content.projects) },
  { Model: Skill, name: "skills", docs: withOrder(content.skills) },
  { Model: Experience, name: "experience", docs: withOrder(content.experience) },
  { Model: Education, name: "education", docs: withOrder(content.education) },
  { Model: ProcessStep, name: "process steps", docs: withOrder(content.processSteps) },
];

try {
  await connectDB(env.MONGO_URI, env.MONGO_DB_NAME);
  for (const { Model, name, docs } of collections) {
    const existing = await Model.countDocuments();
    if (existing && !force) {
      console.log(`• ${name}: ${existing} already present — skipped (use --force to replace)`);
      continue;
    }
    if (existing) await Model.deleteMany({});
    await Model.create(docs);
    console.log(`✓ ${name}: ${docs.length} added`);
  }
} catch (error) {
  console.error("✖ Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
