import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { demoProducts, hasDatabase } from "./demo-data";

const categorySchema = z.enum([
  "pesticides",
  "manure",
  "fertilizers",
  "farm_inputs",
  "crop_protection",
]);

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: categorySchema.or(z.literal("all")).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      if (!hasDatabase()) {
        return input?.category && input.category !== "all"
          ? demoProducts.filter((product) => product.category === input.category)
          : demoProducts;
      }

      const db = getDb();
      if (input?.category && input.category !== "all") {
        return db
          .select()
          .from(products)
          .where(eq(products.category, input.category))
          .orderBy(desc(products.createdAt));
      }
      return db.select().from(products).orderBy(desc(products.createdAt));
    }),

  featured: publicQuery.query(async () => {
    if (!hasDatabase()) {
      return demoProducts.filter((product) => product.featured).slice(0, 8);
    }

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
      if (!hasDatabase()) {
        return demoProducts.find((product) => product.id === input.id) ?? null;
      }

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
        category: categorySchema,
      })
    )
    .query(async ({ input }) => {
      if (!hasDatabase()) {
        return demoProducts.filter((product) => product.category === input.category);
      }

      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.category, input.category))
        .orderBy(desc(products.createdAt));
    }),

  related: publicQuery
    .input(z.object({ id: z.number(), category: categorySchema }))
    .query(async ({ input }) => {
      if (!hasDatabase()) {
        return demoProducts
          .filter(
            (product) =>
              product.category === input.category && product.id !== input.id,
          )
          .slice(0, 4);
      }

      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.category, input.category))
        .orderBy(desc(products.createdAt))
        .limit(4);
    }),
});
