import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { enquiries } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { demoEnquiries, hasDatabase } from "./demo-data";
import { enquiryImageLimits } from "@contracts/site-content";

let nextDemoEnquiryId = demoEnquiries.length + 1;

function serialiseUrls(urls: string[] | undefined): string | null {
  if (!urls || urls.length === 0) return null;
  return JSON.stringify(urls);
}

export function parseImageUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string") : [];
  } catch {
    return [];
  }
}

export const enquiryRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        message: z.string().min(1, "Message is required"),
        imageUrls: z
          .array(z.string().min(1))
          .max(enquiryImageLimits.maxFiles)
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const urls = input.imageUrls ?? [];
      if (!hasDatabase()) {
        const enquiry = {
          id: nextDemoEnquiryId++,
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          message: input.message,
          imageUrls: serialiseUrls(urls),
          status: "new" as const,
          createdAt: new Date(),
        };
        demoEnquiries.unshift(enquiry);
        return { success: true, id: enquiry.id };
      }

      const db = getDb();
      const result = await db.insert(enquiries).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message,
        imageUrls: serialiseUrls(urls),
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  list: adminQuery.query(async () => {
    if (!hasDatabase()) {
      return demoEnquiries;
    }

    const db = getDb();
    return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  }),

  demoList: publicQuery.query(() => {
    return hasDatabase() ? [] : demoEnquiries;
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "replied"]),
      }),
    )
    .mutation(async ({ input }) => {
      if (!hasDatabase()) {
        const enquiry = demoEnquiries.find((item) => item.id === input.id);
        if (enquiry) {
          enquiry.status = input.status;
        }
        return { success: true };
      }

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
      if (!hasDatabase()) {
        const index = demoEnquiries.findIndex((item) => item.id === input.id);
        if (index >= 0) {
          demoEnquiries.splice(index, 1);
        }
        return { success: true };
      }

      const db = getDb();
      await db.delete(enquiries).where(eq(enquiries.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    if (!hasDatabase()) {
      const newCount = demoEnquiries.filter((e) => e.status === "new").length;
      return { total: demoEnquiries.length, new: newCount };
    }

    const db = getDb();
    const all = await db.select().from(enquiries);
    const newCount = all.filter((e) => e.status === "new").length;
    const total = all.length;
    return { total, new: newCount };
  }),
});
