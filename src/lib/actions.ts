"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// Comments Actions
export async function createCommentAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const content = formData.get("content") as string;
  const implementationId = formData.get("implementationId") as string;
  const parentId = formData.get("parentId") as string | null;
  const slug = formData.get("slug") as string;

  // Validate required fields
  if (!content || !implementationId || !slug) {
    throw new Error("Content, implementation ID, and slug are required");
  }

  // Check for profanity
  if (containsProfanity(content)) {
    throw new Error(
      "Your comment contains inappropriate content. Please revise and try again.",
    );
  }

  // Verify implementation exists
  const implementation = await db.implementation.findUnique({
    where: { id: implementationId },
  });

  if (!implementation) {
    throw new Error("Implementation not found");
  }

  // If parentId is provided, verify the parent comment exists
  if (parentId) {
    const parentComment = await db.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    // Ensure parent comment belongs to the same implementation
    if (parentComment.implementationId !== implementationId) {
      throw new Error("Parent comment does not belong to this implementation");
    }
  }

  // Create comment
  const comment = await db.comment.create({
    data: {
      content: content.trim(),
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

  // Revalidate the implementation page
  revalidatePath(`/implementation/${slug}`);

  return { success: true, comment };
}

// Implementation Submission Actions
export async function createImplementationAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const website = formData.get("website") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const categoryId = formData.get("categoryId") as string;

  // Validate required fields
  if (!name || !description || !categoryId) {
    throw new Error("Name, description, and category are required");
  }

  // Validate URLs if provided
  if (website && !isValidUrl(website)) {
    throw new Error("Invalid website URL");
  }

  if (githubUrl && !isValidUrl(githubUrl)) {
    throw new Error("Invalid GitHub URL");
  }

  if (logoUrl && !isValidUrl(logoUrl)) {
    throw new Error("Invalid logo URL");
  }

  // Generate slug from name
  const slug = generateSlug(name);

  // Check if slug already exists
  const existingImplementation = await db.implementation.findUnique({
    where: { slug },
  });

  if (existingImplementation) {
    throw new Error("An implementation with this name already exists");
  }

  // Verify category exists
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Invalid category");
  }

  // Create implementation
  const implementation = await db.implementation.create({
    data: {
      name: name.trim(),
      slug,
      description: description.trim(),
      content: content?.trim() || null,
      website: website?.trim() || null,
      githubUrl: githubUrl?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      categoryId,
      userId,
    },
    include: {
      category: true,
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  // Revalidate relevant pages
  revalidatePath("/implementations");
  revalidatePath("/categories");
  revalidatePath(`/category/${category.slug}`);

  // Return the implementation data instead of redirecting
  return { success: true, implementation };
}

// Voting Actions
export async function voteAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const implementationId = formData.get("implementationId") as string;
  const voteType = formData.get("voteType");
  const slug = formData.get("slug") as string;

  if (!implementationId || !voteType || !slug) {
    throw new Error("Implementation ID, vote type, and slug are required");
  }

  if (voteType !== "UP" && voteType !== "DOWN") {
    throw new Error("Invalid vote type");
  }

  // Verify implementation exists
  const implementation = await db.implementation.findUnique({
    where: { id: implementationId },
  });

  if (!implementation) {
    throw new Error("Implementation not found");
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
    if (existingVote.type === voteType) {
      // Remove vote if clicking same type
      await db.vote.delete({
        where: { id: existingVote.id },
      });
    } else {
      // Update vote type if different
      await db.vote.update({
        where: { id: existingVote.id },
        data: { type: voteType },
      });
    }
  } else {
    // Create new vote
    await db.vote.create({
      data: {
        userId,
        implementationId,
        type: voteType,
      },
    });
  }

  // Revalidate the implementation page
  revalidatePath(`/implementation/${slug}`);

  return { success: true };
}

// Update Implementation Action
export async function updateImplementationAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const implementationId = formData.get("implementationId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const categoryId = formData.get("categoryId") as string;

  // Validate required fields
  if (!implementationId || !name || !description || !categoryId) {
    throw new Error(
      "Implementation ID, name, description, and category are required",
    );
  }

  // Verify implementation exists and user owns it
  const existingImplementation = await db.implementation.findUnique({
    where: { id: implementationId },
    include: { category: true },
  });

  if (!existingImplementation) {
    throw new Error("Implementation not found");
  }

  if (existingImplementation.userId !== userId) {
    throw new Error("You can only edit your own implementations");
  }

  // Validate URLs if provided
  if (website && !isValidUrl(website)) {
    throw new Error("Invalid website URL");
  }

  if (githubUrl && !isValidUrl(githubUrl)) {
    throw new Error("Invalid GitHub URL");
  }

  if (logoUrl && !isValidUrl(logoUrl)) {
    throw new Error("Invalid logo URL");
  }

  // Verify category exists
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Invalid category");
  }

  // Generate new slug if name changed
  const newSlug =
    name.trim().toLowerCase() !== existingImplementation.name.toLowerCase()
      ? generateSlug(name)
      : existingImplementation.slug;

  // Update implementation
  const implementation = await db.implementation.update({
    where: { id: implementationId },
    data: {
      name: name.trim(),
      slug: newSlug,
      description: description.trim(),
      website: website?.trim() || null,
      githubUrl: githubUrl?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      categoryId,
      updatedAt: new Date(),
    },
    include: {
      category: true,
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  // Revalidate relevant pages
  revalidatePath("/implementations");
  revalidatePath("/categories");
  revalidatePath(`/category/${category.slug}`);
  revalidatePath(`/implementation/${existingImplementation.slug}`);
  if (newSlug !== existingImplementation.slug) {
    revalidatePath(`/implementation/${newSlug}`);
  }

  // Redirect to the implementation page (use new slug if changed)
  redirect(`/implementation/${implementation.slug}`);
}

// Edit Comment Action
export async function editCommentAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const commentId = formData.get("commentId") as string;
  const content = formData.get("content") as string;
  const slug = formData.get("slug") as string;

  // Validate required fields
  if (!commentId || !content || !slug) {
    throw new Error("Comment ID, content, and slug are required");
  }

  // Verify comment exists and user owns it
  const existingComment = await db.comment.findUnique({
    where: { id: commentId },
    include: { implementation: true },
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  if (existingComment.userId !== userId) {
    throw new Error("You can only edit your own comments");
  }

  // Update comment
  await db.comment.update({
    where: { id: commentId },
    data: {
      content: content.trim(),
      updatedAt: new Date(),
    },
  });

  // Revalidate the implementation page
  revalidatePath(`/implementation/${slug}`);

  return { success: true };
}

// Delete Comment Action
export async function deleteCommentAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const commentId = formData.get("commentId") as string;
  const slug = formData.get("slug") as string;

  // Validate required fields
  if (!commentId || !slug) {
    throw new Error("Comment ID and slug are required");
  }

  // Verify comment exists and user owns it
  const existingComment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      implementation: true,
      replies: true,
    },
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  if (existingComment.userId !== userId) {
    throw new Error("You can only delete your own comments");
  }

  // If comment has replies, just mark it as deleted instead of removing it
  if (existingComment.replies.length > 0) {
    await db.comment.update({
      where: { id: commentId },
      data: {
        content: "[Comment deleted by user]",
        updatedAt: new Date(),
      },
    });
  } else {
    // If no replies, completely delete the comment
    await db.comment.delete({
      where: { id: commentId },
    });
  }

  // Revalidate the implementation page
  revalidatePath(`/implementation/${slug}`);

  return { success: true };
}

// Report Comment Action
export async function reportCommentAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  const commentId = formData.get("commentId") as string;
  const reason = formData.get("reason") as string;
  const slug = formData.get("slug") as string;

  // Validate required fields
  if (!commentId || !reason || !slug) {
    throw new Error("Comment ID, reason, and slug are required");
  }

  // Verify comment exists
  const existingComment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  // Check if user already reported this comment
  const existingReport = await db.commentReport.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  if (existingReport) {
    throw new Error("You have already reported this comment");
  }

  // Create report and increment report count
  await db.$transaction([
    db.commentReport.create({
      data: {
        commentId,
        userId,
        reason,
      },
    }),
    db.comment.update({
      where: { id: commentId },
      data: {
        reportCount: {
          increment: 1,
        },
      },
    }),
  ]);

  // Auto-hide comment if it reaches 5 reports
  const updatedComment = await db.comment.findUnique({
    where: { id: commentId },
    select: { reportCount: true },
  });

  if (updatedComment && updatedComment.reportCount >= 5) {
    await db.comment.update({
      where: { id: commentId },
      data: { isHidden: true },
    });
  }

  // Revalidate the implementation page
  revalidatePath(`/implementation/${slug}`);

  return { success: true };
}

// Moderate Comment Action (Admin only - basic implementation)
export async function moderateCommentAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  // Check admin role from Clerk metadata
  const user = await clerkClient.users.getUser(userId);
  const isAdmin = user.privateMetadata?.role === "admin";

  if (!isAdmin) {
    throw new Error("Admin access required");
  }

  const commentId = formData.get("commentId") as string;
  const action = formData.get("action") as "hide" | "show" | "delete";
  const slug = formData.get("slug") as string;

  // Validate required fields
  if (!commentId || !action || !slug) {
    throw new Error("Comment ID, action, and slug are required");
  }

  // Verify comment exists
  const existingComment = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  // Perform moderation action
  switch (action) {
    case "hide":
      await db.comment.update({
        where: { id: commentId },
        data: { isHidden: true },
      });
      break;
    case "show":
      await db.comment.update({
        where: { id: commentId },
        data: { isHidden: false },
      });
      break;
    case "delete":
      await db.comment.delete({
        where: { id: commentId },
      });
      break;
    default:
      throw new Error("Invalid moderation action");
  }

  // Revalidate the implementation page
  revalidatePath(`/implementation/${slug}`);

  return { success: true };
}

// Helper functions
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function containsProfanity(text: string): boolean {
  // Basic profanity filter - in a real app, use a proper library like 'bad-words'
  const profanityWords = [
    "spam",
    "scam",
    "fake",
    "stupid",
    "idiot",
    // Add more words as needed
  ];

  const lowerText = text.toLowerCase();
  return profanityWords.some((word) => lowerText.includes(word));
}
