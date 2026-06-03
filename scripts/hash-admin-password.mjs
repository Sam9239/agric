import { randomBytes, scryptSync } from "crypto";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";

const rl = createInterface({ input, output });

try {
  const password = await rl.question("Admin password to hash: ");
  if (!password.trim()) {
    throw new Error("Password cannot be empty");
  }

  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);
} finally {
  rl.close();
}
