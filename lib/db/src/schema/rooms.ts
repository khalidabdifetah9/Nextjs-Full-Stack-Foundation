import { doublePrecision, index, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { houses } from "./houses";

export const houseRooms = pgTable(
  "house_rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    houseId: text("house_id").notNull().references(() => houses.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(), // "living", "kitchen"... hotspots point to this
    name: text("name").notNull(),
    panoramaKey: text("panorama_key").notNull(), // bucket object key
    maskKey: text("mask_key"), // bucket object key (optional)
    startPitch: doublePrecision("start_pitch"),
    startYaw: doublePrecision("start_yaw"),
    position: integer("position").notNull().default(0),
  },
  (t) => [uniqueIndex("room_slug_per_house").on(t.houseId, t.slug)]
);

export const roomHotspots = pgTable(
  "room_hotspots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id").notNull().references(() => houseRooms.id, { onDelete: "cascade" }),
    toSlug: text("to_slug").notNull(), // slug of the destination room in the same house
    label: text("label").notNull(),
    pitch: doublePrecision("pitch").notNull(),
    yaw: doublePrecision("yaw").notNull(),
  },
  (t) => [index("hotspots_room_idx").on(t.roomId)]
);