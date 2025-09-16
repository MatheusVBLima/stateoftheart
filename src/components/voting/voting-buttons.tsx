"use client";

import { useUser } from "@clerk/nextjs";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { voteAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface VotingButtonsProps {
  implementationId: string;
  slug: string;
  initialVoteCount: number;
  userVote?: "UP" | "DOWN" | null;
  className?: string;
}

export function VotingButtons({
  implementationId,
  slug,
  initialVoteCount,
  userVote = null,
  className,
}: VotingButtonsProps) {
  const { user, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const [optimisticVoteCount, setOptimisticVoteCount] =
    useState(initialVoteCount);
  const [optimisticUserVote, setOptimisticUserVote] = useState<
    "UP" | "DOWN" | null
  >(userVote);
  const [error, setError] = useState<string | null>(null);

  const handleVote = (type: "UP" | "DOWN") => {
    if (!isSignedIn) return;

    setError(null);
    const wasUpvoted = optimisticUserVote === "UP";
    const wasDownvoted = optimisticUserVote === "DOWN";
    const isUpvote = type === "UP";

    // Calculate optimistic vote count change
    let voteChange = 0;
    let newUserVote: "UP" | "DOWN" | null = null;

    if (isUpvote) {
      if (wasUpvoted) {
        // Removing upvote
        voteChange = -1;
        newUserVote = null;
      } else if (wasDownvoted) {
        // Changing from downvote to upvote
        voteChange = 2;
        newUserVote = "UP";
      } else {
        // New upvote
        voteChange = 1;
        newUserVote = "UP";
      }
    } else {
      // Downvote
      if (wasDownvoted) {
        // Removing downvote
        voteChange = 1;
        newUserVote = null;
      } else if (wasUpvoted) {
        // Changing from upvote to downvote
        voteChange = -2;
        newUserVote = "DOWN";
      } else {
        // New downvote
        voteChange = -1;
        newUserVote = "DOWN";
      }
    }

    // Apply optimistic updates
    setOptimisticVoteCount((prev) => prev + voteChange);
    setOptimisticUserVote(newUserVote);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("implementationId", implementationId);
        formData.append("voteType", type);
        formData.append("slug", slug);

        await voteAction(formData);

        // Show success toast
        toast.success(
          `Successfully ${type === "UP" ? "upvoted" : "downvoted"}!`,
          {
            description:
              newUserVote === null
                ? "Vote removed"
                : `You ${type === "UP" ? "upvoted" : "downvoted"} this implementation`,
          },
        );
      } catch (err) {
        // Revert optimistic updates on error
        setOptimisticVoteCount(initialVoteCount);
        setOptimisticUserVote(userVote);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to vote";
        setError(errorMessage);

        // Show error toast
        toast.error("Failed to vote", {
          description: errorMessage,
        });
      }
    });
  };

  if (!isSignedIn) {
    return (
      <div className={cn("flex flex-col items-center space-y-2", className)}>
        <div className="text-sm text-muted-foreground text-center">
          Sign in to vote
        </div>
        <Button asChild size="sm" className="w-full">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant={optimisticUserVote === "UP" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("UP")}
          disabled={isPending}
          className={cn(
            "transition-all",
            optimisticUserVote === "UP" && "bg-green-500 hover:bg-green-600",
          )}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>

        <span
          className={cn(
            "font-semibold text-lg min-w-[3ch] text-center",
            optimisticVoteCount > 0 && "text-green-600",
            optimisticVoteCount < 0 && "text-red-600",
          )}
        >
          {optimisticVoteCount}
        </span>

        <Button
          variant={optimisticUserVote === "DOWN" ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleVote("DOWN")}
          disabled={isPending}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>

      {error && <div className="text-xs text-red-500 text-center">{error}</div>}
    </div>
  );
}
