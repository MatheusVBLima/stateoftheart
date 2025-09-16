"use client";

import { useUser } from "@clerk/nextjs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Edit, ExternalLink, Github, Tag, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommentsSection } from "@/components/comments/comments-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomBreadcrumb } from "@/components/ui/custom-breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VotingButtons } from "@/components/voting/voting-buttons";
import { getImplementationBySlug } from "@/lib/queries";

interface ImplementationContentProps {
  slug: string;
}

export function ImplementationContent({ slug }: ImplementationContentProps) {
  const { user } = useUser();
  const { data: implementation } = useSuspenseQuery({
    queryKey: ["implementation", slug, user?.id],
    queryFn: () => getImplementationBySlug(slug, user?.id),
  });

  if (!implementation) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Implementation not found</h1>
        <p className="text-muted-foreground mt-2">
          The requested implementation does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <CustomBreadcrumb
          items={[
            { label: implementation.category.name, href: `/category/${implementation.category.slug}` },
            { label: implementation.name }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold">{implementation.name}</h1>
                  <Badge variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {implementation.category.name}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {implementation.description}
                </p>
              </div>

              {/* Edit button - only show for authenticated users */}
              {user && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/implementation/${implementation.slug}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>

            {/* Links */}
            {(implementation.website || implementation.githubUrl) && (
              <div className="flex space-x-3">
                {implementation.website && (
                  <Button variant="outline" asChild>
                    <a
                      href={implementation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </a>
                  </Button>
                )}
                {implementation.githubUrl && (
                  <Button variant="outline" asChild>
                    <a
                      href={implementation.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Added{" "}
                  {formatDistanceToNow(new Date(implementation.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          {implementation.content && (
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Why This Is State-of-the-Art</CardTitle>
                  <CardDescription>
                    Detailed explanation from the community about what makes this implementation special
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {implementation.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Comments Section */}
          <section>
            <CommentsSection
              implementationId={implementation.id}
              slug={slug}
              comments={implementation.comments}
            />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voting Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Vote</CardTitle>
              <CardDescription>
                Help the community by voting on this implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {implementation._count.votes}
                </div>
                <div className="text-sm text-muted-foreground">popularity score</div>

                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="font-medium">{implementation.upvotes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-red-600">
                    <ThumbsDown className="h-4 w-4" />
                    <span className="font-medium">{implementation.downvotes}</span>
                  </div>
                </div>
              </div>

              <VotingButtons
                implementationId={implementation.id}
                slug={slug}
                initialVoteCount={implementation._count.votes}
                userVote={implementation.votes?.[0]?.type || null}
              />
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Popularity score:</span>
                <span className="font-semibold text-primary">
                  {implementation._count.votes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Upvotes:</span>
                <span className="font-semibold text-green-600">
                  {implementation.upvotes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Downvotes:</span>
                <span className="font-semibold text-red-600">
                  {implementation.downvotes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Comments:</span>
                <span className="font-semibold">
                  {implementation._count.comments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Added:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(implementation.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Category Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/category/${implementation.category.slug}`}>
                  <Tag className="mr-2 h-4 w-4" />
                  {implementation.category.name}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
