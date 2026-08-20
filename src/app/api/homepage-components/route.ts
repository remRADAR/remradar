import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getHomepageComponents, type HomepageComponentReplacement } from "@/lib/native-content";

const filePath = path.join(process.cwd(), "content", "homepage-components.json");

function authorized(request: Request) {
  const configured = process.env.NATIVE_ADMIN_TOKEN;
  return Boolean(configured && request.headers.get("x-native-admin-token") === configured);
}

function validComponent(value: unknown): value is Partial<HomepageComponentReplacement> {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.componentKey === "string" &&
    (payload.text === undefined || typeof payload.text === "string") &&
    (payload.imageUrl === undefined || typeof payload.imageUrl === "string") &&
    (payload.imageFit === undefined || payload.imageFit === "contain" || payload.imageFit === "cover") &&
    (payload.imagePosition === undefined || typeof payload.imagePosition === "string") &&
    (payload.mediaType === undefined || payload.mediaType === "image" || payload.mediaType === "video") &&
    (payload.enabled === undefined || typeof payload.enabled === "boolean")
  );
}

export async function GET() {
  return NextResponse.json({ components: await getHomepageComponents() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const components = Array.isArray((payload as { components?: unknown })?.components)
    ? (payload as { components: unknown[] }).components
    : [];
  if (!components.length || components.some((component) => !validComponent(component))) {
    return NextResponse.json({ error: "Invalid homepage component payload" }, { status: 400 });
  }

  const updated = components.map((component) => ({
    ...(component as Partial<HomepageComponentReplacement>),
    updatedAt: new Date().toISOString(),
  })) as HomepageComponentReplacement[];
  await writeFile(filePath, `${JSON.stringify({ version: 1, components: updated }, null, 2)}\n`, "utf8");
  return NextResponse.json({ components: updated }, { headers: { "Cache-Control": "no-store" } });
}
