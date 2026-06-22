import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { buildSitemapXml, injectSeo } from "./seo";

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
    "/logo-mark.svg",
    "/logo.svg",
    "/manifest.json",
  ]) {
    app.on(["GET", "HEAD"], file, serveStatic({ root: "./dist/public" }));
  }

  app.on(["GET", "HEAD"], "/sitemap.xml", async (c) => {
    c.header("Content-Type", "application/xml; charset=utf-8");
    return c.body(await buildSitemapXml());
  });

  // SPA fallback: every other GET/HEAD request returns the React app shell,
  // but with per-route <title>/description/canonical/OG tags injected so each
  // page has unique metadata for Google. React Router still renders the page.
  app.on(["GET", "HEAD"], "*", async (c) => {
    const pathname = new URL(c.req.url).pathname;
    if (path.extname(pathname)) {
      return c.notFound();
    }

    const result = await injectSeo(indexHtml, pathname);
    return result.status === 404
      ? c.html(result.html, 404)
      : c.html(result.html);
  });
}
