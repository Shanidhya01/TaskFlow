import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Create JWT
export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

// Verify JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (err) {
    throw new Error("Invalid token");
  }
}
