import { NextResponse } from "next/server";
import { getPopularImplementations } from "@/lib/queries";

export async function GET() {
  try {
    const popular = await getPopularImplementations(10);
    return NextResponse.json(popular);
  } catch (error) {
    console.error("Popular API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
