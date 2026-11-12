import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const listingStatus = pgEnum("listing_status", ["For Sale", "For Rent"]);

export const houses = pgTable("houses", {
  id: text("id").primaryKey(), // slug, must match the house id used in lib/houses.ts
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: listingStatus("status").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(), // whole ETB (per month when For Rent)
  currency: text("currency").notNull().default("ETB"),
  sqft: integer("sqft").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  garage: text("garage"),
  yearBuilt: integer("year_built"),
  lotSize: text("lot_size"),
  description: text("description"),
  features: text("features").array().notNull().default(sql`'{}'::text[]`),
  thumb: text("thumb"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});