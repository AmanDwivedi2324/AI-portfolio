import multer from "multer";
import ApiError from "../utils/ApiError.js";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const DOCUMENT_TYPES = ["application/pdf"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

/** Single file in the `file` field, kept in memory for the storage service. */
export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ([...IMAGE_TYPES, ...DOCUMENT_TYPES].includes(file.mimetype)) cb(null, true);
    else cb(ApiError.badRequest("Only JPG, PNG, WebP or AVIF images and PDF files are allowed"));
  },
}).single("file");

/**
 * Multer decodes file names as Latin-1, so "Résumé.pdf" arrives as
 * "RÃ©sumÃ©.pdf". Re-decode as UTF-8 when that produces valid text.
 */
export function fixFilenameEncoding(name = "") {
  const decoded = Buffer.from(name, "latin1").toString("utf8");
  return decoded.includes("�") ? name : decoded;
}

/**
 * Detect the real file type from its first bytes — the mimetype sent by the
 * browser can be faked.
 */
export function sniffMimeType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  const hex = buffer.subarray(0, 4).toString("hex");
  if (hex.startsWith("ffd8ff")) return "image/jpeg";
  if (hex === "89504e47") return "image/png";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }
  if (buffer.subarray(4, 12).toString("ascii").startsWith("ftypavi")) return "image/avif";
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  return null;
}
