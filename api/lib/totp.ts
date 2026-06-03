import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;
const DIGITS = 6;

export function generateTotpSecret() {
  return base32Encode(randomBytes(20));
}

export function createTotpUri({
  secret,
  account,
  issuer,
}: {
  secret: string;
  account: string;
  issuer: string;
}) {
  const label = `${issuer}:${account}`;
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(STEP_SECONDS),
  });
  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`;
}

export function verifyTotpToken(token: string, secret: string) {
  const normalisedToken = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalisedToken)) return false;

  const currentCounter = Math.floor(Date.now() / 1000 / STEP_SECONDS);
  for (const offset of [-1, 0, 1]) {
    const expected = generateTotpToken(secret, currentCounter + offset);
    if (safeStringEqual(normalisedToken, expected)) return true;
  }

  return false;
}

function generateTotpToken(secret: string, counter: number) {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));

  const hmac = createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(code % 10 ** DIGITS).padStart(DIGITS, "0");
}

function base32Encode(buffer: Buffer) {
  let bits = "";
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, "0");
  }

  let output = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, "0");
    output += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return output;
}

function base32Decode(secret: string) {
  const cleaned = secret.toUpperCase().replace(/=|\s|-/g, "");
  let bits = "";

  for (const char of cleaned) {
    const value = BASE32_ALPHABET.indexOf(char);
    if (value < 0) {
      throw new Error("Invalid TOTP secret");
    }
    bits += value.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function safeStringEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
