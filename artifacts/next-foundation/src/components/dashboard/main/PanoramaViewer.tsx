"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Hotspot } from "@/lib/houses";
import { loadPannellum } from "@/lib/pannellum";
import type { PannellumViewer } from "@/lib/pannellum";
import { hexToRgb } from "@/lib/colors";

interface PanoramaViewerProps {
  sceneKey: string; // changes whenever the room changes
  panorama: string;
  mask?: string;
  hotspots: Hotspot[];
  startPitch?: number;
  startYaw?: number;
  color: string | null;
  strength: number; // 0..1
  onNavigate: (roomId: string) => void;
  overlay?: ReactNode;
}

interface RecolorData {
  ctx: CanvasRenderingContext2D;
  base: ImageData;
  work: ImageData;
  idx: Uint32Array;
  shade: Float32Array;
  alpha: Float32Array;
}

interface Tint {
  r: number;
  g: number;
  b: number;
  s: number;
}

interface SceneRef {
  id: string;
  url: string;
}

const keyOf = (c: string | null, s: number) => (c ? `${c}|${s}` : "none");

const ARROW_SVG =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

// Builds the inside of one hotspot (arrow circle + label)
function buildHotspot(div: HTMLElement, label: string) {
  div.setAttribute("role", "button");
  div.setAttribute("aria-label", `Go to ${label}`);

  const dot = document.createElement("span");
  dot.className = "hue-dot";
  dot.innerHTML = ARROW_SVG;

  const text = document.createElement("span");
  text.className = "hue-label";
  text.textContent = label;

  div.appendChild(dot);
  div.appendChild(text);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function toBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(URL.createObjectURL(blob))
          : reject(new Error("Could not export canvas")),
      "image/jpeg",
      0.92,
    );
  });
}

function buildRecolorData(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  maskImg: HTMLImageElement,
): RecolorData {
  const base = ctx.getImageData(0, 0, w, h);

  const mCanvas = document.createElement("canvas");
  mCanvas.width = w;
  mCanvas.height = h;
  const mCtx = mCanvas.getContext("2d", { willReadFrequently: true })!;
  mCtx.drawImage(maskImg, 0, 0, w, h);
  const mask = mCtx.getImageData(0, 0, w, h).data;

  const px = base.data;
  const total = w * h;

  let count = 0;
  for (let i = 0; i < total; i++) if (mask[i * 4] > 6) count++;

  const idx = new Uint32Array(count);
  const shade = new Float32Array(count);
  const alpha = new Float32Array(count);

  let lumSum = 0;
  let weightSum = 0;
  let n = 0;
  for (let i = 0; i < total; i++) {
    const m = mask[i * 4];
    if (m <= 6) continue;
    const p = i * 4;
    const lum =
      (0.2126 * px[p] + 0.7152 * px[p + 1] + 0.0722 * px[p + 2]) / 255;
    const a = m / 255;
    idx[n] = i;
    alpha[n] = a;
    shade[n] = lum;
    lumSum += lum * a;
    weightSum += a;
    n++;
  }

  const ref = Math.max(weightSum ? lumSum / weightSum : 0.7, 0.2);
  for (let j = 0; j < count; j++) {
    shade[j] = Math.min(Math.max(shade[j] / ref, 0.2), 1.4);
  }

  const work = new ImageData(new Uint8ClampedArray(base.data), w, h);
  return { ctx, base, work, idx, shade, alpha };
}

function paint(data: RecolorData, tint: Tint) {
  const { ctx, base, work, idx, shade, alpha } = data;
  const d = work.data;
  d.set(base.data);

  for (let j = 0; j < idx.length; j++) {
    const p = idx[j] * 4;
    const m = alpha[j] * tint.s;
    const k = shade[j];
    const tr = Math.min(255, tint.r * k);
    const tg = Math.min(255, tint.g * k);
    const tb = Math.min(255, tint.b * k);
    d[p] += (tr - d[p]) * m;
    d[p + 1] += (tg - d[p + 1]) * m;
    d[p + 2] += (tb - d[p + 2]) * m;
  }
  ctx.putImageData(work, 0, 0);
}

