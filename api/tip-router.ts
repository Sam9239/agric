import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { farmingTips } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { demoTips, hasDatabase } from "./demo-data";

export const tipRouter = createRouter({
  list: publicQuery.query(async () => {
    if (!hasDatabase()) {
      return demoTips;
    }

    const db = getDb();
    return db
      .select()
      .from(farmingTips)
      .orderBy(desc(farmingTips.createdAt));
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      if (!hasDatabase()) {
        return demoTips.find((tip) => tip.id === input.id) ?? null;
      }

      const db = getDb();
      const result = await db
        .select()
        .from(farmingTips)
        .where(eq(farmingTips.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  recent: publicQuery.query(async () => {
    if (!hasDatabase()) {
      return demoTips.slice(0, 6);
    }

    const db = getDb();
    return db
      .select()
      .from(farmingTips)
      .orderBy(desc(farmingTips.createdAt))
      .limit(6);
  }),
});
