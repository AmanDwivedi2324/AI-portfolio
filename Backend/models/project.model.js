import mongoose from "mongoose";
import orderablePlugin from "./plugins/orderable.plugin.js";
import slugify from "../utils/slugify.js";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    client: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 600 },
    highlights: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    /** Steps shown in the card's animated pipeline preview. */
    pipeline: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },
    links: {
      github: { type: String, default: "" },
      live: { type: String, default: "" },
      docs: { type: String, default: "" },
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectSchema.plugin(orderablePlugin);

projectSchema.pre("validate", function setSlug() {
  if (!this.slug && this.title) this.slug = slugify(this.title);
});

export default mongoose.model("Project", projectSchema);
