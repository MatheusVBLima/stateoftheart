import { auth } from "@clerk/nextjs/server";
import type { VoteType } from "@prisma/client";
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
    const { implementationId, type } = body;

    if (!implementationId || !type) {
      return NextResponse.json(
        { error: "Implementation ID and vote type are required" },
        { status: 400 },
      );
    }

    if (!["UP", "DOWN"].includes(type)) {
      return NextResponse.json(
        { error: "Vote type must be UP or DOWN" },
        { status: 400 },
      );
    }

    // Check if implementation exists
    const implementation = await db.implementation.findUnique({
      where: { id: implementationId },
    });

    if (!implementation) {
      return NextResponse.json(
        { error: "Implementation not found" },
        { status: 404 },
      );
    }

    // Check if user already voted
    const existingVote = await db.vote.findUnique({
      where: {
        userId_implementationId: {
          userId,
          implementationId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // User is clicking the same vote type - remove the vote
        await db.vote.delete({
          where: { id: existingVote.id },
        });

        return NextResponse.json({
          message: "Vote removed",
          action: "removed",
          voteType: type,
        });
      } else {
        // User is changing their vote
        await db.vote.update({
          where: { id: existingVote.id },
          data: { type: type as VoteType },
        });

        return NextResponse.json({
          message: "Vote updated",
          action: "updated",
          voteType: type,
        });
      }
    } else {
      // Create new vote
      await db.vote.create({
        data: {
          userId,
          implementationId,
          type: type as VoteType,
        },
      });

      return NextResponse.json({
        message: "Vote created",
        action: "created",
        voteType: type,
      });
    }
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
