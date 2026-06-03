import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${HASH_PREFIX}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [prefix, salt, hash] = storedHash.split(":");
  if (prefix !== HASH_PREFIX || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
