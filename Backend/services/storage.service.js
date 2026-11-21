import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const uploadToCloudinary = (buffer, { resourceType }) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: env.CLOUDINARY_FOLDER, resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(buffer);
  });

/**
 * Store an uploaded file and return its public URL.
 * Uses Cloudinary when configured, otherwise the local `public/uploads`
 * folder (served at /uploads). File names are generated, never taken from
 * the client.
 *
 * @param {{ buffer: Buffer, mimetype: string }} file
 * @param {"image" | "document"} kind
 */
export async function storeFile(file, kind) {
  if (env.cloudinaryEnabled) {
    // PDFs go up as "raw" so free Cloudinary accounts still deliver them.
    const result = await uploadToCloudinary(file.buffer, { resourceType: kind === "image" ? "image" : "raw" });
    return { url: result.secure_url, storage: "cloudinary" };
  }

  const ext = EXTENSIONS[file.mimetype] ?? "";
  const name = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), file.buffer);
  return { url: `/uploads/${name}`, storage: "local" };
}

export const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};