export default function PanoramaViewer({
  sceneKey,
  panorama,
  mask,
  hotspots,
  startPitch = 0,
  startYaw = 0,
  color,
  strength,
  onNavigate,
  overlay,
}: PanoramaViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const dataRef = useRef<RecolorData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentScene = useRef<SceneRef | null>(null);
  const originalUrl = useRef("");
  const allUrls = useRef<string[]>([]);
  const appliedKey = useRef("none");
  const counter = useRef(0);
  const busy = useRef(false);
  const dirty = useRef(false);

  // Always-fresh values, readable from callbacks without re-creating the viewer
  const latest = useRef({ color, strength });
  const hotspotsRef = useRef(hotspots);
  const startRef = useRef({ pitch: startPitch, yaw: startYaw });
  const navigateRef = useRef(onNavigate);

  // Keep the refs in sync after every render (not during it)
  useLayoutEffect(() => {
    latest.current = { color, strength };
    hotspotsRef.current = hotspots;
    startRef.current = { pitch: startPitch, yaw: startYaw };
    navigateRef.current = onNavigate;
  });

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [autoRotate, setAutoRotate] = useState(false);

  // Fresh hotspot objects for every scene (Pannellum attaches DOM nodes to them)
  const makeHotSpots = useCallback(
    () =>
      hotspotsRef.current.map((h) => ({
        pitch: h.pitch,
        yaw: h.yaw,
        type: "info",
        cssClass: "hue-hotspot",
        createTooltipFunc: buildHotspot,
        createTooltipArgs: h.label,
        clickHandlerFunc: () => {
          console.log("hotspot clicked, going to:", h.to);
          navigateRef.current(h.to);
        },
      })),
    [],
  );

  // 1) Load the room whenever it changes
  useEffect(() => {
    let cancelled = false;
    let timeout = 0;
    setStatus("loading");
    setAutoRotate(false);

    async function init() {
      try {
        const [pannellum, img, maskImg] = await Promise.all([
          loadPannellum(),
          loadImage(panorama),
          mask ? loadImage(mask) : Promise.resolve(null),
        ]);
        if (cancelled || !containerRef.current) return;

        const maxW = window.innerWidth < 768 ? 2560 : 4096;
        const scale = Math.min(1, maxW / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, w, h);

        if (maskImg) dataRef.current = buildRecolorData(ctx, w, h, maskImg);
        canvasRef.current = canvas;

        // Original, exported once (used for "no color")
        const original = await toBlobUrl(canvas);
        allUrls.current.push(original);
        originalUrl.current = original;

        // If a color is already chosen, open the room already painted
        let firstUrl = original;
        const { color: c0, strength: s0 } = latest.current;
        if (dataRef.current && c0) {
          paint(dataRef.current, { ...hexToRgb(c0), s: s0 });
          firstUrl = await toBlobUrl(canvas);
          allUrls.current.push(firstUrl);
          appliedKey.current = keyOf(c0, s0);
        } else {
          appliedKey.current = "none";
        }

        if (cancelled || !containerRef.current) return;
        currentScene.current = { id: "s0", url: firstUrl };

        const viewer = pannellum.viewer(containerRef.current, {
          default: {
            firstScene: "s0",
            sceneFadeDuration: 250,
            autoLoad: true,
            showControls: false,
            compass: false,
            hfov: 100,
            minHfov: 55,
            maxHfov: 120,
            mouseZoom: "fullscreenonly",
          },
          scenes: {
            s0: {
              type: "equirectangular",
              panorama: firstUrl,
              pitch: startRef.current.pitch,
              yaw: startRef.current.yaw,
              hotSpots: makeHotSpots(),
            },
          },
        });
        viewerRef.current = viewer;

        viewer.on("load", () => {
          window.clearTimeout(timeout);
          if (!cancelled) setStatus("ready");
        });
        viewer.on("error", (message) => {
          console.error("Pannellum:", message);
          window.clearTimeout(timeout);
          if (!cancelled) setStatus("error");
        });

        timeout = window.setTimeout(() => {
          if (!cancelled) setStatus((s) => (s === "loading" ? "error" : s));
        }, 25000);
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      viewerRef.current?.destroy();
      viewerRef.current = null;
      dataRef.current = null;
      canvasRef.current = null;
      currentScene.current = null;
      busy.current = false;
      dirty.current = false;
      allUrls.current.forEach((u) => URL.revokeObjectURL(u));
      allUrls.current = [];
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [sceneKey, panorama, mask, makeHotSpots]);

  // 2) Render the recolored image and crossfade to it
  const render = useCallback(async () => {
    if (busy.current) {
      dirty.current = true;
      return;
    }
    busy.current = true;
    try {
      do {
        dirty.current = false;
        const viewer = viewerRef.current;
        const data = dataRef.current;
        const canvas = canvasRef.current;
        if (!viewer || !data || !canvas) return;

        const { color: c, strength: s } = latest.current;
        const key = keyOf(c, s);
        if (key === appliedKey.current) continue; // already showing this

        let url: string;
        if (!c) {
          url = originalUrl.current;
        } else {
          paint(data, { ...hexToRgb(c), s });
          url = await toBlobUrl(canvas);
          allUrls.current.push(url);
        }
        if (viewerRef.current !== viewer) return; // room changed meanwhile

        const prev = currentScene.current;
        if (prev && prev.url === url) {
          appliedKey.current = key;
          continue;
        }

        const id = `s${++counter.current}`;
        viewer.addScene(id, {
          type: "equirectangular",
          panorama: url,
          hotSpots: makeHotSpots(),
        });
        viewer.loadScene(
          id,
          viewer.getPitch(),
          viewer.getYaw(),
          viewer.getHfov(),
        );
        currentScene.current = { id, url };
        appliedKey.current = key;

        if (prev) {
          window.setTimeout(() => {
            try {
              viewer.removeScene(prev.id);
            } catch {}
            if (prev.url !== originalUrl.current) {
              URL.revokeObjectURL(prev.url);
              allUrls.current = allUrls.current.filter((u) => u !== prev.url);
            }
          }, 1500);
        }
      } while (dirty.current);
    } catch (err) {
      console.error(err);
    } finally {
      busy.current = false;
    }
  }, [makeHotSpots]);

  useEffect(() => {
    if (status !== "ready" || !dataRef.current) return;
    const t = window.setTimeout(() => void render(), 90);
    return () => window.clearTimeout(t);
  }, [color, strength, status, render]);

  // Controls
  const zoom = (delta: number) => {
    const v = viewerRef.current;
    if (v) v.setHfov(v.getHfov() + delta, 300);
  };
  const reset = () =>
    viewerRef.current?.lookAt(
      startRef.current.pitch,
      startRef.current.yaw,
      100,
      800,
    );
  const toggleRotate = () => {
    const v = viewerRef.current;
    if (!v) return;
    if (autoRotate) v.stopAutoRotate();
    else v.startAutoRotate(-6);
    setAutoRotate(!autoRotate);
  };
  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const stroke = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden rounded-2xl bg-[#243D35]"
    >
      <div ref={containerRef} className="h-full w-full bg-[#243D35]!" />

      {overlay && (
        <div className="absolute left-4 top-4 z-20 max-w-[calc(100%-2rem)]">
          {overlay}
        </div>
      )}

      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#243D35] text-white">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
          <p className="text-sm text-white/80">Preparing your room...</p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#243D35] p-6 text-center text-white">
          <p className="max-w-xs text-sm text-white/80">
            We couldn&apos;t load this room. Check the browser console for
            details, and make sure the image is a 2:1 panorama.
          </p>
        </div>
      )}

      {status === "ready" && (
        <>
          <p className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-xs text-white backdrop-blur-md sm:flex">
            <svg {...stroke} width={14} height={14}>
              <path d="M5 12h14M9 8l-4 4 4 4M15 8l4 4-4 4" />
            </svg>
            Drag to look around
          </p>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <ControlButton label="Zoom in" onClick={() => zoom(-12)}>
              <svg {...stroke}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </ControlButton>
            <ControlButton label="Zoom out" onClick={() => zoom(12)}>
              <svg {...stroke}>
                <path d="M5 12h14" />
              </svg>
            </ControlButton>
            <ControlButton
              label="Auto rotate"
              onClick={toggleRotate}
              active={autoRotate}
            >
              <svg {...stroke}>
                <path d="M20 12a8 8 0 11-2.3-5.6M20 4v5h-5" />
              </svg>
            </ControlButton>
            <ControlButton label="Reset view" onClick={reset}>
              <svg {...stroke}>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
              </svg>
            </ControlButton>
            <ControlButton label="Fullscreen" onClick={toggleFullscreen}>
              <svg {...stroke}>
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            </ControlButton>
          </div>
        </>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${
        active
          ? "bg-white text-[#243D35]"
          : "bg-black/35 text-white hover:bg-black/55"
      }`}
    >
      {children}
    </button>
  );
}
