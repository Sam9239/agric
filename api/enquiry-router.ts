import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { enquiries } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const enquiryRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        message: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(enquiries).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt));
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "replied"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(enquiries)
        .set({ status: input.status })
        .where(eq(enquiries.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(enquiries).where(eq(enquiries.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(enquiries);
    const newCount = all.filter((e) => e.status === "new").length;
    const total = all.length;
    return { total, new: newCount };
  }),
});
