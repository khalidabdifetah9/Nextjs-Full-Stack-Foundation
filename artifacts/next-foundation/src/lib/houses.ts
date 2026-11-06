export interface Hotspot {
  to: string;
  label: string;
  pitch: number; 
  yaw: number; 
}

export interface HouseRoom {
  id: string;
  name: string;
  panorama: string; 
  mask?: string; 
  startPitch?: number; 
  startYaw?: number;
  hotspots: Hotspot[];
}

export interface House {
  id: string;
  name: string;
  type: string;
  status: "For Sale" | "For Rent";
  location: string;
  price: number; 
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  garage: string;
  yearBuilt: number;
  lotSize: string;
  description: string;
  features: string[];
  thumb: string;
  rooms: HouseRoom[];
}

export const houses: House[] = [
  {
    id: "maple",
    name: "Bole Haven Residence",
    type: "Apartment",
    status: "For Sale",
    location: "Bole, Addis Ababa, Ethiopia",
    price: 12500000,
    sqft: 920,
    bedrooms: 1,
    bathrooms: 1,
    garage: "2 cars",
    yearBuilt: 2022,
    lotSize: "Apartment unit",
    description:
      "A warm, well-lit apartment with a spacious living room finished in polished wood-look flooring, cream walls and a large window dressed with sheer curtains. A short step leads up to a half-wall overlooking the stairs, and the bright master bedroom has built-in white wardrobes, a feature fireplace and a connected en-suite bathroom. The neutral walls make it ready for your own colours.",
    features: [
      "Spacious open living room",
      "Large window with garden view",
      "Built-in bedroom wardrobes",
      "Bedroom fireplace",
      "En-suite bathroom",
    ],
    thumb: "/rooms/360/livingroom_forbed.png",
    rooms: [
      {
        id: "living",
        name: "Living Room",
        panorama: "/rooms/360/livingroom_forbed.png",
        mask: "/rooms/mask/ulebombo_wall_mask.png",
        hotspots: [
          { to: "bedroom", label: "Master Bedroom", pitch: -4, yaw: -110 },
        ],
      },
      {
        id: "bedroom",
        name: "Master Bedroom",
        panorama: "/rooms/360/bedroom.png",
        mask: "/rooms/mask/lythwood_wall_mask_hires.png",
        startYaw: -90,
        hotspots: [{ to: "living", label: "Living Room", pitch: -5, yaw: 248 }],
      },
    ],
  },
  {
    id: "lakeside",
    name: "CMC Classic Suite",
    type: "Classic Apartment",
    status: "For Sale",
    location: "CMC, Addis Ababa, Ethiopia",
    price: 6800000, // ETB
    sqft: 780,
    bedrooms: 1,
    bathrooms: 1,
    garage: "secure parking",
    yearBuilt: 2020,
    lotSize: "Apartment unit",
    description:
      "An elegant open lounge with decorative wall panelling, a built-in fireplace, recessed ceiling lights and textured feature walls. Two glass doors open onto a balcony with green neighbourhood views, and the dark wood-style floor adds contrast. Next to the lounge is a modern bathroom with grey stone-look tiles, a walk-in glass shower, a corner bathtub, a heated towel rail and a skylight.",
    features: [
      "Panelled lounge with fireplace",
      "Balcony with glass doors",
      "Recessed ceiling lighting",
      "Walk-in shower and corner bathtub",
      "Skylight in bathroom",
    ],
    thumb: "/rooms/360/living.png",
    rooms: [
      {
        id: "lounge",
        name: "Lounge",
        panorama: "/rooms/360/living.png",
        mask: "/rooms/mask/living.png",
        hotspots: [{ to: "bathroom", label: "bath Room", pitch: -3, yaw: 248 }],
      },
      {
        id: "bathroom",
        name: "Bath Room",
        panorama: "/rooms/360/bathroom.png",
        mask: "/rooms/mask/bathforliving.png",
        startYaw: 120,
        hotspots: [
          { to: "lounge", label: "Lounge", pitch: -3, yaw: 120 },
        ],
      },
    ],
  },
  {
    id: "office",
    name: "Kazanchis Business Office",
    type: "Office Space",
    status: "For Rent",
    location: "Kazanchis, Addis Ababa, Ethiopia",
    price: 35000,
    sqft: 650,
    bedrooms: 0,
    bathrooms: 0,
    garage: "secure parking",
    yearBuilt: 2023,
    lotSize: "Office unit",
    description:
      "A bright, open office room with warm tan walls, glossy beige floor tiles and a large grilled window that lets in plenty of daylight. It has a single white panelled door, several wall sockets and a central ceiling light. It is an empty canvas that can be set up as a team office, a studio or a meeting room.",
    features: [
      "Open, flexible floor plan",
      "Large window with natural light",
      "Easy-clean glossy tile floor",
      "Plenty of wall sockets",
    ],
    thumb: "/rooms/360/office.jpg",
    rooms: [
      {
        id: "main-hall",
        name: "Main Living Area",
        panorama: "/rooms/360/office.jpg",
        mask: "/rooms/mask/office_wall_mask.png",
        hotspots: [],
      },
    ],
  },
  {
    id: "cedar-crest",
    name: "Entoto Studio Loft",
    type: "Studio Residence",
    status: "For Sale",
    location: "Entoto Road, Addis Ababa, Ethiopia",
    price: 3000000,
    sqft: 540,
    bedrooms: 1,
    bathrooms: 1,
    garage: "public parking",
    yearBuilt: 2021,
    lotSize: "Apartment unit",
    description:
      "A single open great room with plain, paintable walls that connects to a kitchen and an outdoor patio. It is designed as a flexible studio where living, sleeping and dining share one space, ready to be personalised with your own wall colours.",
    features: [
      "Open great room",
      "Connected kitchen",
      "Outdoor patio access",
      "Paintable walls",
    ],
    thumb: "/rooms/360/single_room.png",
    rooms: [
      {
        id: "great-room",
        name: "Great Room",
        panorama: "/rooms/360/single_room.png",
        mask: "/rooms/mask/single2_mask.png",
        hotspots: [
          { to: "kitchen", label: "Chef's Kitchen", pitch: -3, yaw: 90 },
          { to: "patio", label: "Outdoor Patio", pitch: -5, yaw: -80 },
        ],
      },
    ],
  },
  {
    id: "whispering-pines",
    name: "Hawassa Family Home",
    type: "Family Home",
    status: "For Rent",
    location: "Hawassa, Sidama, Ethiopia",
    price: 45000,
    sqft: 1050,
    bedrooms: 2,
    bathrooms: 1,
    garage: "1 car",
    yearBuilt: 2019,
    lotSize: "250 m²",
    description:
      "A cheerful single-level home with a central living area, tan walls, cream floor tiles with a decorative inlay border and a ceiling fan. The living area opens to a kitchen with warm wood cabinets and has a wooden front door and several windows that bring in daylight. Two bedrooms with their own doors and a separate bathroom with cream tiles open off the living area.",
    features: [
      "Wooden kitchen cabinets",
      "Ceiling fan in living area",
      "Decorative tiled floor",
      "Two bedrooms and a bathroom",
      "Plenty of natural light",
    ],
    thumb: "/rooms/360/smallhouse.png",
    rooms: [
      {
        id: "living-room",
        name: "Living Room",
        panorama: "/rooms/360/smallhouse.png",
        mask: "/rooms/mask/r1_mask.png",
        hotspots: [
          { to: "room1", label: "Room 1", pitch: -4, yaw: 123 },
          { to: "room2", label: "Room 2", pitch: -3, yaw: -105 },
          { to: "bathroom", label: "Bath Room", pitch: -3, yaw: 155 },
        ],
      },
      {
        id: "room1",
        name: "Room 1",
        panorama: "/rooms/360/room1.png",
        mask: "/rooms/mask/r2_mask.png",
        hotspots: [
          { to: "living-room", label: "living-room", pitch: -5, yaw: -250 },
        ],
      },
      {
        id: "room2",
        name: "Room 2",
        panorama: "/rooms/360/room1.png",
        mask: "/rooms/mask/r2_mask.png",
        startYaw: 75,
        hotspots: [
          { to: "living-room", label: "Living Room", pitch: -4, yaw: -250 },
        ],
      },
      {
        id: "bathroom",
        name: "Bath Room",
        panorama: "/rooms/360/bathroom_for_smallhouse.png",
        mask: "/rooms/mask/bathroom_wall_mask.png",
        startYaw: 45,
        hotspots: [
          { to: "living-room", label: "Living Room", pitch: -4, yaw: 80 },
        ],
      },
    ],
  },
];