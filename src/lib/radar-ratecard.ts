export type RadarRateCardItem = {
  name: string;
  price?: string;
  detail?: string;
};

export type RadarRateCardSection = {
  title: string;
  eyebrow?: string;
  items: RadarRateCardItem[];
};

export const RADAR_RATE_CARD_SOURCE = "https://radarcharts.net/ratecard";

export const RADAR_RATE_CARD_SECTIONS: RadarRateCardSection[] = [
  {
    title: "Social Media & Digital Promotion",
    items: [
      { name: "Instagram Ads", price: "Starting at ₦30,000", detail: "₦50,000 with ads" },
      { name: "TikTok Ads", price: "Minimum of ₦10,000" },
      { name: "YouTube Ads", price: "Minimum of $25" },
      { name: "VEVO Ads", price: "Minimum of $100" },
      { name: "Blog Features & Article Spotlight", price: "Starting at ₦30,000", detail: "₦50,000 with Spotlight" },
      { name: "Feature Request Emails", price: "₦10,000", detail: "For playlists and editorial placements" },
    ],
  },
  {
    title: "Radio & Airplay Services",
    items: [
      { name: "Single Song Radio Promotion", price: "₦400,000 per city", detail: "City-specific airplay" },
      { name: "Nationwide Radio Campaign", price: "₦700,000", detail: "Multiple cities" },
      { name: "Exclusive Radio Interview & Press Tour", price: "₦300,000 per station" },
      { name: "DJ Servicing & Rotation", price: "₦200,000 per week" },
    ],
  },
  {
    title: "Content Creation & Music Video Services",
    items: [
      { name: "Professional Lyric Video", price: "₦50,000" },
      { name: "Social Media Promo Content", price: "Starting at ₦50,000", detail: "Reels, teasers, snippets, BTS, and more; +₦10,000 for daily sponsored ad" },
      { name: "Performance Visuals & Freestyle Video Shoot", price: "₦400,000" },
      { name: "Live Interview Session", price: "₦150,000", detail: "10 minutes minimum" },
      { name: "Music Video Shoot", price: "Starting at ₦500,000", detail: "Concept and execution" },
      { name: "Creative Direction & Content Strategy Session", price: "₦150,000" },
    ],
  },
  {
    title: "Marketing Consultation & Industry Toolkit",
    eyebrow: "RADARKIT",
    items: [
      { name: "Music Marketing Consultation", price: "₦50,000 per hour", detail: "One-on-one session" },
      { name: "Artist Branding & Release Strategy Plan", price: "₦200,000" },
      { name: "RADARCharts Music Industry Toolkit", price: "₦300,000", detail: "Artist EPK, site page, profile personalization, Google Panel, and press release" },
    ],
  },
  {
    title: "Music Distribution Services",
    eyebrow: "RADARMUSIC",
    items: [
      { name: "Music Distribution Onboarding", price: "₦30,000", detail: "One-time fee" },
      { name: "Redistribution of Old Songs", price: "₦20,000" },
      { name: "Video Distribution to VEVO, Spotify & Apple Music", price: "₦250,000" },
    ],
  },
  {
    title: "Spotify",
    items: [
      { name: "Curated Playlists", price: "Starts from ₦20,000" },
      { name: "3 Playlists Package", price: "₦50,000" },
      { name: "6 Playlists Package", price: "₦100,000" },
    ],
  },
  {
    title: "Audiomack",
    items: [
      { name: "Audiomack Trending", price: "₦150,000" },
      { name: "Guaranteed Audiomack Editorials", price: "₦250,000" },
    ],
  },
  {
    title: "Boomplay",
    items: [
      { name: "Editorial Playlist Cover", price: "₦300,000", detail: "Guaranteed" },
      { name: "Boomplay Basic Playlists", price: "₦100,000", detail: "2 or 3 playlists; guaranteed" },
      { name: "Boomplay Premium Playlists", price: "₦150,000", detail: "5 playlists; guaranteed" },
      { name: "Boomplay Super Priority & Premium Playlists", price: "₦300,000", detail: "10 playlists; guaranteed" },
      { name: "20 Playlists", price: "₦550,000", detail: "With support such as pop-up ads, editor pick, and trending" },
      { name: "25 Playlists", price: "₦500,000", detail: "With support such as pop-up ads, editor pick, and trending" },
    ],
  },
  {
    title: "Editorial Playlist Campaign Pitching",
    items: [
      { name: "All platforms", price: "₦350,000", detail: "Not guaranteed without distribution of track. Apple Music, Spotify, Audiomack, Pandora, YouTube Music, and Tidal." },
      { name: "Processing time", price: "10 to 12 days" },
    ],
  },
  {
    title: "Curated Playlists",
    items: [
      { name: "Spotify recommended package", price: "₦150,000", detail: "5 algorithmic and 3–5 genre-based playlists; target: 10k streams and 1.5k+ monthly listeners" },
      { name: "Apple Music recommended package", price: "₦150,000", detail: "5 algorithmic and 3–5 genre-based playlists; target: 10k+ streams" },
      { name: "Singular playlist placement", price: "₦15,000", detail: "Per playlist on Spotify and Apple Music" },
    ],
  },
  {
    title: "Custom Packages & Bulk Deals",
    items: [
      { name: "Customized marketing campaigns", detail: "We offer customized marketing campaigns and discounted rates for bulk services. Contact us for a personalized plan." },
    ],
  },
];
