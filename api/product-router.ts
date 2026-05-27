import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.category && input.category !== "all") {
        return db
          .select()
          .from(products)
          .where(eq(products.category, input.category as "pesticides" | "manure" | "fertilizers" | "farm_inputs" | "crop_protection"))
          .orderBy(desc(products.createdAt));
      }
      return db.select().from(products).orderBy(desc(products.createdAt));
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt))
      .limit(8);
  }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  byCategory: publicQuery
    .input(
      z.object({
        category: z.enum([
          "pesticides",
          "manure",
          "fertilizers",
          "farm_inputs",
          "crop_protection",
        ]),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.category, input.category))
        .orderBy(desc(products.createdAt));
    }),

  related: publicQuery
    .input(z.object({ id: z.number(), category: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.category, input.category as "pesticides" | "manure" | "fertilizers" | "farm_inputs" | "crop_protection"))
        .orderBy(desc(products.createdAt))
        .limit(4);
    }),
});
