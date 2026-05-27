import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { farmingTips } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { demoTips, hasDatabase } from "./demo-data";

const tipInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  imageUrl: z.string().min(1),
  date: z.string().min(1),
});

function nextDemoTipId() {
  return Math.max(0, ...demoTips.map((tip) => tip.id)) + 1;
}

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

  create: adminQuery.input(tipInput).mutation(async ({ input }) => {
    if (!hasDatabase()) {
      const tip = {
        id: nextDemoTipId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...input,
      };
      demoTips.unshift(tip);
      return tip;
    }

    const db = getDb();
    const result = await db.insert(farmingTips).values(input);
    const id = Number(result[0].insertId);
    const [created] = await db.select().from(farmingTips).where(eq(farmingTips.id, id)).limit(1);
    return created;
  }),

  update: adminQuery.input(tipInput.extend({ id: z.number() })).mutation(async ({ input }) => {
    const { id, ...values } = input;
    if (!hasDatabase()) {
      const index = demoTips.findIndex((tip) => tip.id === id);
      if (index < 0) {
        throw new Error("Tip not found");
      }
      demoTips[index] = {
        ...demoTips[index],
        ...values,
        updatedAt: new Date(),
      };
      return demoTips[index];
    }

    const db = getDb();
    await db.update(farmingTips).set(values).where(eq(farmingTips.id, id));
    const [updated] = await db.select().from(farmingTips).where(eq(farmingTips.id, id)).limit(1);
    return updated;
  }),

  delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    if (!hasDatabase()) {
      const index = demoTips.findIndex((tip) => tip.id === input.id);
      if (index >= 0) {
        demoTips.splice(index, 1);
      }
      return { success: true };
    }

    const db = getDb();
    await db.delete(farmingTips).where(eq(farmingTips.id, input.id));
    return { success: true };
  }),
});
