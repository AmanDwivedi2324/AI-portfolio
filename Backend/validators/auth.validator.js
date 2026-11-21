import { z } from "zod";

export const loginSchema = z.strictObject({
  username: z.string().trim().toLowerCase().min(1, "Username is required").max(60),
  password: z.string().min(1, "Password is required").max(200),
});

export const PASSWORD_MIN = 10;

export const changePasswordSchema = z.strictObject({
  currentPassword: z.string().min(1, "Enter your current password").max(200),
  newPassword: z.string().min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`).max(200),
});

export const uploadQuery = z.object({
  kind: z.enum(["image", "document"]).default("image"),
});
