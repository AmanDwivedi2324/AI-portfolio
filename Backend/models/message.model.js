import mongoose from "mongoose";

/** A message sent through the public contact form. */
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model("Message", messageSchema);
