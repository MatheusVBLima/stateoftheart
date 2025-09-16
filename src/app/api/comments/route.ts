import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { content, implementationId, parentId } = body;

    // Validate required fields
    if (!content || !implementationId) {
      return NextResponse.json(
        { error: "Content and implementation ID are required" },
        { status: 400 },
      );
    }

    // Verify implementation exists
    const implementation = await db.implementation.findUnique({
      where: { id: implementationId },
    });

    if (!implementation) {
      return NextResponse.json(
        { error: "Implementation not found" },
        { status: 404 },
      );
    }

    // If parentId is provided, verify the parent comment exists
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 },
        );
      }

      // Ensure parent comment belongs to the same implementation
      if (parentComment.implementationId !== implementationId) {
        return NextResponse.json(
          { error: "Parent comment does not belong to this implementation" },
          { status: 400 },
        );
      }
    }

    // Create comment
    const comment = await db.comment.create({
      data: {
        content,
        userId,
        implementationId,
        parentId: parentId || null,
      },
      include: {
        replies: {
          include: {
            replies: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
