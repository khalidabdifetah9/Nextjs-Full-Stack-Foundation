import { asc, count, eq } from "drizzle-orm";
import { db, houseRooms, houses, roomHotspots } from "@workspace/db";
import type { HouseData } from "./admin-schema";
import { mediaUrl } from "./media-url";

export async function getAdminHouses() {
  const rows = await db
    .select({
      id: houses.id,
      name: houses.name,
      status: houses.status,
      location: houses.location,
      price: houses.price,
      published: houses.published,
      thumb: houses.thumb,
      rooms: count(houseRooms.id),
    })
    .from(houses)
    .leftJoin(houseRooms, eq(houseRooms.houseId, houses.id))
    .groupBy(houses.id)
    .orderBy(asc(houses.createdAt), asc(houses.id));

  return rows.map((r) => ({ ...r, thumbUrl: mediaUrl(r.thumb) }));
}

export async function getHouseForEdit(id: string): Promise<HouseData | null> {
  const [h] = await db.select().from(houses).where(eq(houses.id, id)).limit(1);
  if (!h) return null;

  const rooms = await db
    .select()
    .from(houseRooms)
    .where(eq(houseRooms.houseId, id))
    .orderBy(asc(houseRooms.position));
  const spots = await db.select().from(roomHotspots);

  return {
    id: h.id,
    name: h.name,
    type: h.type,
    status: h.status,
    location: h.location,
    price: h.price,
    sqft: h.sqft,
    bedrooms: h.bedrooms,
    bathrooms: h.bathrooms,
    garage: h.garage ?? "",
    yearBuilt: h.yearBuilt,
    lotSize: h.lotSize ?? "",
    description: h.description ?? "",
    features: h.features,
    thumbKey: h.thumb,
    published: h.published,
    rooms: rooms.map((r) => ({
      slug: r.slug,
      name: r.name,
      panoramaKey: r.panoramaKey,
      maskKey: r.maskKey,
      startPitch: r.startPitch,
      startYaw: r.startYaw,
      hotspots: spots
        .filter((s) => s.roomId === r.id)
        .map((s) => ({ to: s.toSlug, label: s.label, pitch: s.pitch, yaw: s.yaw })),
    })),
  };
}