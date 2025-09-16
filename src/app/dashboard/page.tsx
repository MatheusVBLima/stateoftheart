import { auth } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Header } from "@/components/layout/header";
import {
  getCommentsByUser,
  getUserImplementations,
  getUserStats,
  getVotesByUser,
} from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export const metadata = {
  title: "Dashboard - State Of The Art",
  description:
    "Your personal dashboard with voting history, comments, and submissions.",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  // Prefetch user data on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["user-stats", userId],
      queryFn: () => getUserStats(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["user-implementations", userId],
      queryFn: () => getUserImplementations(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["user-votes", userId],
      queryFn: () => getVotesByUser(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["user-comments", userId],
      queryFn: () => getCommentsByUser(userId),
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent userId={userId} />
      </HydrationBoundary>
    </div>
  );
}
