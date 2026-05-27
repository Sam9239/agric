import { relations } from "drizzle-orm";
import { products, farmingTips, enquiries } from "./schema";

export const productsRelations = relations(products, () => ({
  // Add relations if needed
}));

export const farmingTipsRelations = relations(farmingTips, () => ({
  // Add relations if needed
}));

export const enquiriesRelations = relations(enquiries, () => ({
  // Add relations if needed
}));
