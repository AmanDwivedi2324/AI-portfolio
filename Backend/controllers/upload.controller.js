import ApiError from "../utils/ApiError.js";
import { storeFile } from "../services/storage.service.js";
import {
  DOCUMENT_TYPES,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  fixFilenameEncoding,
  sniffMimeType,
} from "../middleware/upload.middleware.js";

// POST /api/admin/uploads?kind=image|document  (multipart field "file")
export async function uploadFile(req, res) {
  const { kind } = req.validQuery;
  const file = req.file;
  if (!file) throw ApiError.badRequest("Attach a file in the `file` field.");

  const realType = sniffMimeType(file.buffer);
  const allowed = kind === "image" ? IMAGE_TYPES : DOCUMENT_TYPES;
  if (!realType || !allowed.includes(realType) || realType !== file.mimetype) {
    throw ApiError.badRequest(
      kind === "image" ? "Upload a JPG, PNG, WebP or AVIF image." : "Upload a PDF document.",
    );
  }
  if (kind === "image" && file.size > MAX_IMAGE_BYTES) {
    throw ApiError.badRequest("Images must be 5 MB or smaller.");
  }

  const stored = await storeFile({ ...file, originalname: fixFilenameEncoding(file.originalname) }, kind);
  res.status(201).json({ ...stored, size: file.size, type: realType });
}
