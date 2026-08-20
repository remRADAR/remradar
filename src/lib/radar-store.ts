export type RadarStoreService = {
  id: "page-post" | "artist-spotlight" | "release-campaign" | "premium-campaign";
  name: string;
  category: "Visibility" | "Editorial" | "Campaigns";
  description: string;
  priceNgn: number;
  featured: boolean;
};

export const RADAR_STORE_SERVICES: readonly RadarStoreService[] = [
  {
    id: "page-post",
    name: "Page Post",
    category: "Visibility",
    description: "Strategic placement across RADARCharts editorial channels.",
    priceNgn: 50_000,
    featured: true,
  },
  {
    id: "artist-spotlight",
    name: "Artist Spotlight",
    category: "Editorial",
    description: "A dedicated editorial feature designed to introduce an artist to the RADAR audience.",
    priceNgn: 100_000,
    featured: true,
  },
  {
    id: "release-campaign",
    name: "Release Campaign",
    category: "Campaigns",
    description: "Strategic promotional support built around a music release.",
    priceNgn: 250_000,
    featured: true,
  },
  {
    id: "premium-campaign",
    name: "Premium Campaign",
    category: "Campaigns",
    description: "A larger-scale campaign pathway for artists, brands, and projects.",
    priceNgn: 500_000,
    featured: false,
  },
];

export const RADAR_STORE_WHATSAPP_URL = "https://wa.me/message/XSNQAJYPTVEEJ1";

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
