import crypto from "node:crypto";
// convert password to hash
export function hashUserPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return hashedPassword.toString("hex") + ":" + salt;
}
// check if password is correct when user logs in
export function verifyPassword(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split(":");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
