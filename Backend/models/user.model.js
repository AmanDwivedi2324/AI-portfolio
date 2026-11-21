import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

/** CRM admin account. Created only from the CLI (npm run admin:create). */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    /** Bumped on password change; tokens carrying an older version are rejected. */
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
};

userSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.tokenVersion;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
