import mongoose from "mongoose";
import orderablePlugin from "./plugins/orderable.plugin.js";

/** One step of the "How I build an agent" timeline. */
const processStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { timestamps: true },
);

processStepSchema.plugin(orderablePlugin);

export default mongoose.model("ProcessStep", processStepSchema);
