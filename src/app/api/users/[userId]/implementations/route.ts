import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { getUserImplementations } from "@/lib/queries";

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: currentUserId } = await auth();
    const { userId } = await params;

    // Allow users to view their own implementations
    if (!currentUserId || currentUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const implementations = await getUserImplementations(userId);
    return NextResponse.json(implementations);
  } catch (error) {
    console.error("Error fetching user implementations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
