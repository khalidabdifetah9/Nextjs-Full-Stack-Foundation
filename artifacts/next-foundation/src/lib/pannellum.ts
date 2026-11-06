export interface PannellumViewer {
  destroy(): void;
  getHfov(): number;
  getPitch(): number;
  getYaw(): number;
  setHfov(hfov: number, animated?: number | boolean): PannellumViewer;
  lookAt(
    pitch: number,
    yaw: number,
    hfov?: number,
    animated?: number | boolean
  ): PannellumViewer;
  startAutoRotate(speed?: number, pitch?: number): PannellumViewer;
  stopAutoRotate(): PannellumViewer;
  addScene(sceneId: string, config: Record<string, unknown>): PannellumViewer;
  loadScene(
    sceneId: string,
    pitch?: number,
    yaw?: number,
    hfov?: number
  ): PannellumViewer;
  removeScene(sceneId: string): boolean;
  on(type: string, listener: (...args: unknown[]) => void): PannellumViewer;
}
export interface PannellumStatic {
  viewer(
    container: HTMLElement | string,
    config: Record<string, unknown>
  ): PannellumViewer;
}

declare global {
  interface Window {
    pannellum?: PannellumStatic;
  }
}

const BASE = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build";
let loading: Promise<PannellumStatic> | null = null;

export function loadPannellum(): Promise<PannellumStatic> {
  if (loading) return loading;

  loading = new Promise<PannellumStatic>((resolve, reject) => {
    if (window.pannellum) return resolve(window.pannellum);

    if (!document.querySelector("link[data-pannellum]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${BASE}/pannellum.css`;
      link.dataset.pannellum = "true";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = `${BASE}/pannellum.js`;
    script.async = true;
    script.onload = () =>
      window.pannellum
        ? resolve(window.pannellum)
        : reject(new Error("Pannellum failed to initialise"));
    script.onerror = () => {
      loading = null;
      reject(new Error("Could not load Pannellum"));
    };
    document.body.appendChild(script);
  });

  return loading;
}