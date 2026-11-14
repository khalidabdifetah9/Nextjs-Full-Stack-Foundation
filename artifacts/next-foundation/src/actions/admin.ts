"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, houseRooms, houses, reservations, roomHotspots } from "@workspace/db";
import { getAdminSession } from "@/lib/admin";
import { houseSchema, type HouseData } from "@/lib/admin-schema";
import { storage } from "@/lib/storage";

type Result = { ok: true; id: string } | { error: string };
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const isUniqueViolation = (e: unknown) => {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
};

function refresh() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");
}

// Checks the data, the image keys and the hotspots. Returns clean data or a message.
async function validate(input: unknown): Promise<{ data: HouseData } | { error: string }> {
  const parsed = houseSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue.path.join(".");
    return { error: where ? `${where}: ${issue.message}` : issue.message };
  }
  const d = parsed.data;

  const slugs = d.rooms.map((r) => r.slug);
  if (new Set(slugs).size !== slugs.length) return { error: "Each room needs a unique ID." };

  for (const room of d.rooms) {
    for (const h of room.hotspots) {
      if (h.to === room.slug) return { error: `"${room.name}" has a hotspot that points to itself.` };
      if (!slugs.includes(h.to)) return { error: `A hotspot in "${room.name}" points to a room that doesn't exist.` };
    }
  }

  // Every image must belong to this home and really exist in the bucket
  const prefix = `houses/${d.id}/`;
  const keys = [d.thumbKey, ...d.rooms.flatMap((r) => [r.panoramaKey, r.maskKey])].filter(
    (k): k is string => !!k
  );
  if (keys.some((k) => !k.startsWith(prefix))) {
    return { error: "An image doesn't belong to this home. Please upload it again." };
  }
  const checks = await Promise.all(keys.map((k) => storage().exists(k)));
  const missing = keys.find((_, i) => !checks[i].ok || !checks[i].value);
  if (missing) return { error: `Image not found in storage: ${missing.split("/").pop()}` };

  return { data: d };
}

function houseValues(d: HouseData) {
  return {
    name: d.name,
    type: d.type,
    status: d.status,
    location: d.location,
    price: d.price,
    sqft: d.sqft,
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    garage: d.garage,
    yearBuilt: d.yearBuilt ?? null,
    lotSize: d.lotSize,
    description: d.description,
    features: d.features,
    thumb: d.thumbKey ?? d.rooms[0].panoramaKey,
    published: d.published,
  };
}

async function insertRooms(tx: Tx, d: HouseData) {
  for (const [i, r] of d.rooms.entries()) {
    const [room] = await tx
      .insert(houseRooms)
      .values({
        houseId: d.id,
        slug: r.slug,
        name: r.name,
        panoramaKey: r.panoramaKey,
        maskKey: r.maskKey ?? null,
        startPitch: r.startPitch ?? null,
        startYaw: r.startYaw ?? null,
        position: i,
      })
      .returning({ id: houseRooms.id });

    if (r.hotspots.length > 0) {
      await tx.insert(roomHotspots).values(
        r.hotspots.map((h) => ({
          roomId: room.id,
          toSlug: h.to,
          label: h.label,
          pitch: h.pitch,
          yaw: h.yaw,
        }))
      );
    }
  }
}

async function removeFiles(houseId: string, keys: (string | null)[]) {
  const prefix = `houses/${houseId}/`;
  for (const key of keys) {
    if (key && key.startsWith(prefix)) await storage().delete(key); // best effort
  }
}

export async function createHouse(input: unknown): Promise<Result> {
  if (!(await getAdminSession())) return { error: "Not allowed." };

  const v = await validate(input);
  if ("error" in v) return v;
  const d = v.data;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(houses).values({ id: d.id, ...houseValues(d) });
      await insertRooms(tx, d);
    });
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "A home with this ID already exists. Choose another ID." };
    console.error("createHouse failed:", e);
    return { error: "We couldn't save this home. Please try again." };
  }

  refresh();
  return { ok: true, id: d.id };
}

export async function updateHouse(input: unknown): Promise<Result> {
  if (!(await getAdminSession())) return { error: "Not allowed." };

  const v = await validate(input);
  if ("error" in v) return v;
  const d = v.data;

  const [existing] = await db
    .select({ thumb: houses.thumb })
    .from(houses)
    .where(eq(houses.id, d.id))
    .limit(1);
  if (!existing) return { error: "Home not found." };

  const oldRooms = await db
    .select({ p: houseRooms.panoramaKey, m: houseRooms.maskKey })
    .from(houseRooms)
    .where(eq(houseRooms.houseId, d.id));
  const oldKeys = [existing.thumb, ...oldRooms.flatMap((r) => [r.p, r.m])];

  try {
    await db.transaction(async (tx) => {
      await tx.update(houses).set(houseValues(d)).where(eq(houses.id, d.id));
      await tx.delete(houseRooms).where(eq(houseRooms.houseId, d.id)); // hotspots go with them
      await insertRooms(tx, d);
    });
  } catch (e) {
    console.error("updateHouse failed:", e);
    return { error: "We couldn't save your changes. Please try again." };
  }

  // Delete files that are no longer used
  const newKeys = new Set([houseValues(d).thumb, ...d.rooms.flatMap((r) => [r.panoramaKey, r.maskKey])]);
  await removeFiles(d.id, oldKeys.filter((k) => k && !newKeys.has(k)));

  refresh();
  return { ok: true, id: d.id };
}

export async function setPublished(id: string, published: boolean): Promise<Result> {
  if (!(await getAdminSession())) return { error: "Not allowed." };

  const updated = await db
    .update(houses)
    .set({ published })
    .where(eq(houses.id, id))
    .returning({ id: houses.id });
  if (updated.length === 0) return { error: "Home not found." };

  refresh();
  return { ok: true, id };
}

export async function deleteHouse(id: string): Promise<Result> {
  if (!(await getAdminSession())) return { error: "Not allowed." };

  // Money and history point at this home, so it can't be deleted once reserved
  const [{ n }] = await db
    .select({ n: count() })
    .from(reservations)
    .where(eq(reservations.houseId, id));
  if (n > 0) return { error: "This home has reservations, so it can't be deleted. Unpublish it instead." };

  const [house] = await db.select({ thumb: houses.thumb }).from(houses).where(eq(houses.id, id)).limit(1);
  if (!house) return { error: "Home not found." };

  const rooms = await db
    .select({ p: houseRooms.panoramaKey, m: houseRooms.maskKey })
    .from(houseRooms)
    .where(eq(houseRooms.houseId, id));

  await db.delete(houses).where(eq(houses.id, id)); // rooms and hotspots are removed with it
  await removeFiles(id, [house.thumb, ...rooms.flatMap((r) => [r.p, r.m])]);

  refresh();
  return { ok: true, id };
}