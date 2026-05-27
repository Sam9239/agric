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

export const authRouter = createRouter({
  adminLogin: publicQuery
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.password !== env.adminPassword) {
        return { success: false };
      }

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
