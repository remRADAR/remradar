import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getNativeComponentReplacement, type NativeComponentReplacement } from "@/lib/native-content";

const filePath = path.join(process.cwd(), "content", "component-replacements.json");

function authorized(request: Request) {
  const configured = process.env.NATIVE_ADMIN_TOKEN;
  return Boolean(configured && request.headers.get("x-native-admin-token") === configured);
}

function validPayload(value: unknown): value is Partial<NativeComponentReplacement> {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    (payload.componentKey === undefined || payload.componentKey === "aktiv-section") &&
    (payload.text === undefined || typeof payload.text === "string") &&
    (payload.imageUrl === undefined || typeof payload.imageUrl === "string") &&
    (payload.imageFit === undefined || payload.imageFit === "contain" || payload.imageFit === "cover") &&
    (payload.imagePosition === undefined || typeof payload.imagePosition === "string")
  );
}

export async function GET() {
  return NextResponse.json(await getNativeComponentReplacement(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!validPayload(payload)) {
    return NextResponse.json({ error: "Invalid component replacement payload" }, { status: 400 });
  }

  const current = await getNativeComponentReplacement();
  const updated: NativeComponentReplacement = {
    ...current,
    ...(payload as Partial<NativeComponentReplacement>),
    componentKey: "aktiv-section",
    updatedAt: new Date().toISOString(),
  };

  await writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
  return NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } });
}
