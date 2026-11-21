import { z } from "zod";

export const contactMessageSchema = z.strictObject({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email").max(200),
  message: z.string().trim().min(10, "A few more words, please (10+ characters)").max(5000),
  /** Honeypot: hidden field real visitors leave empty. */
  website: z.string().max(200).optional(),
});

export const messageUpdateSchema = z.strictObject({
  read: z.boolean(),
});

export const messageListQuery = z.object({
  status: z.enum(["all", "unread", "read"]).default("all"),
});
