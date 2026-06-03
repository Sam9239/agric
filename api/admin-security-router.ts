import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import {
  clearAdminTotpSecret,
  getAdminTotpSecret,
  getAdminTotpStatus,
  setAdminTotpSecret,
} from "./admin-security";
import { createTotpUri, generateTotpSecret, verifyTotpToken } from "./lib/totp";

export const adminSecurityRouter = createRouter({
  status: adminQuery.query(async () => getAdminTotpStatus()),

  setupTotp: adminQuery.mutation(() => {
    const secret = generateTotpSecret();
    return {
      secret,
      uri: createTotpUri({
        secret,
        account: "admin",
        issuer: "Jaosef Agro Supplies",
      }),
    };
  }),

  enableTotp: adminQuery
    .input(z.object({ secret: z.string().min(1), code: z.string().min(6) }))
    .mutation(async ({ input }) => {
      if (!verifyTotpToken(input.code, input.secret)) {
        return { success: false };
      }

      await setAdminTotpSecret(input.secret);
      return { success: true };
    }),

  disableTotp: adminQuery
    .input(z.object({ code: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const status = await getAdminTotpStatus();
      if (status.managedByEnv) {
        return { success: false, managedByEnv: true };
      }

      const secret = await getAdminTotpSecret();
      if (!secret || !verifyTotpToken(input.code, secret)) {
        return { success: false };
      }

      await clearAdminTotpSecret();
      return { success: true };
    }),
});
