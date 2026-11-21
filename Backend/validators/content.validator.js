import { z } from "zod";
import { orderableFields, requiredText, stringList, text, urlOrPath } from "./common.js";

/* Create schemas. Update routes use `.partial()` of the same schema. */

export const projectSchema = z.strictObject({
  title: requiredText(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(80)
    .refine((v) => v === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v), "Use lowercase letters, numbers and hyphens")
    .transform((v) => v || undefined)
    .optional(),
  client: text(120).optional(),
  category: requiredText(40),
  summary: requiredText(600),
  highlights: stringList(10, 300).optional(),
  techStack: stringList(20, 40).optional(),
  pipeline: stringList(8, 24).optional(),
  imageUrl: urlOrPath.optional(),
  links: z
    .strictObject({
      github: urlOrPath.optional(),
      live: urlOrPath.optional(),
      docs: urlOrPath.optional(),
    })
    .optional(),
  featured: z.boolean().optional(),
  ...orderableFields,
});

export const skillSchema = z.strictObject({
  name: requiredText(60),
  category: requiredText(60),
  icon: z
    .string()
    .trim()
    .max(40)
    .regex(/^[a-z0-9-]*$/, "Icon keys are lowercase letters and numbers")
    .optional(),
  featured: z.boolean().optional(),
  ...orderableFields,
});

export const experienceSchema = z.strictObject({
  company: requiredText(100),
  role: requiredText(100),
  location: text(100).optional(),
  startDate: requiredText(30),
  endDate: text(30).optional(),
  current: z.boolean().optional(),
  highlights: stringList(10, 400).optional(),
  ...orderableFields,
});

export const educationSchema = z.strictObject({
  institution: requiredText(150),
  degree: requiredText(150),
  location: text(100).optional(),
  startDate: text(30).optional(),
  endDate: text(30).optional(),
  score: text(40).optional(),
  ...orderableFields,
});

export const processStepSchema = z.strictObject({
  title: requiredText(80),
  description: requiredText(300),
  ...orderableFields,
});
