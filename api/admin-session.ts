import * as cookie from "cookie";
import * as jose from "jose";
import { env } from "./lib/env";

const ADMIN_COOKIE = "jaosef_admin";
const ADMIN_ALG = "HS256";
const MAX_AGE_SECONDS = 24 * 60 * 60;

function adminSecret() {
  return new TextEncoder().encode(env.appSecret || "jaosef-local-admin-session");
}

export async function createAdminSessionToken() {
  return new jose.SignJWT({ admin: true })
    .setProtectedHeader({ alg: ADMIN_ALG })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(adminSecret());
}

export async function verifyAdminSession(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[ADMIN_COOKIE];
  if (!token) return false;

  try {
    const { payload } = await jose.jwtVerify(token, adminSecret(), {
      algorithms: [ADMIN_ALG],
    });
    return payload.admin === true;
  } catch {
    return false;
  }
}

export function adminSessionCookie(token: string) {
  return cookie.serialize(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie() {
  return cookie.serialize(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: 0,
  });
}
