// api/lib/seo.ts
// Per-route SEO meta injection for the SPA shell.
// The server reads dist/public/index.html once, then this module rewrites
// the <title>, description, canonical and OG/Twitter tags per URL path so
// Google can show distinct snippets (and build sitelinks) for each page.

const SITE = "https://jaosefagrosupplies.co.ke";
const BRAND = "Jaosef Agro Supplies";
const OG_IMAGE = `${SITE}/images/hero/hero-01-agro-shop-desktop.webp`;

type Meta = { title: string; description: string; path: string };

// Static routes. These are the pages that generate sitelinks, so each gets a
// unique, keyword-rich title + description. Includes the "Josef" misspelling
// naturally in copy so the page also ranks for that spelling.
const ROUTES: Record<string, Meta> = {
  "/": {
    title: `${BRAND} | Farm Inputs, Animal Feeds & Agro Products in Kenya`,
    description:
      "Jaosef Agro Supplies (Josef Agro Supplies) provides quality farm inputs in Kenya - seeds, fertilisers, crop protection, irrigation, animal feeds, poultry supplies, dairy equipment and farm tools. Nationwide delivery from Nairobi.",
    path: "/",
  },
  "/about": {
    title: `About Jaosef Agro Supplies | Agricultural Supply Shop in Kenya`,
    description:
      "Learn about Jaosef Agro Supplies, a Nairobi-based agribusiness supplying fertilisers, certified seed, crop protection, irrigation equipment and animal feeds to smallholder and commercial farms across Kenya.",
    path: "/about",
  },
  "/products": {
    title: `Products | Fertilisers, Seeds, Crop Protection & Animal Feeds - ${BRAND}`,
    description:
      "Browse the Jaosef Agro Supplies catalogue: fertilisers & crop nutrition (DAP, CAN, Urea, NPK), certified seeds, crop protection, irrigation, farm tools, livestock & poultry feeds, animal health and dairy equipment in Kenya.",
    path: "/products",
  },
  "/farming-tips": {
    title: `Farming Tips & Agronomy Advice in Kenya | ${BRAND}`,
    description:
      "Practical farming tips and agronomy guidance from Jaosef Agro Supplies - soil health, fertiliser use, crop protection, irrigation and livestock management for Kenyan farmers.",
    path: "/farming-tips",
  },
  "/contact": {
    title: `Contact Jaosef Agro Supplies | Farm Inputs in Kenya`,
    description:
      "Contact Jaosef Agro Supplies in Nairobi, Kenya. Call +254 746 804 727 or email jaosefagrosupplies@gmail.com for fertilisers, seeds, animal feeds and farm equipment enquiries.",
    path: "/contact",
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${BRAND}`,
    description: "Privacy policy for Jaosef Agro Supplies.",
    path: "/privacy-policy",
  },
  "/terms-disclaimer": {
    title: `Terms & Disclaimer | ${BRAND}`,
    description: "Terms of use and disclaimer for Jaosef Agro Supplies.",
    path: "/terms-disclaimer",
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function metaForPath(pathname: string): Meta {
  // Exact static match first.
  if (ROUTES[pathname]) return ROUTES[pathname];

  // Dynamic detail pages get a sensible, page-specific default. (To make these
  // fully dynamic, look up the product/tip by id from the DB and build the
  // title from its name - see README_SEO.md.)
  if (pathname.startsWith("/products/")) {
    return {
      title: `Product Details | ${BRAND}`,
      description:
        "View product details from the Jaosef Agro Supplies catalogue of farm inputs, fertilisers, seeds, crop protection and animal feeds in Kenya.",
      path: pathname,
    };
  }
  if (pathname.startsWith("/farming-tips/")) {
    return {
      title: `Farming Tip | ${BRAND}`,
      description:
        "Read farming tips and agronomy advice from Jaosef Agro Supplies for Kenyan farmers.",
      path: pathname,
    };
  }

  // Fallback to homepage meta.
  return ROUTES["/"];
}

/**
 * Rewrites the SPA index.html with route-specific SEO tags.
 * @param indexHtml the raw built index.html
 * @param pathname  request path, e.g. "/about"
 */
export function injectSeo(indexHtml: string, pathname: string): string {
  const m = metaForPath(pathname);
  const title = escapeHtml(m.title);
  const desc = escapeHtml(m.description);
  const canonical = `${SITE}${m.path === "/" ? "/" : m.path}`;

  let html = indexHtml;

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${desc}" />`,
  );

  // canonical
  html = html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  // Open Graph
  html = html
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${desc}" />`,
    )
    .replace(
      /<meta\s+property="og:url"[\s\S]*?\/>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="og:image"[\s\S]*?\/>/,
      `<meta property="og:image" content="${OG_IMAGE}" />`,
    );

  // Twitter
  html = html
    .replace(
      /<meta\s+name="twitter:title"[\s\S]*?\/>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${desc}" />`,
    );

  return html;
}
