import { z } from "zod";
import { objectId, requiredText, text, urlOrPath } from "./common.js";

const section = z.strictObject({
  index: text(4),
  label: text(40),
  title: text(80),
  accent: text(60),
});

/** Profile updates: every field optional, unknown fields rejected. */
export const profileUpdateSchema = z
  .strictObject({
    firstName: requiredText(40),
    lastName: requiredText(40),
    role: text(60),
    roleLine: text(100),
    eyebrow: text(80),
    greeting: text(30),
    tagline: text(300),
    bio: text(800),
    location: text(80),
    status: z.strictObject({ label: text(20), text: text(120) }),
    email: z.email("Enter a valid email").max(200),
    phone: text(30),
    showPhone: z.boolean(),
    focus: text(80),
    resumeUrl: urlOrPath,
    portraitUrl: urlOrPath,
    secondaryPhotoUrl: urlOrPath,
    socials: z
      .array(
        z.strictObject({
          _id: objectId.optional(),
          platform: requiredText(30),
          label: requiredText(30),
          url: urlOrPath.refine((v) => v !== "", "Required"),
        }),
      )
      .max(10),
    stats: z
      .array(
        z.strictObject({
          _id: objectId.optional(),
          value: requiredText(10),
          label: requiredText(60),
        }),
      )
      .max(6),
    quote: z.strictObject({ text: text(200), author: text(60) }),
    sections: z.strictObject({
      work: section,
      about: section,
      journey: section,
      contact: section,
    }),
  })
  .partial();
