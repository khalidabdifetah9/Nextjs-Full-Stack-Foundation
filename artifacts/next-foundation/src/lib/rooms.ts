export interface Room {
  id: string;
  name: string;
  category: "Interior" | "Exterior";
  panorama: string; // 2:1 equirectangular JPG
  mask?: string; // same framing, white = paintable. Optional.
  thumb: string; // small preview image
}

export const rooms: Room[] = [
  {
    id: "living",
    name: "Modern Living Room",
    category: "Interior",
    panorama: "/rooms/360/r3.png",
    mask: "/rooms/mask/bathroom_wall_mask.png",
    thumb: "/rooms/living.png",
  },
  {
    id: "kitchen",
    name: "Open Kitchen",
    category: "Interior",
    panorama: "/rooms/kitchen.jpg",
    mask: "/rooms/kitchen-mask.png",
    thumb: "/rooms/kitchen-thumb.jpg",
  },
  {
    id: "bedroom",
    name: "Master Bedroom",
    category: "Interior",
    panorama: "/rooms/bedroom.jpg",
    mask: "/rooms/bedroom-mask.png",
    thumb: "/rooms/bedroom-thumb.jpg",
  },
  {
    id: "facade",
    name: "Villa Exterior",
    category: "Exterior",
    panorama: "/rooms/facade.jpg",
    mask: "/rooms/facade-mask.png",
    thumb: "/rooms/facade-thumb.jpg",
  },
];