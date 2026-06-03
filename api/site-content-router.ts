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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override)) return base;
  if (!isPlainObject(base)) return base;
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const baseValue = (base as Record<string, unknown>)[key];
    const overrideValue = override[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else if (overrideValue !== undefined && overrideValue !== null) {
      result[key] = overrideValue;
    }
  }
  return result as T;
}

function mergeWithDefaults(partial: unknown): SiteContent {
  const merged = deepMerge(defaultSiteContent, partial);
  const parsed = siteContentSchema.safeParse(merged);
  return parsed.success ? parsed.data : defaultSiteContent;
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
