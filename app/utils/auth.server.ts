// app/utils/auth.server.ts
import bcrypt from "bcryptjs";

/**
 * Hash a plain password.
 * @param password - The user's plain password
 * @returns The hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain password with a hash.
 * @param password - The user's plain password
 * @param hash - The hashed password from the DB
 * @returns True if match, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
