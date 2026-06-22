// Per-route SEO meta injection for the SPA shell.
// Googlebot receives route-specific titles, descriptions, canonicals, and JSON-LD
// before React hydrates, which helps a React site avoid generic snippets.

import { eq } from "drizzle-orm";
import { farmingTips, products } from "@db/schema";
import {
  productCategories,
  type CatalogueProduct,
  type ProductCategory,
} from "@contracts/product-catalog";
import {
  brandName,
  categoryLandings,
  categoryPath,
  categorySlugToKey,
  siteUrl,
} from "@contracts/seo-content";
import { demoProducts, demoTips, hasDatabase } from "../demo-data";
import { getDb } from "../queries/connection";

const OG_IMAGE = `${siteUrl}/images/hero/hero-01-agro-shop-desktop.webp`;
const today = () => new Date().toISOString().slice(0, 10);

type Meta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  robots?: "index, follow" | "noindex, follow";
  schema?: unknown[];
};

type SeoPayload = {
  html: string;
  status: 200 | 404;
};

type SeoProduct = Pick<
  CatalogueProduct,
  | "id"
  | "name"
  | "category"
  | "shortDescription"
  | "description"
  | "imageUrl"
  | "createdAt"
  | "updatedAt"
>;

type SeoTip = {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

function staticRoutes(): Record<string, Meta> {
  return {
    "/": {
      title: `${brandName} | Farm Inputs in Kenya`,
      description:
        "Jaosef Agro Supplies (Josef Agro Supplies) provides quality farm inputs in Kenya, including seeds, fertilisers, crop protection, irrigation, animal feeds, poultry supplies, dairy equipment and farm tools.",
      path: "/",
    },
    "/about": {
      title: `About ${brandName} | Nairobi Agrovet`,
      description:
        "Learn about Jaosef Agro Supplies, a Nairobi-based agribusiness supplying fertilisers, certified seed, crop protection, irrigation equipment, animal feeds, poultry supplies and dairy equipment across Kenya.",
      path: "/about",
      schema: [breadcrumbSchema(["Home", "About"], ["/", "/about"])],
    },
    "/services": {
      title: `Services | ${brandName}`,
      description:
        "Jaosef Agro Supplies supports Kenyan farmers with farm input supply, crop nutrition guidance, crop protection guidance, livestock feeds, poultry supplies, dairy equipment, irrigation and farmer enquiry support.",
      path: "/services",
      schema: [breadcrumbSchema(["Home", "Services"], ["/", "/services"])],
    },
    "/products": {
      title: `Farm Inputs & Agro Products in Kenya | ${brandName}`,
      description:
        "Browse fertilisers, certified seeds, crop protection, irrigation supplies, livestock feeds, animal health products, poultry supplies, dairy equipment and farm tools from Jaosef Agro Supplies.",
      path: "/products",
      schema: [breadcrumbSchema(["Home", "Products"], ["/", "/products"])],
    },
    "/farming-tips": {
      title: `Farming Tips for Kenyan Farmers | ${brandName}`,
      description:
        "Read practical farming tips from Jaosef Agro Supplies for Kenyan crop and livestock farmers, including soil health, fertiliser use, crop protection, poultry, dairy and safe input use.",
      path: "/farming-tips",
      type: "article",
      schema: [breadcrumbSchema(["Home", "Farming Tips"], ["/", "/farming-tips"])],
    },
    "/contact": {
      title: `Contact ${brandName} | Farm Inputs in Kenya`,
      description:
        "Contact Jaosef Agro Supplies in Nairobi, Kenya. Call +254 746 804 727 or email jaosefagrosupplies@gmail.com for farm inputs, fertilisers, seeds, animal feeds and farm equipment enquiries.",
      path: "/contact",
      schema: [breadcrumbSchema(["Home", "Contact"], ["/", "/contact"])],
    },
    "/privacy-policy": {
      title: `Privacy Policy | ${brandName}`,
      description: "Privacy policy for Jaosef Agro Supplies.",
      path: "/privacy-policy",
      schema: [
        breadcrumbSchema(["Home", "Privacy Policy"], ["/", "/privacy-policy"]),
      ],
    },
    "/terms-disclaimer": {
      title: `Terms & Disclaimer | ${brandName}`,
      description: "Terms of use and disclaimer for Jaosef Agro Supplies.",
      path: "/terms-disclaimer",
      schema: [
        breadcrumbSchema(["Home", "Terms & Disclaimer"], ["/", "/terms-disclaimer"]),
      ],
    },
  };
}

function cleanPath(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function truncate(value: string, max = 155): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trim()}...`;
}

function breadcrumbSchema(names: string[], paths: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: names.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(paths[index] ?? "/"),
    })),
  };
}

function notFoundMeta(pathname: string): Meta {
  return {
    title: `Page Not Found | ${brandName}`,
    description:
      "The page you requested could not be found. Visit Jaosef Agro Supplies for farm inputs, products, services, farming tips and contact details.",
    path: pathname,
    robots: "noindex, follow",
  };
}

async function productById(id: number): Promise<SeoProduct | null> {
  if (!hasDatabase()) {
    return demoProducts.find((product) => product.id === id) ?? null;
  }

  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      category: row.category,
      shortDescription: row.shortDescription || row.description,
      description: row.description,
      imageUrl: row.imageUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  } catch {
    return demoProducts.find((product) => product.id === id) ?? null;
  }
}

async function tipById(id: number): Promise<SeoTip | null> {
  if (!hasDatabase()) {
    return demoTips.find((tip) => tip.id === id) ?? null;
  }

  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(farmingTips)
      .where(eq(farmingTips.id, id))
      .limit(1);

    return row ?? null;
  } catch {
    return demoTips.find((tip) => tip.id === id) ?? null;
  }
}

async function allProducts(): Promise<SeoProduct[]> {
  if (!hasDatabase()) return demoProducts;

  try {
    const db = getDb();
    const rows = await db.select().from(products);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      shortDescription: row.shortDescription || row.description,
      description: row.description,
      imageUrl: row.imageUrl,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  } catch {
    return demoProducts;
  }
}

async function allTips(): Promise<SeoTip[]> {
  if (!hasDatabase()) return demoTips;

  try {
    const db = getDb();
    return db.select().from(farmingTips);
  } catch {
    return demoTips;
  }
}

async function metaForPath(rawPathname: string): Promise<{ meta: Meta; status: 200 | 404 }> {
  const pathname = cleanPath(rawPathname);
  const routes = staticRoutes();

  if (routes[pathname]) {
    return { meta: routes[pathname], status: 200 };
  }

  if (pathname.startsWith("/admin")) {
    return {
      meta: {
        title: `Admin | ${brandName}`,
        description: "Admin area for Jaosef Agro Supplies.",
        path: pathname,
        robots: "noindex, follow",
      },
      status: 200,
    };
  }

  const categoryMatch = pathname.match(/^\/products\/([^/]+)$/);
  if (categoryMatch) {
    const segment = categoryMatch[1];
    const category = categorySlugToKey[segment];
    if (category) {
      const landing = categoryLandings[category];
      return {
        meta: {
          title: landing.seoTitle,
          description: landing.seoDescription,
          path: categoryPath(category),
          schema: [
            breadcrumbSchema(
              ["Home", "Products", landing.title],
              ["/", "/products", categoryPath(category)],
            ),
          ],
        },
        status: 200,
      };
    }

    if (/^\d+$/.test(segment)) {
      const product = await productById(Number(segment));
      if (product) {
        const categoryName = productCategories[product.category];
        return {
          meta: {
            title: `${product.name} | ${brandName}`,
            description: truncate(
              `${product.shortDescription || product.description} Enquire from Jaosef Agro Supplies for current availability and product guidance in Kenya.`,
            ),
            path: `/products/${product.id}`,
            image: product.imageUrl,
            schema: [
              breadcrumbSchema(
                ["Home", "Products", categoryName, product.name],
                [
                  "/",
                  "/products",
                  categoryPath(product.category),
                  `/products/${product.id}`,
                ],
              ),
            ],
          },
          status: 200,
        };
      }
    }

    return { meta: notFoundMeta(pathname), status: 404 };
  }

  const tipMatch = pathname.match(/^\/farming-tips\/(\d+)$/);
  if (tipMatch) {
    const tip = await tipById(Number(tipMatch[1]));
    if (tip) {
      return {
        meta: {
          title: `${tip.title} | ${brandName}`,
          description: truncate(
            `${tip.excerpt} Read practical farming guidance for Kenyan farmers from Jaosef Agro Supplies.`,
          ),
          path: `/farming-tips/${tip.id}`,
          image: tip.imageUrl,
          type: "article",
          schema: [
            breadcrumbSchema(
              ["Home", "Farming Tips", tip.title],
              ["/", "/farming-tips", `/farming-tips/${tip.id}`],
            ),
          ],
        },
        status: 200,
      };
    }

    return { meta: notFoundMeta(pathname), status: 404 };
  }

  return { meta: notFoundMeta(pathname), status: 404 };
}

function replaceOrInsert(
  html: string,
  pattern: RegExp,
  replacement: string,
  before = "</head>",
): string {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace(before, `    ${replacement}\n  ${before}`);
}

function schemaTags(schema: unknown[] | undefined): string {
  if (!schema?.length) return "";
  return schema
    .map(
      (item) =>
        `    <script type="application/ld+json" data-seo-server="true">${JSON.stringify(item)}</script>`,
    )
    .join("\n");
}

export async function injectSeo(indexHtml: string, pathname: string): Promise<SeoPayload> {
  const { meta, status } = await metaForPath(pathname);
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.description);
  const canonical = absoluteUrl(meta.path === "/" ? "/" : meta.path);
  const image = absoluteUrl(meta.image ?? OG_IMAGE);
  const robots = meta.robots ?? "index, follow";
  const type = meta.type ?? "website";

  let html = indexHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceOrInsert(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${desc}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="robots"[\s\S]*?\/>/,
    `<meta name="robots" content="${robots}" />`,
  );
  html = replaceOrInsert(
    html,
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  html = replaceOrInsert(
    html,
    /<meta\s+property="og:type"[\s\S]*?\/>/,
    `<meta property="og:type" content="${type}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${desc}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:image"[\s\S]*?\/>/,
    `<meta property="og:image" content="${image}" />`,
  );

  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${desc}" />`,
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:image"[\s\S]*?\/>/,
    `<meta name="twitter:image" content="${image}" />`,
  );

  const tags = schemaTags(meta.schema);
  if (tags) {
    html = html.replace("</head>", `${tags}\n  </head>`);
  }

  return { html, status };
}

