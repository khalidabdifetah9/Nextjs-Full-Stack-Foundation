export type UploadKind = "panorama" | "mask" | "thumb";

// Resolves with the object key to put into the house data
export function uploadMedia(
  file: File,
  houseId: string,
  kind: UploadKind,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("houseId", houseId);
    form.append("kind", kind);
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/dashboard/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body: { key?: string; error?: string } = {};
      try { body = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.key) resolve(body.key);
      else reject(new Error(body.error ?? "Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(form);
  });
}