import { NextResponse } from "next/server";
import { getLatestRadarArticles } from "@/lib/wordpress";

export async function GET() {
  const articles = await getLatestRadarArticles(4);
  return NextResponse.json({ articles }, { headers: { "Cache-Control": "no-store" } });
}
