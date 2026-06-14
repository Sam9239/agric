import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { injectSeo } from "./seo";

type App = Hono<{ Bindings: HttpBindings }>;

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  const indexPath = path.resolve(distPath, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf-8");

  // User-uploaded files (live outside dist/)
  app.use("/uploads/*", serveStatic({ root: "." }));

  // Built static assets and image directories
  app.use("/assets/*", serveStatic({ root: "./dist/public" }));
  app.use("/images/*", serveStatic({ root: "./dist/public" }));

  // Root-level files that ship with the build
  for (const file of [
    "/favicon.svg",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/logo-mark.svg",
    "/logo.svg",
    "/manifest.json",
  ]) {
    app.on(["GET", "HEAD"], file, serveStatic({ root: "./dist/public" }));
  }

  // SPA fallback: every other GET/HEAD request returns the React app shell,
  // but with per-route <title>/description/canonical/OG tags injected so each
  // page has unique metadata for Google. React Router still renders the page.
  app.on(["GET", "HEAD"], "*", (c) => {
    const pathname = new URL(c.req.url).pathname;
    return c.html(injectSeo(indexHtml, pathname));
  });
}
