import { NextResponse } from "next/server";
import { getTrendingImplementations } from "@/lib/queries";

export async function GET() {
  try {
    const trending = await getTrendingImplementations(10);
    return NextResponse.json(trending);
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
