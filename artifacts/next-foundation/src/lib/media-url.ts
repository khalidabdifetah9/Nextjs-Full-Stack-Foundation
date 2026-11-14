export function mediaUrl(key: string | null | undefined) {
  return key ? `/media/${key}` : null;
}