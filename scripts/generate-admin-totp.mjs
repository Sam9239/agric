import { randomBytes } from "crypto";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer) {
  let bits = "";
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, "0");
  }

  let output = "";
  for (let i = 0; i < bits.length; i += 5) {
    output += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
  }
  return output;
}

const issuer = "Jaosef Agro Supplies";
const account = "admin";
const secret = base32Encode(randomBytes(20));
const params = new URLSearchParams({
  secret,
  issuer,
  algorithm: "SHA1",
  digits: "6",
  period: "30",
});

console.log(`ADMIN_TOTP_SECRET=${secret}`);
console.log("");
console.log("Manual setup key:");
console.log(secret);
console.log("");
console.log("Authenticator URI:");
console.log(`otpauth://totp/${encodeURIComponent(`${issuer}:${account}`)}?${params.toString()}`);
