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
