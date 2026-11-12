import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { houses } from "./houses";

export const reservationStatus = pgEnum("reservation_status", [
  "pending", // created, waiting for payment
  "active", // paid, the house is held
  "expired", // hold period is over
  "cancelled", // payment failed
]);

export const orderStatus = pgEnum("order_status", ["PENDING", "SUCCESS", "FAILED"]);

export const reservations = pgTable(
  "reservations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    houseId: text("house_id").notNull().references(() => houses.id),
    days: integer("days").notNull(),
    status: reservationStatus("status").notNull().default("pending"),
    startsAt: timestamp("starts_at", { withTimezone: true }), // set when paid
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("reservations_days_check", sql`${t.days} between 1 and 14`),
    // The database itself refuses a second active hold on the same house
    uniqueIndex("one_active_reservation_per_house")
      .on(t.houseId)
      .where(sql`${t.status} = 'active'`),
    index("reservations_user_idx").on(t.userId),
  ]
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    merchantReference: text("merchant_reference").notNull().unique(), // max 20 chars for Chapa
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    reservationId: uuid("reservation_id")
      .notNull()
      .references(() => reservations.id, { onDelete: "cascade" }),

    amount: integer("amount").notNull(), // in cents, same as Chapa v2
    currency: text("currency").notNull().default("ETB"),
    status: orderStatus("status").notNull().default("PENDING"),
    customerEmail: text("customer_email").notNull(),

    // Filled in from Chapa
    chapaReference: text("chapa_reference"),
    checkoutUrl: text("checkout_url"),
    paymentMethod: text("payment_method"),
    serviceFee: integer("service_fee"),
    paidAt: timestamp("paid_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("orders_user_idx").on(t.userId)]
);

export type Order = typeof orders.$inferSelect;