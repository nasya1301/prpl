import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access-secret";
const ACCESS_EXPIRY = "15m"; // adjust as needed

export function generateAccessToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

export async function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET)
}
