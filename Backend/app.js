import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { UPLOAD_DIR } from "./services/storage.service.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Render/Vercel proxies: real client IP for rate limits

app.use(
  helmet({
    // Uploaded images are embedded by the frontend on another origin.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || env.corsOrigins.includes(origin)),
    maxAge: 600,
  }),
);
app.use(express.json({ limit: "200kb" }));
if (!env.isTest) app.use(morgan(env.isProduction ? "combined" : "dev"));

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "30d", immutable: true, index: false }));

app.get("/", (_req, res) => res.json({ name: "portfolio-api", status: "ok" }));
app.use("/api", apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
