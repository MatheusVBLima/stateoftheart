import { type NextRequest, NextResponse } from "next/server";
import { getImplementationBySlug } from "@/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const implementation = await getImplementationBySlug(slug);

    if (!implementation) {
      return NextResponse.json(
        { error: "Implementation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(implementation);
  } catch (error) {
    console.error("Error fetching implementation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
