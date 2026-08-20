export type FramerPageSection = {
  eyebrow?: string;
  title?: string;
  body?: string;
  items?: string[];
};

export type FramerPageDefinition = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: FramerPageSection[];
};

export const FRAMER_PAGE_DEFINITIONS: Record<string, FramerPageDefinition> = {
  charts: {
    slug: "charts",
    eyebrow: "001 / SWICON",
    title: "Nature Escape",
    intro: "Discover the beauty of natural landscapes.",
    sections: [{ title: "RADARCharts", body: "Culture, discovery, and independent music in motion." }],
  },
  ontheradar: {
    slug: "ontheradar",
    eyebrow: "RADARARTICLE",
    title: "Explore our editorial radar",
    intro: "Explore our blog hub, where we serve up a mix of insightful articles, tips, and stories designed to spark curiosity.",
    sections: [],
  },
  magazine: {
    slug: "magazine",
    eyebrow: "TALK TO US",
    title: "Special Guests",
    intro: "A closer look at the voices, artists, and cultural figures moving the conversation forward.",
    sections: [{ title: "The Magazine", body: "Conversations, ideas, and discoveries from the RADARCharts world." }],
  },
  radarmusic: {
    slug: "radarmusic",
    eyebrow: "RADARMUSIC",
    title: "The RADARMusic",
    intro: "Born from the heart of RADARCharts, The MOTHERLand is a vibrant creative sanctuary dedicated to uplifting, uniting, and unleashing the full potential of women in entertainment.",
    sections: [
      { title: "Creative Spaces", body: "Modern design", items: ["Popular"] },
      { title: "Digital Innovation", body: "Future technology", items: ["Explore the signal"] },
      { title: "Peaceful Moments", body: "Tranquil settings", items: ["Find your frequency"] },
    ],
  },
  platforms: {
    slug: "platforms",
    eyebrow: "RADAR",
    title: "A cultural platform in motion",
    intro: "From creative concepts to unforgettable campaigns, RADAR is a friendly, focused crew ready to turn ideas into cultural momentum.",
    sections: [
      { title: "Charts", body: "Discover what is moving next." },
      { title: "RADARMusic", body: "Hear the signal behind the noise." },
      { title: "Motherland", body: "Amplify women in entertainment." },
    ],
  },
  playlists: {
    slug: "playlists",
    eyebrow: "PLAYLISTS",
    title: "Soundtracks for the moment",
    intro: "Curated selections for every phase of the journey, from first listen to repeat play.",
    sections: [
      { title: "Creative Spaces", body: "Modern design", items: ["Popular"] },
      { title: "Digital Innovation", body: "Future technology" },
      { title: "Peaceful Moments", body: "Tranquil settings" },
    ],
  },
  store: {
    slug: "store",
    eyebrow: "RADAR STORE",
    title: "Ideas made tangible",
    intro: "Join us on a journey where ideas transform into captivating cultural products, with creativity and a whole lot of fun.",
    sections: [
      { title: "Pre-Production", body: "Ideas take shape through concept development, scriptwriting, storyboarding, talent, and planning." },
      { title: "Production", body: "The heart of the work, where vision becomes a living experience." },
      { title: "Post-Production", body: "The final layer of craft: editing, sound, colour, motion, and detail." },
    ],
  },
  spotlights: {
    slug: "spotlights",
    eyebrow: "RADAR SPOTLIGHTS",
    title: "People, projects, and possibilities",
    intro: "A living catalogue of the artists, brands, creators, and cultural moments worth a closer look.",
    sections: [
      { title: "Featured categories", items: ["Animation", "Commercials", "Corporate", "Documentary", "Educational", "Entertainment", "Event", "Fashion", "Interview", "Lifestyle", "Product Video", "Real Estate", "Social Media"] },
      { title: "Featured work", items: ["A Travel Vlog Adventure", "EcoScape Solutions", "FoodWonders Culinary Journeys", "EcoGlow EcoCharge Power Bank", "ElevateCorp Corporate Video", "Executive Insights"] },
    ],
  },
  motherland: {
    slug: "motherland",
    eyebrow: "THE MOTHERLAND",
    title: "A sanctuary for women in entertainment",
    intro: "Born from the heart of RADARCharts, The MOTHERLand exists to uplift, unite, and unleash the full potential of female artists, storytellers, visionaries, and culture-shapers.",
    sections: [{ title: "RADARCharts 2025", body: "A movement that amplifies her voice, celebrates her journey, and fuels her rise." }],
  },
  about: {
    slug: "about",
    eyebrow: "ABOUT RADAR",
    title: "The team behind the signal",
    intro: "Discover the people and principles shaping RADARCharts, where passion meets pixels, culture, and a commitment to excellence.",
    sections: [
      { title: "Our mission", body: "Transform ideas into compelling visual and cultural stories." },
      { title: "Our values", items: ["Creativity", "Quality", "Collaboration", "Integrity"] },
      { title: "How we work", body: "We keep the creative process open, collaborative, and relentlessly focused on making the work unforgettable." },
    ],
  },
};

export const PAGE_ALIASES: Record<string, keyof typeof FRAMER_PAGE_DEFINITIONS> = {
  contact: "about",
  "editorial-archive": "ontheradar",
};

export const ACTIVE_FRAMER_ROUTES = Object.keys(FRAMER_PAGE_DEFINITIONS);
