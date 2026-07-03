import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";
import { handleImageUpload } from "./upload-router";
import { handleEnquiryImageUpload } from "./enquiry-upload-router";

const app = new Hono<{ Bindings: HttpBindings }>();

// Canonical host: 301 www.* to the bare domain. Both hosts currently resolve,
// and serving the full site on both makes Google see two duplicate sites —
// which dilutes site-name and ranking signals.
app.use(async (c, next) => {
  const host = c.req.header("host");
  if (host?.toLowerCase().startsWith("www.")) {
    const url = new URL(c.req.url);
    url.host = host.slice(4);
    url.protocol = "https:";
    return c.redirect(url.toString(), 301);
  }
  return next();
});

app.use(
  secureHeaders({
    // HSTS is ignored by browsers over plain http, so this is safe for
    // localhost previews and active on the https production domain.
    strictTransportSecurity: "max-age=31536000; includeSubDomains",
    xFrameOptions: "SAMEORIGIN",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
    },
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      // 'unsafe-inline' for styles: React/framer-motion inline style attributes.
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      // https: allows admin-configured external product image URLs.
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
    },
  }),
);

// Uploads: 8MB admin images / 5MB enquiry images + multipart overhead.
const uploadBodyLimit = bodyLimit({ maxSize: 12 * 1024 * 1024 });
// Everything else (tRPC JSON payloads) needs far less.
const defaultBodyLimit = bodyLimit({ maxSize: 1 * 1024 * 1024 });

app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.post("/api/upload-image", uploadBodyLimit, async (c) =>
  handleImageUpload(c.req.raw),
);
app.post("/api/upload-enquiry-image", uploadBodyLimit, async (c) =>
  handleEnquiryImageUpload(c.req.raw),
);
app.use("/api/trpc/*", defaultBodyLimit, async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { compress } = await import("hono/compress");
  const { serveStaticFiles } = await import("./lib/vite");
  // gzip text responses (HTML, JS, CSS, JSON, SVG); images are skipped.
  app.use(compress());
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
