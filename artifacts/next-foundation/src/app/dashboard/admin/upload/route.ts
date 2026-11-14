import { randomBytes } from "node:crypto";
import { getAdminSession } from "@/lib/admin";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

const MB = 1024 * 1024;
const LIMITS = { panorama: 25 * MB, mask: 25 * MB, thumb: 3 * MB } as const;
type Kind = keyof typeof LIMITS;

function readImage(buf: Buffer): { ext: "png" | "jpg"; width: number; height: number } | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.readUInt32BE(4) === 0x0d0a1a0a) {
    return { ext: "png", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker === 0xff) { i++; continue; }
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { ext: "jpg", height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(req: Request) {
  if (!(await getAdminSession())) return fail("Not allowed.", 403);

  const form = await req.formData().catch(() => null);
  if (!form) return fail("Invalid upload.");

  const houseId = String(form.get("houseId") ?? "");
  const kind = String(form.get("kind") ?? "") as Kind;
  const file = form.get("file");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(houseId) || houseId.length > 40) return fail("Invalid home ID.");
  if (!(kind in LIMITS)) return fail("Invalid image type.");
  if (!file || typeof file === "string") return fail("No file received.");
  if (file.size > LIMITS[kind]) return fail(`File is too large (max ${LIMITS[kind] / MB} MB).`);

  const bytes = Buffer.from(await file.arrayBuffer());
  const img = readImage(bytes);
  if (!img) return fail("Only JPG and PNG images are allowed.");

  if (kind === "thumb" && img.width < 200) return fail("Thumbnail is too small.");
  if (kind !== "thumb") {
    if (Math.abs(img.width / img.height - 2) > 0.02) {
      return fail(`${kind === "mask" ? "Mask" : "Panorama"} must be 2:1 (for example 4096×2048). This one is ${img.width}×${img.height}.`);
    }
    if (img.width < 1024 || img.width > 8192) return fail("Width must be between 1024 and 8192 pixels.");
  }

  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
  const key = `houses/${houseId}/${kind}/${randomBytes(4).toString("hex")}-${base}.${img.ext}`;

  const res = await storage().uploadFromBytes(key, bytes);
  if (!res.ok) {
    console.error("Upload failed:", res.error);
    return fail("Could not store the image. Please try again.", 500);
  }

  return Response.json({ key, width: img.width, height: img.height });
}