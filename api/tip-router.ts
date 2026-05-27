import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { farmingTips } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const tipRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(farmingTips)
      .orderBy(desc(farmingTips.createdAt));
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(farmingTips)
        .where(eq(farmingTips.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  recent: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(farmingTips)
      .orderBy(desc(farmingTips.createdAt))
      .limit(6);
  }),
});
