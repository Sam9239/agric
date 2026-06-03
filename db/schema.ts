import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", [
    "crop_nutrition",
    "seeds",
    "crop_protection",
    "soil_health",
    "irrigation",
    "tools",
    "nursery",
    "safety",
    "post_harvest",
  ]).notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  shortDescription: text("shortDescription"),
  specs: text("specs"),
  bestSuitedFor: text("bestSuitedFor"),
  usageTip: text("usageTip"),
  safetyNote: text("safetyNote"),
  packSizes: text("packSizes"),
  activeIngredient: text("activeIngredient"),
  formulation: text("formulation"),
  targetUse: text("targetUse"),
  registeredCropUse: text("registeredCropUse"),
  pcpbStatus: text("pcpbStatus"),
  phi: text("phi"),
  rei: text("rei"),
  ppe: text("ppe"),
  storageWarning: text("storageWarning"),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const farmingTips = mysqlTable("farming_tips", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("imageUrl").notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type FarmingTip = typeof farmingTips.$inferSelect;
export type InsertFarmingTip = typeof farmingTips.$inferInsert;

export const enquiries = mysqlTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  imageUrls: text("imageUrls"),
  status: mysqlEnum("status", ["new", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;

export const siteSettings = mysqlTable("site_settings", {
  id: serial("id").primaryKey(),
  data: text("data").notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SiteSettingsRow = typeof siteSettings.$inferSelect;

export const adminSecurity = mysqlTable("admin_security", {
  id: serial("id").primaryKey(),
  totpSecret: text("totpSecret"),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AdminSecurityRow = typeof adminSecurity.$inferSelect;