function sitemapUrl(loc: string, lastmod: string, image?: string): string {
  const imageTag = image
    ? `
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(image))}</image:loc>
    </image:image>`
    : "";

  return `  <url>
    <loc>${escapeXml(absoluteUrl(loc))}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>${imageTag}
  </url>`;
}

function dateFrom(value: Date | string | null | undefined): string {
  if (!value) return today();
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return today();
  return date.toISOString().slice(0, 10);
}

export async function buildSitemapXml(): Promise<string> {
  const lastmod = today();
  const urls: string[] = [
    sitemapUrl("/", lastmod, "/images/hero/hero-01-agro-shop-desktop.webp"),
    sitemapUrl("/about", lastmod, "/images/about.webp"),
    sitemapUrl("/services", lastmod, "/images/hero/hero-01-agro-shop-desktop.webp"),
    sitemapUrl("/products", lastmod, "/images/hero/hero-01-agro-shop-desktop.webp"),
    ...Object.keys(categoryLandings).map((category) =>
      sitemapUrl(categoryPath(category as ProductCategory), lastmod),
    ),
    sitemapUrl("/farming-tips", lastmod, "/images/tip-3.webp"),
    sitemapUrl("/contact", lastmod),
    sitemapUrl("/privacy-policy", lastmod),
    sitemapUrl("/terms-disclaimer", lastmod),
  ];

  const [productRows, tipRows] = await Promise.all([allProducts(), allTips()]);

  for (const product of productRows) {
    urls.push(
      sitemapUrl(
        `/products/${product.id}`,
        dateFrom(product.updatedAt ?? product.createdAt),
        product.imageUrl,
      ),
    );
  }

  for (const tip of tipRows) {
    urls.push(
      sitemapUrl(
        `/farming-tips/${tip.id}`,
        dateFrom(tip.updatedAt ?? tip.createdAt),
        tip.imageUrl,
      ),
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;
}
