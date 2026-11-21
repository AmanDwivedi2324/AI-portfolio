import "dotenv/config";
import { z } from "zod";

/**
 * Validated environment. The server refuses to start with a missing or weak
 * setting instead of failing later at request time.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters (generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\")"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  CORS_ORIGINS: z.string().default("http://localhost:5173,http://127.0.0.1:5173"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default("portfolio"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n✖ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nSee .env.example for every setting.\n");
  process.exit(1);
}

const raw = parsed.data;

export const env = Object.freeze({
  ...raw,
  isProduction: raw.NODE_ENV === "production",
  isTest: raw.NODE_ENV === "test",
  corsOrigins: raw.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  cloudinaryEnabled: Boolean(raw.CLOUDINARY_CLOUD_NAME && raw.CLOUDINARY_API_KEY && raw.CLOUDINARY_API_SECRET),
});

if (env.isProduction && !env.cloudinaryEnabled) {
  console.warn(
    "⚠ Cloudinary is not configured: uploads will be written to local disk, which is wiped on every redeploy of most hosts (e.g. Render).",
  );
}
