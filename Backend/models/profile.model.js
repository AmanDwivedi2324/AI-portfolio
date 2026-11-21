import mongoose from "mongoose";

const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
    index: { type: String, default: "" },
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    /** Rendered in red after the title. */
    accent: { type: String, default: "" },
  },
  { _id: false },
);

/**
 * Site-wide content: identity, hero, contact details, socials, stats, the
 * quote card and section headings. There is exactly one profile document.
 * Empty image/resume URLs make the site fall back to its bundled defaults.
 */
const profileSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    roleLine: { type: String, default: "" },
    eyebrow: { type: String, default: "" },
    greeting: { type: String, default: "Hi, I'm" },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    status: {
      label: { type: String, default: "Now" },
      text: { type: String, default: "" },
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    showPhone: { type: Boolean, default: false },
    focus: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    portraitUrl: { type: String, default: "" },
    secondaryPhotoUrl: { type: String, default: "" },
    socials: [
      new Schema({
        platform: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
      }),
    ],
    stats: [
      new Schema({
        value: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
      }),
    ],
    quote: {
      text: { type: String, default: "" },
      author: { type: String, default: "" },
    },
    sections: {
      work: { type: sectionSchema, default: () => ({}) },
      about: { type: sectionSchema, default: () => ({}) },
      journey: { type: sectionSchema, default: () => ({}) },
      contact: { type: sectionSchema, default: () => ({}) },
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("Profile", profileSchema);
