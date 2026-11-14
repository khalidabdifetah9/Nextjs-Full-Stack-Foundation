"use client";

import { useRef, useState } from "react";
import { mediaUrl } from "@/lib/media-url";
import { uploadMedia } from "@/lib/admin-upload";
import type { UploadKind } from "@/lib/admin-upload";

interface Props {
  label: string;
  hint?: string;
  kind: UploadKind;
  houseId: string;
  value: string | null; // the saved image key
  onChange: (key: string | null) => void;
  onBusyChange?: (busy: boolean) => void;
}

const MAX_MB = { panorama: 25, mask: 25, thumb: 3 } as const;

export default function ImageField({ label, hint, kind, houseId, value, onChange, onBusyChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_MB[kind] * 1024 * 1024) {
      setError(`That file is too large (max ${MAX_MB[kind]} MB).`);
      return;
    }

    setProgress(0);
    onBusyChange?.(true);
    try {
      const key = await uploadMedia(file, houseId, kind, setProgress);
      onChange(key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setProgress(null);
      onBusyChange?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const uploading = progress !== null;
  const url = mediaUrl(value);

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {url ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className={`w-full rounded-md bg-[#F7F6F2] object-cover ${kind === "thumb" ? "aspect-3/2" : "aspect-2/1"}`}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-md border border-[#243D35]/20 px-3 py-1.5 text-sm transition hover:border-[#243D35] disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange(null)}
              className="rounded-md border border-[#243D35]/20 px-3 py-1.5 text-sm text-red-600 transition hover:border-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#243D35]/25 bg-[#F7F6F2] px-4 text-sm text-[#243D35]/70 transition hover:border-[#243D35] disabled:opacity-60 ${
            kind === "thumb" ? "aspect-3/2" : "aspect-2/1"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
          </svg>
          {uploading ? `Uploading ${progress}%` : "Click to upload"}
        </button>
      )}

      {uploading && url && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#243D35]/10">
          <div className="h-full bg-[#243D35] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-2 text-xs text-[#243D35]/50">{hint}</p>}
    </div>
  );
}