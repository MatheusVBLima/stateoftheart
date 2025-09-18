"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart3,
  Calendar,
  ExternalLink,
  Github,
  Heart,
  MessageSquare,
  Package,
  Plus,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderTextWithCode } from "@/lib/text-renderer";

interface DashboardContentProps {
  userId: string;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  const { user } = useUser();

  const { data: stats } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/stats`);
      if (!response.ok) throw new Error("Failed to fetch user stats");
      return response.json();
    },
  });

  const { data: votes } = useQuery({
    queryKey: ["user-votes", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/votes`);
      if (!response.ok) throw new Error("Failed to fetch user votes");
      return response.json();
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["user-comments", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch user comments");
      return response.json();
    },
  });

  const { data: implementations } = useQuery({
    queryKey: ["user-implementations", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/implementations`);
      if (!response.ok) throw new Error("Failed to fetch user implementations");
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
            <AvatarFallback className="text-lg">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {user?.fullName || "Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              Member since{" "}
              {user?.createdAt
                ? formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })
                : "recently"}
            </p>
          </div>
        </div>

        <Button size="lg" asChild>
          <Link href="/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submit Implementation
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.votesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Implementations you've voted on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.commentsCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Comments you've made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.implementationsCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Implementations submitted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="votes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="votes">Recent Votes</TabsTrigger>
          <TabsTrigger value="comments">Recent Comments</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="votes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Votes</CardTitle>
              <CardDescription>Your recent voting activity</CardDescription>
            </CardHeader>
            <CardContent>
              {votes && votes.length > 0 ? (
                <div className="space-y-4">
                  {votes.map((vote: any) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            vote.type === "UP"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 ${vote.type === "DOWN" ? "rotate-180" : ""}`}
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/implementations/${vote.implementation.slug}`}
                            className="font-medium hover:underline"
                          >
                            {vote.implementation.name}
                          </Link>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {vote.implementation.category.name}
                            </Badge>
                            {vote.implementation.tags
                              ?.slice(0, 2)
                              .map((tag: any) => (
                                <Badge
                                  key={tag.tag.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag.tag.name}
                                </Badge>
                              ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(vote.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={vote.type === "UP" ? "default" : "destructive"}
                      >
                        {vote.type === "UP" ? "Upvoted" : "Downvoted"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ThumbsUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">No votes yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Start exploring implementations and vote on the ones you
                    find state-of-the-art.
                  </p>
                  <Button asChild>
                    <Link href="/implementations">Browse Implementations</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
              <CardDescription>
                Your recent comments and discussions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          href={`/implementations/${comment.implementation.slug}`}
                          className="font-medium hover:underline"
                        >
                          {comment.implementation.name}
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {comment.implementation.category.name}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 line-clamp-2 prose prose-gray dark:prose-invert max-w-none">
                        {renderTextWithCode(comment.content)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">No comments yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Join the discussion by commenting on implementations.
                  </p>
                  <Button asChild>
                    <Link href="/implementations">Browse Implementations</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Submissions</CardTitle>
              <CardDescription>
                Implementations you've submitted to the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {implementations && implementations.length > 0 ? (
                <div className="space-y-4">
                  {implementations.map((implementation: any) => (
                    <div
                      key={implementation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {implementation.logoUrl && (
                            <img
                              src={implementation.logoUrl}
                              alt={implementation.name}
                              className="h-8 w-8 rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium">
                              <Link
                                href={`/implementation/${implementation.slug}`}
                                className="hover:underline"
                              >
                                {implementation.name}
                              </Link>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {implementation.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">
                            {implementation.category.name}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{implementation._count.votes}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>{implementation._count.comments}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(implementation.createdAt),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/implementation/${implementation.slug}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/implementation/${implementation.slug}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">
                    No submissions yet
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Share your favorite state-of-the-art implementations with
                    the community.
                  </p>
                  <Button asChild>
                    <Link href="/submit">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Implementation
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
