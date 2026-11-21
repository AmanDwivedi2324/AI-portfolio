/**
 * Create the CRM admin, or reset an existing admin's password.
 * Resetting signs out every existing session.
 *
 *   npm run admin:create -- --username aman --password "a long passphrase"
 *
 * Or set ADMIN_USERNAME / ADMIN_PASSWORD in the environment instead of flags.
 */
import { parseArgs } from "node:util";
import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import User from "../models/user.model.js";
import { PASSWORD_MIN } from "../validators/auth.validator.js";

const { values } = parseArgs({
  options: { username: { type: "string" }, password: { type: "string" } },
});

const username = (values.username ?? process.env.ADMIN_USERNAME ?? "").trim().toLowerCase();
const password = values.password ?? process.env.ADMIN_PASSWORD ?? "";

if (!username || password.length < PASSWORD_MIN) {
  console.error(`Usage: npm run admin:create -- --username <name> --password "<at least ${PASSWORD_MIN} characters>"`);
  process.exit(1);
}

try {
  await connectDB(env.MONGO_URI);
  let user = await User.findOne({ username });
  const isNew = !user;
  user ??= new User({ username });
  await user.setPassword(password);
  if (!isNew) user.tokenVersion += 1;
  await user.save();
  console.log(isNew ? `✓ Admin "${username}" created.` : `✓ Password reset for "${username}" (other sessions signed out).`);
} catch (error) {
  console.error("✖ Could not save admin:", error.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
