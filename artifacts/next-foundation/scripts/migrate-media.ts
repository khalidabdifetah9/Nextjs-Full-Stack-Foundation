import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db, houseRooms, houses, roomHotspots } from "@workspace/db";
import { houses as sourceHouses } from "../src/lib/houses";
import { storage } from "../src/lib/storage";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const done = new Set<string>();

// "/rooms/360/living.png" -> "houses/lakeside/360/living.png"
// The 360/ and mask/ folders stay in the key, because a panorama and its mask
// can share a file name ("living.png") inside the same house.
function keyFor(houseId: string, publicPath: string) {
  const rel = publicPath.startsWith("/rooms/") ? publicPath.slice("/rooms/".length) : path.basename(publicPath);
  return `houses/${houseId}/${rel}`;
}

async function upload(houseId: string, publicPath: string) {
  const key = keyFor(houseId, publicPath);
  if (done.has(key)) return key;

  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(PUBLIC_DIR, publicPath));
  } catch {
    throw new Error(`File not found in public/: ${publicPath}`);
  }

  const res = await storage().uploadFromBytes(key, bytes);
  if (!res.ok) throw new Error(`Upload failed for ${key}: ${res.error?.message}`);

  done.add(key);
  console.log("uploaded", key);
  return key;
}

async function main() {
  for (const h of sourceHouses) {
    const thumbKey = await upload(h.id, h.thumb);

    const updated = await db
      .update(houses)
      .set({ thumb: thumbKey })
      .where(eq(houses.id, h.id))
      .returning({ id: houses.id });
    if (updated.length === 0) {
      console.warn(`House "${h.id}" is not in the database. Run the houses seed first.`);
      continue;
    }

    // Start clean so the script can be run again safely (hotspots are removed with their rooms)
    await db.delete(houseRooms).where(eq(houseRooms.houseId, h.id));

    for (const [i, r] of h.rooms.entries()) {
      const panoramaKey = await upload(h.id, r.panorama);
      const maskKey = r.mask ? await upload(h.id, r.mask) : null;

      const [room] = await db
        .insert(houseRooms)
        .values({
          houseId: h.id,
          slug: r.id,
          name: r.name,
          panoramaKey,
          maskKey,
          startPitch: r.startPitch ?? null,
          startYaw: r.startYaw ?? null,
          position: i,
        })
        .returning({ id: houseRooms.id });

      if (r.hotspots.length > 0) {
        await db.insert(roomHotspots).values(
          r.hotspots.map((s) => ({
            roomId: room.id,
            toSlug: s.to,
            label: s.label,
            pitch: s.pitch,
            yaw: s.yaw,
          }))
        );
      }
    }
    console.log(`✔ ${h.name}`);
  }

  console.log("Done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});