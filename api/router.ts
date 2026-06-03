import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { tipRouter } from "./tip-router";
import { enquiryRouter } from "./enquiry-router";
import { siteContentRouter } from "./site-content-router";
import { adminSecurityRouter } from "./admin-security-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  tip: tipRouter,
  enquiry: enquiryRouter,
  siteContent: siteContentRouter,
  adminSecurity: adminSecurityRouter,
});

export type AppRouter = typeof appRouter;
