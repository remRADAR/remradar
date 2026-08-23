import { NextResponse } from "next/server";
import { getLatestRadarArticles } from "@/lib/wordpress";

export async function GET() {
  try {
    const articles = await getLatestRadarArticles(4);
    return NextResponse.json({ articles }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { articles: [], error: "Article service temporarily unavailable" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}
