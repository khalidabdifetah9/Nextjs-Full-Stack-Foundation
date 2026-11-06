export interface PaletteColor {
  id: string;
  name: string;
  hex: string;
}

export const palette: PaletteColor[] = [
  { id: "sage", name: "Sage", hex: "#A8B5A0" },
  { id: "forest", name: "Forest", hex: "#243D35" },
  { id: "sand", name: "Sand", hex: "#DCD9CE" },
  { id: "terracotta", name: "Terracotta", hex: "#C8785A" },
  { id: "clay", name: "Clay", hex: "#B5654A" },
  { id: "warm-white", name: "Warm White", hex: "#F2EDE4" },
  { id: "stone", name: "Stone", hex: "#8E8A82" },
  { id: "charcoal", name: "Charcoal", hex: "#3A3D40" },
  { id: "ocean", name: "Ocean", hex: "#3E6A7C" },
  { id: "navy", name: "Navy", hex: "#2F4259" },
  { id: "rose", name: "Dusty Rose", hex: "#D4A5A0" },
  { id: "mustard", name: "Mustard", hex: "#D9A441" },
  { id: "olive", name: "Olive", hex: "#6B6B3A" },
  { id: "sky", name: "Sky", hex: "#A9C4D6" },
  { id: "lavender", name: "Lavender", hex: "#B9A9C9" },
  { id: "blush", name: "Blush", hex: "#EBC9BC" },
];

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}