import mongoose from "mongoose";
import orderablePlugin from "./plugins/orderable.plugin.js";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, trim: true, default: "" },
    /** Display dates, e.g. "Nov 2026". Order is controlled by `order`. */
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, trim: true, default: "" },
    current: { type: Boolean, default: false },
    /** Bullet points. Wrap numbers in **double asterisks** to highlight them. */
    highlights: { type: [String], default: [] },
  },
  { timestamps: true },
);

experienceSchema.plugin(orderablePlugin);

export default mongoose.model("Experience", experienceSchema);
