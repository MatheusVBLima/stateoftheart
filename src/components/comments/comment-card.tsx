"use client";

import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Edit,
  Flag,
  Loader2,
  Reply,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  deleteCommentAction,
  editCommentAction,
  reportCommentAction,
} from "@/lib/actions";
import { renderTextWithCode } from "@/lib/text-renderer";

interface Comment {
  id: string;
  content: string;
  userId: string;
  implementationId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

const commentSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Comment cannot be empty.",
    })
    .max(1000, {
      message: "Comment must be less than 1000 characters.",
    }),
});

interface CommentCardProps {
  comment: Comment;
  implementationId: string;
  slug: string;
  onReply: (commentId: string | null) => void;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (formData: FormData) => void;
  isSubmitting: boolean;
  depth?: number;
}

export function CommentCard({
  comment,
  implementationId,
  slug,
  onReply,
  replyingTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  isSubmitting,
  depth = 0,
}: CommentCardProps) {
  const { user, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const maxDepth = 2; // Limit nesting depth

  // Check if current user owns this comment
  const isOwner = user?.id === comment.userId;

  // Get user initials for avatar fallback
  const getUserInitials = (userId: string) => {
    // For now, we'll just use the first two characters of the userId
    // In the future, we could cache user data from Clerk
    return userId.slice(0, 2).toUpperCase();
  };

  // Get user display name
  const getUserDisplayName = (userId: string) => {
    // For now, we'll show "User" + first 8 chars of userId
    // In the future, we could cache user data from Clerk
    return `User ${userId.slice(0, 8)}`;
  };

  const handleReplySubmit = (formData: FormData) => {
    formData.append("parentId", comment.id);
    onSubmitReply(formData);
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("commentId", comment.id);
        formData.append("content", editContent.trim());
        formData.append("slug", slug);

        await editCommentAction(formData);
        setIsEditing(false);

        toast.success("Comment updated!", {
          description: "Your comment has been successfully updated.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update comment";
        toast.error("Failed to update comment", {
          description: errorMessage,
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("commentId", comment.id);
        formData.append("slug", slug);

        await deleteCommentAction(formData);

        toast.success("Comment deleted!", {
          description: "Your comment has been deleted.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete comment";
        toast.error("Failed to delete comment", {
          description: errorMessage,
        });
      }
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleReport = async () => {
    const reason = prompt("Why are you reporting this comment?");
    if (!reason) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("commentId", comment.id);
        formData.append("reason", reason);
        formData.append("slug", slug);

        await reportCommentAction(formData);

        toast.success("Comment reported!", {
          description: "Thank you for helping keep our community safe.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to report comment";
        toast.error("Failed to report comment", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Comment Header */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    isOwner
                      ? user?.imageUrl
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`
                  }
                />
                <AvatarFallback>
                  {isOwner && user?.firstName ? (
                    `${user.firstName[0]}${user.lastName?.[0] || ""}`
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {isOwner
                    ? user?.fullName ||
                      user?.firstName ||
                      getUserDisplayName(comment.userId)
                    : getUserDisplayName(comment.userId)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {/* Comment Content */}
            <div className="text-sm">
              {isEditing ? (
                <div className="space-y-3">
                  <RichTextEditor
                    value={editContent}
                    onChange={setEditContent}
                    placeholder="Edit your comment..."
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isPending}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleEditSubmit}
                      disabled={
                        isPending ||
                        !editContent.trim() ||
                        editContent === comment.content
                      }
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {renderTextWithCode(comment.content)}
                </div>
              )}
            </div>

            {/* Comment Actions */}
            {isSignedIn && !isEditing && (
              <div className="flex items-center space-x-2">
                {depth < maxDepth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onReply(replyingTo === comment.id ? null : comment.id)
                    }
                    disabled={isPending}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                {/* Edit and Delete buttons for comment owner */}
                {isOwner && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={isPending}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Delete
                    </Button>
                  </>
                )}

                {/* Report button for non-owners */}
                {!isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReport}
                    disabled={isPending}
                    className="text-muted-foreground hover:text-orange-600"
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    Report
                  </Button>
                )}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <form action={handleReplySubmit} className="space-y-3 mt-3">
                <input
                  type="hidden"
                  name="implementationId"
                  value={implementationId}
                />
                <input type="hidden" name="slug" value={slug} />

                <input type="hidden" name="content" value={replyContent} />
                <RichTextEditor
                  placeholder={`Reply to this comment...`}
                  value={replyContent}
                  onChange={setReplyContent}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onReply(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Replying...
                      </>
                    ) : (
                      "Reply"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              implementationId={implementationId}
              slug={slug}
              onReply={onReply}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={onSubmitReply}
              isSubmitting={isSubmitting}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
