import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteSettings } from "@db/schema";
import { eq } from "drizzle-orm";
import { hasDatabase } from "./demo-data";
import {
  defaultSiteContent,
  siteContentSchema,
  type SiteContent,
} from "@contracts/site-content";

let demoSiteContent: SiteContent = defaultSiteContent;

function mergeWithDefaults(partial: unknown): SiteContent {
  const parsed = siteContentSchema.safeParse(partial);
  if (parsed.success) {
    return parsed.data;
  }
  return defaultSiteContent;
}

export const siteContentRouter = createRouter({
  get: publicQuery.query(async (): Promise<SiteContent> => {
    if (!hasDatabase()) {
      return demoSiteContent;
    }

    const db = getDb();
    const rows = await db.select().from(siteSettings).limit(1);
    if (rows.length === 0) {
      return defaultSiteContent;
    }
    try {
      const parsed = JSON.parse(rows[0].data) as unknown;
      return mergeWithDefaults(parsed);
    } catch {
      return defaultSiteContent;
    }
  }),

  update: adminQuery
    .input(siteContentSchema)
    .mutation(async ({ input }): Promise<SiteContent> => {
      if (!hasDatabase()) {
        demoSiteContent = input;
        return demoSiteContent;
      }

      const db = getDb();
      const serialised = JSON.stringify(input);
      const existing = await db.select().from(siteSettings).limit(1);
      if (existing.length === 0) {
        await db.insert(siteSettings).values({ data: serialised });
      } else {
        await db
          .update(siteSettings)
          .set({ data: serialised })
          .where(eq(siteSettings.id, existing[0].id));
      }
      return input;
    }),

  reset: adminQuery.mutation(async (): Promise<SiteContent> => {
    if (!hasDatabase()) {
      demoSiteContent = defaultSiteContent;
      return demoSiteContent;
    }

    const db = getDb();
    const serialised = JSON.stringify(defaultSiteContent);
    const existing = await db.select().from(siteSettings).limit(1);
    if (existing.length === 0) {
      await db.insert(siteSettings).values({ data: serialised });
    } else {
      await db
        .update(siteSettings)
        .set({ data: serialised })
        .where(eq(siteSettings.id, existing[0].id));
    }
    return defaultSiteContent;
  }),
});
