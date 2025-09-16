import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { TrendingContent } from "@/components/trending/trending-content";
import {
  getPopularImplementations,
  getRecentImplementations,
  getTrendingImplementations,
} from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export const metadata = {
  title: "Trending - State Of The Art",
  description:
    "Discover trending and popular state-of-the-art implementations based on community votes and recent activity.",
};

export default async function TrendingPage() {
  const queryClient = getQueryClient();

  // Prefetch all trending data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["trending"],
      queryFn: () => getTrendingImplementations(10),
    }),
    queryClient.prefetchQuery({
      queryKey: ["popular"],
      queryFn: () => getPopularImplementations(10),
    }),
    queryClient.prefetchQuery({
      queryKey: ["recent"],
      queryFn: () => getRecentImplementations(10),
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TrendingContent />
      </HydrationBoundary>
    </div>
  );
}
