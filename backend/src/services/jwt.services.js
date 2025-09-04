import jwt from "jsonwebtoken";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export function signToken(payload, opts = {}) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || "1h",
    ...opts,
  });
}

export function verifyToken(token) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  return jwt.verify(token, JWT_SECRET);
}