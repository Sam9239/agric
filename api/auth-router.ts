import * as cookie from "cookie";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { env } from "./lib/env";
import {
  adminSessionCookie,
  clearAdminSessionCookie,
  createAdminSessionToken,
} from "./admin-session";
import {
  checkAdminLoginRateLimit,
  clearAdminLoginRateLimit,
  getClientIp,
  recordFailedAdminLogin,
} from "./lib/rate-limit";
import { verifyPassword } from "./lib/password";
import { verifyTotpToken } from "./lib/totp";
import { getAdminTotpSecret } from "./admin-security";

export const authRouter = createRouter({
  adminLogin: publicQuery
    .input(z.object({ password: z.string().min(1), totpCode: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.req.headers);
      const rateLimit = checkAdminLoginRateLimit(ip);
      if (!rateLimit.allowed) {
        return { success: false, retryAfterSeconds: rateLimit.retryAfterSeconds };
      }

      const passwordMatches = env.adminPasswordHash
        ? verifyPassword(input.password, env.adminPasswordHash)
        : input.password === env.adminPassword;

      if (!passwordMatches) {
        recordFailedAdminLogin(ip);
        return { success: false };
      }

      const adminTotpSecret = await getAdminTotpSecret();
      if (adminTotpSecret && !verifyTotpToken(input.totpCode ?? "", adminTotpSecret)) {
        recordFailedAdminLogin(ip);
        return { success: false, requiresTotp: true };
      }

      clearAdminLoginRateLimit(ip);
      const token = await createAdminSessionToken();
      ctx.resHeaders.append("set-cookie", adminSessionCookie(token));
      return { success: true };
    }),
  adminMe: publicQuery.query(({ ctx }) => ({
    authenticated: ctx.adminAuthenticated,
  })),
  adminLogout: publicQuery.mutation(({ ctx }) => {
    ctx.resHeaders.append("set-cookie", clearAdminSessionCookie());
    return { success: true };
  }),
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
