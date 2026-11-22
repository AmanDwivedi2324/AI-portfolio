import StoredFile from "../models/storedFile.model.js";
import ApiError from "../utils/ApiError.js";

// GET /api/files/:id/:name — public download of a stored document (e.g. the résumé).
// The name segment is only for nicer URLs; the id decides which file is served.
export async function downloadFile(req, res) {
  const file = await StoredFile.findById(req.params.id).select("+data");
  if (!file) throw ApiError.notFound("File not found");

  const asciiName = file.filename.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  res.set({
    "Content-Type": file.mimetype,
    "Content-Length": String(file.data.length),
    // "attachment" makes browsers save it as a proper .pdf instead of a nameless file.
    "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
    // Each upload gets a new id, so a given URL never changes content.
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  res.send(file.data);
}
