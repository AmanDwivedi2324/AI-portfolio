import mongoose from "mongoose";

/**
 * A document (e.g. the résumé PDF) stored in MongoDB and served by the API at
 * /api/files/:id/:filename. Kept out of Cloudinary because free Cloudinary
 * accounts refuse to deliver PDFs until a console setting is changed.
 * Documents are capped at 10 MB by the upload middleware (Mongo's limit is 16 MB).
 */
const storedFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true }, // download name, e.g. "Aman_Dwivedi-Resume.pdf"
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, select: false },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("StoredFile", storedFileSchema);
