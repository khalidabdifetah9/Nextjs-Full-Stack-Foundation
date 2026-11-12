import { db } from "./index";
import { houses } from "./schema";

const seedHouses: (typeof houses.$inferInsert)[] = [
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
  },
  {
    id: "lakeside",
    name: "CMC Classic Suite",
    type: "Classic Apartment",
    status: "For Sale",
    location: "CMC, Addis Ababa, Ethiopia",
    price: 6800000,
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
  },
];

async function main() {
  // Upsert: running this again updates existing rows instead of failing
  for (const house of seedHouses) {
    await db
      .insert(houses)
      .values(house)
      .onConflictDoUpdate({ target: houses.id, set: house });
  }

  console.log(`Seeded ${seedHouses.length} houses`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});