import mongoose from "mongoose";
import orderablePlugin from "./plugins/orderable.plugin.js";

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true, maxlength: 150 },
    degree: { type: String, required: true, trim: true, maxlength: 150 },
    location: { type: String, trim: true, default: "" },
    startDate: { type: String, trim: true, default: "" },
    endDate: { type: String, trim: true, default: "" },
    score: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

educationSchema.plugin(orderablePlugin);

export default mongoose.model("Education", educationSchema);
