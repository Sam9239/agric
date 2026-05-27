import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { demoProducts, hasDatabase } from "./demo-data";
import { productCategories, type CatalogueProduct } from "@contracts/product-catalog";

const categoryKeys = Object.keys(productCategories) as [keyof typeof productCategories, ...(keyof typeof productCategories)[]];
const categorySchema = z.enum(categoryKeys);
const optionalString = z.string().optional().default("");
const productInput = z.object({
  name: z.string().min(1),
  category: categorySchema,
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  specs: optionalString,
  bestSuitedFor: optionalString,
  usageTip: optionalString,
  safetyNote: optionalString,
  packSizes: optionalString,
  imageUrl: z.string().min(1),
  featured: z.boolean().default(false),
  activeIngredient: optionalString,
  formulation: optionalString,
  targetUse: optionalString,
  registeredCropUse: optionalString,
  pcpbStatus: optionalString,
  phi: optionalString,
  rei: optionalString,
  ppe: optionalString,
  storageWarning: optionalString,
});

function normaliseProduct(product: typeof products.$inferSelect): CatalogueProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    shortDescription: product.shortDescription || product.description,
    description: product.description,
    specs: product.specs || "",
    bestSuitedFor: product.bestSuitedFor || "",
    usageTip: product.usageTip || "",
    safetyNote: product.safetyNote || "",
    packSizes: product.packSizes || "",
    imageUrl: product.imageUrl,
    featured: product.featured,
    activeIngredient: product.activeIngredient || undefined,
    formulation: product.formulation || undefined,
    targetUse: product.targetUse || undefined,
    registeredCropUse: product.registeredCropUse || undefined,
    pcpbStatus: product.pcpbStatus || undefined,
    phi: product.phi || undefined,
    rei: product.rei || undefined,
    ppe: product.ppe || undefined,
    storageWarning: product.storageWarning || undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function nextDemoProductId() {
  return Math.max(0, ...demoProducts.map((product) => product.id)) + 1;
}

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
        const rows = await db
          .select()
          .from(products)
          .where(eq(products.category, input.category))
          .orderBy(desc(products.createdAt));
        return rows.map(normaliseProduct);
      }
      const rows = await db.select().from(products).orderBy(desc(products.createdAt));
      return rows.map(normaliseProduct);
    }),

  featured: publicQuery.query(async () => {
    if (!hasDatabase()) {
      return demoProducts.filter((product) => product.featured).slice(0, 8);
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt))
      .limit(8);
    return rows.map(normaliseProduct);
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
      return result[0] ? normaliseProduct(result[0]) : null;
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
      const rows = await db
        .select()
        .from(products)
        .where(eq(products.category, input.category))
        .orderBy(desc(products.createdAt));
      return rows.map(normaliseProduct);
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
      const rows = await db
        .select()
        .from(products)
        .where(eq(products.category, input.category))
        .orderBy(desc(products.createdAt))
        .limit(4);
      return rows.map(normaliseProduct);
    }),

  create: adminQuery.input(productInput).mutation(async ({ input }) => {
    if (!hasDatabase()) {
      const product: CatalogueProduct = {
        id: nextDemoProductId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...input,
      };
      demoProducts.unshift(product);
      return product;
    }

    const db = getDb();
    const result = await db.insert(products).values({
      price: "",
      ...input,
    });
    const id = Number(result[0].insertId);
    const [created] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return normaliseProduct(created);
  }),

  update: adminQuery
    .input(productInput.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id, ...values } = input;
      if (!hasDatabase()) {
        const index = demoProducts.findIndex((product) => product.id === id);
        if (index < 0) {
          throw new Error("Product not found");
        }
        demoProducts[index] = {
          ...demoProducts[index],
          ...values,
          updatedAt: new Date(),
        };
        return demoProducts[index];
      }

      const db = getDb();
      await db.update(products).set(values).where(eq(products.id, id));
      const [updated] = await db.select().from(products).where(eq(products.id, id)).limit(1);
      return normaliseProduct(updated);
    }),

  delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    if (!hasDatabase()) {
      const index = demoProducts.findIndex((product) => product.id === input.id);
      if (index >= 0) {
        demoProducts.splice(index, 1);
      }
      return { success: true };
    }

    const db = getDb();
    await db.delete(products).where(eq(products.id, input.id));
    return { success: true };
  }),
});
