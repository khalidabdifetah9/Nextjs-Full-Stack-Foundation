import { Client } from "@replit/object-storage";
let client: Client | null = null;

export function storage() {
  client ??= new Client(
    process.env.MEDIA_BUCKET_ID ? { bucketId: process.env.MEDIA_BUCKET_ID } : undefined
  );
  return client;
}

export { mediaUrl } from "./media-url";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  avif:"image/avif",
};

export function contentTypeFor(key: string) {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return TYPES[ext] ?? "application/octet-stream";
}