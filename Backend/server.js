import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import app from "./app.js";

try {
  await connectDB(env.MONGO_URI, env.MONGO_DB_NAME);
} catch (error) {
  console.error(`✖ Could not connect to MongoDB: ${error.message}`);
  process.exit(1);
}

const server = app.listen(env.PORT, () => {
  console.log(`✓ API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  console.log(`  uploads → ${env.cloudinaryEnabled ? "Cloudinary" : "local disk (public/uploads)"}`);
});

function shutdown(signal) {
  console.log(`${signal} received — shutting down`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));
