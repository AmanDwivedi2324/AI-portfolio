/**
 * Create the CRM admin, or reset an existing admin's password.
 * Resetting signs out every existing session.
 *
 *   npm run admin:create -- --username aman           (asks for the password, hidden)
 *   npm run admin:create -- --username aman --password "a long passphrase"
 *
 * ADMIN_USERNAME / ADMIN_PASSWORD in the environment work too.
 * The database is the one in MONGO_URI (+ MONGO_DB_NAME) — i.e. production
 * when your .env points at Atlas.
 */
import readline from "node:readline";
import { parseArgs } from "node:util";
import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import User from "../models/user.model.js";
import { PASSWORD_MIN } from "../validators/auth.validator.js";

// allowPositionals: Windows PowerShell drops npm's `--`, so `--username`
// may be swallowed and only the name arrives. Accept it either way.
const { values, positionals } = parseArgs({
  options: { username: { type: "string" }, password: { type: "string" } },
  allowPositionals: true,
});
values.username ??= positionals[0];

/** Ask a question without echoing what is typed (shows * instead). */
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (text) => {
      if (!muted) rl.output.write(text);
      else if (text.includes("\n") || text.includes("\r")) rl.output.write("\n");
      else rl.output.write("*".repeat(text.length));
    };
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    muted = true;
  });
}

async function readPassword() {
  if (values.password ?? process.env.ADMIN_PASSWORD) return values.password ?? process.env.ADMIN_PASSWORD;
  if (!process.stdin.isTTY) return "";
  for (;;) {
    const first = await askHidden(`New password (at least ${PASSWORD_MIN} characters): `);
    if (first.length < PASSWORD_MIN) {
      console.log(`  Too short — use at least ${PASSWORD_MIN} characters.`);
      continue;
    }
    const second = await askHidden("Type it again: ");
    if (first === second) return first;
    console.log("  The two passwords don't match — try again.");
  }
}

const username = (values.username ?? process.env.ADMIN_USERNAME ?? "").trim().toLowerCase();
if (!username) {
  console.error("Usage: npm run admin:create -- --username <name>   (you'll be asked for the password)");
  process.exit(1);
}

const password = await readPassword();
if (password.length < PASSWORD_MIN) {
  console.error(`The password must be at least ${PASSWORD_MIN} characters.`);
  process.exit(1);
}

try {
  await connectDB(env.MONGO_URI, env.MONGO_DB_NAME);
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
