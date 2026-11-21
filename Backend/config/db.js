import mongoose from "mongoose";

mongoose.set("strictQuery", true);

/**
 * Connect to MongoDB. `dbName` (MONGO_DB_NAME) picks the database inside the
 * cluster, so the same Atlas URI can serve several apps or environments.
 */
export async function connectDB(uri, dbName) {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000, ...(dbName && { dbName }) });
  console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
