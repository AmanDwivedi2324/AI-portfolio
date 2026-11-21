import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export async function connectDB(uri) {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
