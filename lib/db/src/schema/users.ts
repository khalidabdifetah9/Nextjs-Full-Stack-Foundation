import { createInsertSchema } from "drizzle-zod";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Profile
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(), // optional: Google sign in doesn't give us one
  image: text("image"),

  // Authentication
  passwordHash: text("password_hash"), // null when the user signs in with Google only
  googleId: text("google_id").unique(), // null when the user signs up with email
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),

  // Access
  role: userRole("role").notNull().default("user"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
