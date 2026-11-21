import mongoose from "mongoose";
import orderablePlugin from "./plugins/orderable.plugin.js";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    /** Key into the frontend icon registry (e.g. "python"); empty = no icon. */
    icon: { type: String, trim: true, default: "" },
    /** Featured skills appear in the scrolling tools strip. */
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

skillSchema.plugin(orderablePlugin);

export default mongoose.model("Skill", skillSchema);
