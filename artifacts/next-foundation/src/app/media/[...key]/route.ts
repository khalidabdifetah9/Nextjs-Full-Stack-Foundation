import { contentTypeFor, storage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: parts } = await params;
  const key = parts.join("/");

  // Only files under houses/ can ever be served, so nothing else in the bucket is reachable
  if (!/^houses\/[\w./-]+$/.test(key) || key.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const { ok, value } = await storage().downloadAsBytes(key);
  if (!ok || !value) return new Response("Not found", { status: 404 });

  // Some SDK versions return the bytes inside an array
  const raw = value as unknown;
  const bytes = (Array.isArray(raw) ? raw[0] : raw) as Buffer;

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentTypeFor(key),
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}