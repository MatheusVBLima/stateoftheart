"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { createCommentAction } from "@/lib/actions";
import { CommentCard } from "./comment-card";

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

interface CommentsSectionProps {
  implementationId: string;
  slug: string;
  comments: Comment[];
}

export function CommentsSection({
  implementationId,
  slug,
  comments,
}: CommentsSectionProps) {
  const { user, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const replyForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmitComment = async (values: z.infer<typeof commentSchema>) => {
    if (!isSignedIn) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("content", values.content);
        formData.append("implementationId", implementationId);
        formData.append("slug", slug);

        await createCommentAction(formData);
        commentForm.reset();

        // Show success toast
        toast.success("Comment posted!", {
          description: "Your comment has been added to the discussion.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create comment";
        commentForm.setError("root", {
          message: errorMessage,
        });

        // Show error toast
        toast.error("Failed to post comment", {
          description: errorMessage,
        });
      }
    });
  };

  const onSubmitReply = async (formData: FormData) => {
    if (!isSignedIn || !replyingTo) return;

    startTransition(async () => {
      try {
        // parentId is already added by CommentCard
        formData.append("implementationId", implementationId);
        formData.append("slug", slug);

        await createCommentAction(formData);
        setReplyingTo(null);
        setReplyContent("");

        // Show success toast
        toast.success("Reply posted!", {
          description: "Your reply has been added to the discussion.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create reply";

        // Show error toast
        toast.error("Failed to post reply", {
          description: errorMessage,
        });
      }
    });
  };

  const rootComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* New Comment Form */}
      {isSignedIn ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a comment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...commentForm}>
              <form
                onSubmit={commentForm.handleSubmit(onSubmitComment)}
                className="space-y-4"
              >
                {commentForm.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {commentForm.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={commentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichTextEditor
                          placeholder="Share your thoughts about this implementation..."
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPending || !commentForm.formState.isValid}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              <Button variant="link" asChild className="p-0 h-auto">
                <a href="/sign-in">Sign in</a>
              </Button>{" "}
              to join the discussion
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {rootComments.length > 0 ? (
          rootComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              implementationId={implementationId}
              slug={slug}
              onReply={setReplyingTo}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={onSubmitReply}
              isSubmitting={isPending}
            />
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">No comments yet</h4>
                <p className="text-muted-foreground">
                  Be the first to share your thoughts about this implementation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
