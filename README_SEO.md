# SEO Setup - Jaosef Agro Supplies

## What changed in the code (already done)

| File | Change | Why |
|------|--------|-----|
| `api/lib/seo.ts` (NEW) | Per-route title/description/canonical/OG map | Each page gets unique metadata - enables sitelinks |
| `api/lib/vite.ts` (EDITED) | SPA fallback now injects SEO per URL | Serves the right meta for `/about`, `/products`, etc. |
| `index.html` (EDITED) | Adds `alternateName: "Josef Agro Supplies"` + WebSite schema | Ties the "josef" misspelling to your brand |

These are committed. After they are on the server you only need to **build + restart**.

## Deploy (on the server / cPanel)

```bash
git pull            # get the new code (or upload the 3 files)
npm run build       # rebuilds dist/ with the new index.html + bundled SEO logic
# restart the Node app (cPanel: "Restart App" in Setup Node.js App)
```

Verify it worked - each command must print a DIFFERENT title:

```bash
curl -s https://jaosefagrosupplies.co.ke/         | grep -o '<title>.*</title>'
curl -s https://jaosefagrosupplies.co.ke/about    | grep -o '<title>.*</title>'
curl -s https://jaosefagrosupplies.co.ke/products | grep -o '<title>.*</title>'
```

If each prints a different title, the fix is live.

## The part code can't do - Google Search Console (most important)

Sitelinks (the "About / Products / Contact" block under your main result) are awarded
by Google automatically - but only after it has crawled distinct pages and trusts the
site. Speed it up:

1. Go to https://search.google.com/search-console and add property `jaosefagrosupplies.co.ke`.
2. Verify (DNS TXT record at your domain registrar is easiest).
3. Submit your sitemap: `https://jaosefagrosupplies.co.ke/sitemap.xml`.
4. Use **URL Inspection** - enter each page (`/`, `/about`, `/products`, `/contact`,
   `/farming-tips`) and click **Request Indexing**. Do all five.
5. Wait 1-4 weeks. Sitelinks appear once Google re-crawls and sees the unique titles.

Also create a free **Google Business Profile** (business.google.com) for "Jaosef Agro
Supplies, Nairobi" - this produces the map pin + the strongest brand panel.

## The "josef" vs "jaosef" spelling

Your screenshots already show Google auto-correcting josef -> jaosef and showing your
site. The `alternateName` schema + the word "Josef" now in your homepage copy reinforces
this. Nothing more is needed once the brand is established.

## Optional next step - dynamic product-detail titles

Right now `/products/:id` pages share a generic "Product Details" title. To make each
product rank for its own name, look the product up by id in the server fallback and build
the title from its name. In `api/lib/vite.ts`, the catch-all handler would become async:

```ts
import { db } from "../db";              // your drizzle db instance
import { products } from "../../db/schema"; // adjust to your schema path
import { eq } from "drizzle-orm";

app.on(["GET", "HEAD"], "*", async (c) => {
  const pathname = new URL(c.req.url).pathname;
  const m = pathname.match(/^\/products\/([^/]+)$/);
  if (m) {
    const row = await db.select().from(products).where(eq(products.id, m[1])).limit(1);
    if (row[0]) {
      // pass a custom title/description into injectSeo (extend it to accept overrides)
      return c.html(injectSeo(indexHtml, pathname, {
        title: `${row[0].name} | Jaosef Agro Supplies`,
        description: row[0].description ?? undefined,
      }));
    }
  }
  return c.html(injectSeo(indexHtml, pathname));
});
```

Also add 100-150 words of real text per category on `/products` (Google ranks text, not
images) mentioning the products and "in Kenya".

## Priority order

1. Deploy the 3 files + verify titles differ (today).
2. Search Console: verify, submit sitemap, request indexing (today).
3. Google Business Profile (this week).
4. Dynamic product-detail titles + category copy (when you have time).
