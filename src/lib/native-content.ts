import { readFile } from "node:fs/promises";
import path from "node:path";

export type HomepageComponentReplacement = {
  componentKey: string;
  label: string;
  selector: string;
  text: string;
  imageUrl: string;
  videoFallbackUrl?: string;
  posterUrl?: string;
  imageFit: "contain" | "cover";
  imagePosition: string;
  mediaType: "image" | "video";
  enabled: boolean;
  updatedAt: string;
};

export type NativeComponentReplacement = HomepageComponentReplacement & {
  componentKey: "aktiv-section";
};

const FALLBACK: NativeComponentReplacement = {
  componentKey: "aktiv-section",
  label: "Third section / looping media",
  selector: ".framer-50j9t5-container",
  text: "",
  imageUrl: "/framer-site/_deps/images/radarmatrix-home-loop.webm",
  videoFallbackUrl: "/framer-site/_deps/images/radarmatrix-home-loop.mp4",
  posterUrl: "/framer-site/_deps/images/radarmatrix-home-poster.jpg",
  imageFit: "cover",
  mediaType: "video",
  imagePosition: "50% 50%",
  enabled: true,
  updatedAt: "2026-08-20",
};

export async function getHomepageComponents(): Promise<HomepageComponentReplacement[]> {
  try {
    const filePath = path.join(process.cwd(), "content", "homepage-components.json");
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as { components?: HomepageComponentReplacement[] };
    return parsed.components?.length ? parsed.components : [FALLBACK];
  } catch {
    return [FALLBACK];
  }
}

export async function getNativeComponentReplacement(): Promise<NativeComponentReplacement> {
  const components = await getHomepageComponents();
  return (components.find((component) => component.componentKey === "aktiv-section") ?? FALLBACK) as NativeComponentReplacement;
}

export { FALLBACK as defaultNativeComponentReplacement };
