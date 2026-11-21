import mongoose from "mongoose";
import multer from "multer";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Turns every error into `{ error: { message, details? } }` with the right
 * status. Unexpected errors are logged and hidden behind a generic message.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = 500;
  let message = "Something went wrong on our side.";
  let details;

  if (err instanceof ApiError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    status = 400;
    message = "Please fix the highlighted fields.";
    details = err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Please fix the highlighted fields.";
    details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err?.code === 11000) {
    status = 409;
    message = `Another record already uses this ${Object.keys(err.keyValue ?? {}).join(", ") || "value"}.`;
  } else if (err instanceof multer.MulterError) {
    status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "That file is too large." : `Upload error: ${err.message}`;
  } else if (err?.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON body.";
  } else if (err?.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large.";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ error: { message, ...(details && { details }) } });
}
