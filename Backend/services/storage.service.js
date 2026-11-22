import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

/** "Aman Résumé (final).pdf" → "Aman_Resume_final" (safe for URLs and file systems). */
export function safeBaseName(originalName = "") {
  const base = path
    .parse(originalName)
    .name.normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "")
    .slice(0, 60);
  return base || "file";
}

/**
 * Cloudinary options for an upload.
 * Documents (PDFs) are stored as "raw" files, which Cloudinary names only by
 * their public_id — so the extension must be part of it. Without ".pdf" the
 * download arrives as an extension-less file the OS cannot open.
 */
export function cloudinaryUploadOptions(file, kind) {
  if (kind === "image") {
    return { folder: env.CLOUDINARY_FOLDER, resource_type: "image" };
  }
  const suffix = crypto.randomBytes(3).toString("hex");
  return {
    folder: env.CLOUDINARY_FOLDER,
    resource_type: "raw",
    public_id: `${safeBaseName(file.originalname)}-${suffix}${EXTENSIONS[file.mimetype] ?? ""}`,
  };
}

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => (error ? reject(error) : resolve(result)));
    stream.end(buffer);
  });

/**
 * Store an uploaded file and return its public URL.
 * Uses Cloudinary when configured, otherwise the local `public/uploads`
 * folder (served at /uploads). Stored names are generated; only a cleaned-up
 * version of the original name is kept for documents, so downloads look right.
 *
 * @param {{ buffer: Buffer, mimetype: string, originalname?: string }} file
 * @param {"image" | "document"} kind
 */
export async function storeFile(file, kind) {
  if (env.cloudinaryEnabled) {
    const result = await uploadToCloudinary(file.buffer, cloudinaryUploadOptions(file, kind));
    return { url: result.secure_url, storage: "cloudinary" };
  }

  const ext = EXTENSIONS[file.mimetype] ?? "";
  const name =
    kind === "image"
      ? `${Date.now()}-${crypto.randomUUID()}${ext}`
      : `${safeBaseName(file.originalname)}-${crypto.randomBytes(3).toString("hex")}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), file.buffer);
  return { url: `/uploads/${name}`, storage: "local" };
}
