import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { houses } from "./houses";

export const appointmentStatus = pgEnum("appointment_status", ["booked", "cancelled"]);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    houseId: text("house_id").references(() => houses.id, { onDelete: "set null" }),
    date: text("date").notNull(),
    time: text("time").notNull(),
    topic: text("topic").notNull(),
    note: text("note"),
    status: appointmentStatus("status").notNull().default("booked"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("one_booking_per_slot").on(t.date, t.time).where(sql`${t.status} = 'booked'`),
    index("appointments_user_idx").on(t.userId),
  ]
);