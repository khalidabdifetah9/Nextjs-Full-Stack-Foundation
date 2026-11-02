export interface Property {
  id: string;
  slug: string;
  label: string;
  description: string;
  price: string;
  location: string;
  src: string;
  alt: string;
  features: {
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
    sqft: number;
  };
  image: string;
}

export const featuredProperties: Property[] = [
  {
    id: "prop-1",
    slug: "the-minimalist-haven",
    label: "The Minimalist Haven",
    description:
      "An architectural masterpiece featuring open-plan living spaces and crisp white interior walls designed for custom color layering.",
    price: "$450,000",
    src: "/properties/property-1.jpg",
    alt: "minimalist haven property image",
    location: "Addis Ababa, Ayat",
    features: {
      bedrooms: 3,
      bathrooms: 2,
      kitchens: 1,
      sqft: 2400,
    },
    image: "/properties/property-1.jpg",
  },
  {
    id: "prop-2",
    slug: "scandinavian-light-loft",
    label: "Scandinavian Light Loft",
    description:
      "Bathed in natural daylight with expansive floor-to-ceiling windows, offering a blank canvas for warm earthy tones and modern wood accents.",
    price: "$580,000",
    src: "/properties/property-2.jpg",
    alt: "Scandinavian property image",
    location: "Addis Ababa, Bole",
    features: {
      bedrooms: 4,
      bathrooms: 3,
      kitchens: 1,
      sqft: 3100,
    },
    image: "/properties/property-2.jpg",
  },
  {
    id: "prop-3",
    slug: "modern-aurora-residence",
    label: "Modern Aurora Residence",
    description:
      "Sleek lines and high ceilings optimized for dynamic interior lighting setups and sophisticated palette personalization.",
    price: "$620,000",
    src: "/properties/property-3.jpg",
    alt: "Aurora property image",
    location: "Addis Ababa, CMC",
    features: {
      bedrooms: 3,
      bathrooms: 3,
      kitchens: 2,
      sqft: 2850,
    },
    image: "/properties/property-3.jpg",
  },
];

export default featuredProperties;
