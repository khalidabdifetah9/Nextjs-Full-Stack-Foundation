import { z } from "zod";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

const slug = z
  .string()
  .min(2)
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

const mediaKey = z
  .string()
  .max(300)
  .regex(/^houses\/[\w./-]+$/, "Invalid image key")
  .refine((k) => !k.includes(".."), "Invalid image key");

const text = (max: number) => z.string().trim().min(1, "Required").max(max);

const hotspotSchema = z.object({
  to: slug, // slug of another room in this home
  label: text(40),
  pitch: z.number().min(-90).max(90),
  yaw: z.number().min(-360).max(360),
});

const roomSchema = z.object({
  slug,
  name: text(60),
  panoramaKey: mediaKey,
  maskKey: mediaKey.nullish(),
  startPitch: z.number().min(-90).max(90).nullish(),
  startYaw: z.number().min(-360).max(360).nullish(),
  hotspots: z.array(hotspotSchema).max(12),
});

export const houseSchema = z.object({
  id: slug.refine((v) => !["new", "upload"].includes(v), "That ID is reserved"),
  name: text(80),
  type: text(40),
  status: z.enum(["For Sale", "For Rent"]),
  location: text(120),
  price: z.number().int().positive().max(2_000_000_000), // whole ETB (per month for rent)
  sqft: z.number().int().positive().max(1_000_000),
  bedrooms: z.number().int().min(0).max(50),
  bathrooms: z.number().int().min(0).max(50),
  garage: z.string().trim().max(40),
  yearBuilt: z.number().int().min(1900).max(2100).nullish(),
  lotSize: z.string().trim().max(40),
  description: z.string().trim().max(2000),
  features: z.array(z.string().trim().min(1).max(60)).max(12),
  thumbKey: mediaKey.nullish(), // optional: falls back to the first room's panorama
  published: z.boolean(),
  rooms: z.array(roomSchema).min(1, "Add at least one room").max(12),
});

export type HouseData = z.infer<typeof houseSchema>;