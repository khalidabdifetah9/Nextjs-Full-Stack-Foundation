import { asc,eq } from "drizzle-orm";
import { db, houseRooms, houses, roomHotspots } from "@workspace/db";
import type { House } from "./houses";
import { mediaUrl } from "./storage";

export async function getHouses(): Promise<House[]> {
  const [homes, rooms, spots] = await Promise.all([
    db.select().from(houses).where(eq(houses.published, true)).orderBy(asc(houses.createdAt), asc(houses.id)),
    db.select().from(houseRooms).orderBy(asc(houseRooms.position)),
    db.select().from(roomHotspots),
  ]);

  const spotsByRoom = new Map<string, typeof spots>();
  for (const s of spots) {
    const list = spotsByRoom.get(s.roomId) ?? [];
    list.push(s);
    spotsByRoom.set(s.roomId, list);
  }

  return homes
    .map((h) => ({
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
      yearBuilt: h.yearBuilt ?? 0,
      lotSize: h.lotSize ?? "",
      description: h.description ?? "",
      features: h.features,
      thumb: mediaUrl(h.thumb) ?? "",
      rooms: rooms
        .filter((r) => r.houseId === h.id)
        .map((r) => ({
          id: r.slug,
          name: r.name,
          panorama: mediaUrl(r.panoramaKey)!,
          mask: mediaUrl(r.maskKey) ?? undefined,
          startPitch: r.startPitch ?? undefined,
          startYaw: r.startYaw ?? undefined,
          hotspots: (spotsByRoom.get(r.id) ?? []).map((s) => ({
            to: s.toSlug,
            label: s.label,
            pitch: s.pitch,
            yaw: s.yaw,
          })),
        })),
    }))
    .filter((h) => h.rooms.length > 0); // a house with no rooms can't be previewed
}