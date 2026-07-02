import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { buildSitemapXml, injectSeo } from "./seo";

type App = Hono<{ Bindings: HttpBindings }>;

function cacheControl(value: string) {
  return async (
    c: { header: (name: string, value: string) => void },
    next: () => Promise<void>,
  ) => {
    await next();
    c.header("Cache-Control", value);
  };
}

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  const indexPath = path.resolve(distPath, "index.html");
  const indexHtml = fs.readFileSync(indexPath, "utf-8");

  // User-uploaded files (live outside dist/); filenames are unique per upload.
  app.use(
    "/uploads/*",
    cacheControl("public, max-age=604800"),
    serveStatic({ root: "." }),
  );

  // Vite emits content-hashed filenames under /assets — safe to cache forever.
  app.use(
    "/assets/*",
    cacheControl("public, max-age=31536000, immutable"),
    serveStatic({ root: "./dist/public" }),
  );
  app.use(
    "/images/*",
    cacheControl("public, max-age=604800, stale-while-revalidate=86400"),
    serveStatic({ root: "./dist/public" }),
  );

  // Root-level files that ship with the build
  for (const file of [
    "/favicon.svg",
    "/favicon.ico",
    "/robots.txt",
    "/logo-mark.svg",
    "/logo.svg",
    "/manifest.json",
    "/apple-touch-icon.png",
    "/icon-192.png",
    "/icon-512.png",
  ]) {
    app.on(
      ["GET", "HEAD"],
      file,
      cacheControl("public, max-age=86400"),
      serveStatic({ root: "./dist/public" }),
    );
  }

  app.on(["GET", "HEAD"], "/sitemap.xml", async (c) => {
    c.header("Content-Type", "application/xml; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600");
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

    // HTML must always revalidate so fresh SEO/meta and new deploys are
    // picked up immediately.
    c.header("Cache-Control", "no-cache");
    const result = await injectSeo(indexHtml, pathname);
    return result.status === 404
      ? c.html(result.html, 404)
      : c.html(result.html);
  });
}
