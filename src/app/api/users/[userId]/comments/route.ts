import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { getCommentsByUser } from "@/lib/queries";

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: currentUserId } = await auth();
    const { userId } = await params;

    // Users can only access their own comments
    if (!currentUserId || currentUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const comments = await getCommentsByUser(userId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("User comments API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
