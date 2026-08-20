import { readFile } from "node:fs/promises";
import path from "node:path";

export type NativeComponentReplacement = {
  componentKey: "aktiv-section";
  text: string;
  imageUrl: string;
  imageFit: "contain" | "cover";
  mediaType?: "image" | "video";
  imagePosition: string;
  updatedAt: string;
};

const FALLBACK: NativeComponentReplacement = {
  componentKey: "aktiv-section",
  text: "",
  imageUrl: "/framer-site/_deps/images/aktiv-section-loop.webm",
  imageFit: "cover",
  mediaType: "video",
  imagePosition: "50% 50%",
  updatedAt: "2026-08-20",
};

export async function getNativeComponentReplacement(): Promise<NativeComponentReplacement> {
  try {
    const filePath = path.join(process.cwd(), "content", "component-replacements.json");
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<NativeComponentReplacement>;
    return {
      ...FALLBACK,
      ...parsed,
      componentKey: "aktiv-section",
    };
  } catch {
    return FALLBACK;
  }
}

export { FALLBACK as defaultNativeComponentReplacement };
