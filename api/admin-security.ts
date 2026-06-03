import { eq } from "drizzle-orm";
import { adminSecurity } from "@db/schema";
import { env } from "./lib/env";
import { getDb } from "./queries/connection";
import { hasDatabase } from "./demo-data";

let demoTotpSecret = "";

export async function getAdminTotpSecret() {
  const storedSecret = await getStoredAdminTotpSecret();
  return storedSecret || env.adminTotpSecret;
}

export async function getAdminTotpStatus() {
  const storedSecret = await getStoredAdminTotpSecret();
  return {
    enabled: Boolean(storedSecret || env.adminTotpSecret),
    managedByEnv: Boolean(env.adminTotpSecret && !storedSecret),
  };
}

export async function setAdminTotpSecret(secret: string) {
  if (!hasDatabase()) {
    demoTotpSecret = secret;
    return;
  }

  const db = getDb();
  const rows = await db.select().from(adminSecurity).limit(1);
  if (rows.length === 0) {
    await db.insert(adminSecurity).values({ totpSecret: secret });
  } else {
    await db
      .update(adminSecurity)
      .set({ totpSecret: secret })
      .where(eq(adminSecurity.id, rows[0].id));
  }
}

export async function clearAdminTotpSecret() {
  if (!hasDatabase()) {
    demoTotpSecret = "";
    return;
  }

  const db = getDb();
  const rows = await db.select().from(adminSecurity).limit(1);
  if (rows.length === 0) return;

  await db
    .update(adminSecurity)
    .set({ totpSecret: null })
    .where(eq(adminSecurity.id, rows[0].id));
}

async function getStoredAdminTotpSecret() {
  if (!hasDatabase()) {
    return demoTotpSecret;
  }

  const db = getDb();
  const rows = await db.select().from(adminSecurity).limit(1);
  return rows[0]?.totpSecret || "";
}
