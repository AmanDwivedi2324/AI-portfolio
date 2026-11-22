import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import StoredFile from "../models/storedFile.model.js";

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

/** Cloudinary options for an image upload. */
export function cloudinaryUploadOptions() {
  return { folder: env.CLOUDINARY_FOLDER, resource_type: "image" };
}

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => (error ? reject(error) : resolve(result)));
    stream.end(buffer);
  });

/** Save a document in MongoDB; returns its API path (/api/files/<id>/<name>.pdf). */
export async function storeDocument({ buffer, mimetype, originalname }) {
  const filename = `${safeBaseName(originalname)}${EXTENSIONS[mimetype] ?? ""}`;
  const doc = await StoredFile.create({ filename, mimetype, size: buffer.length, data: buffer });
  return { url: `/api/files/${doc.id}/${encodeURIComponent(filename)}`, storage: "database" };
}

/**
 * Store an uploaded file and return its public URL.
 * - Documents (PDFs) → MongoDB, served by GET /api/files/:id/:name as a real
 *   PDF download with its original (cleaned-up) name.
 * - Images → Cloudinary when configured, otherwise `public/uploads` (served at /uploads).
 *
 * @param {{ buffer: Buffer, mimetype: string, originalname?: string }} file
 * @param {"image" | "document"} kind
 */
export async function storeFile(file, kind) {
  if (kind === "document") return storeDocument(file);

  if (env.cloudinaryEnabled) {
    const result = await uploadToCloudinary(file.buffer, cloudinaryUploadOptions());
    return { url: result.secure_url, storage: "cloudinary" };
  }

  const name = `${Date.now()}-${crypto.randomUUID()}${EXTENSIONS[file.mimetype] ?? ""}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), file.buffer);
  return { url: `/uploads/${name}`, storage: "local" };
}
