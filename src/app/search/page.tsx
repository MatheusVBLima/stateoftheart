import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { SearchContent } from "@/components/search/search-content";
import { searchAll } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query
      ? `Search results for "${query}" - State Of The Art`
      : "Search - State Of The Art",
    description: query
      ? `Search results for "${query}" across categories and implementations.`
      : "Search across all categories and implementations to find the state-of-the-art solutions.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const queryClient = getQueryClient();

  // Prefetch search results if there's a query
  if (query) {
    await queryClient.prefetchQuery({
      queryKey: ["search", query],
      queryFn: () => searchAll(query),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchContent initialQuery={query} />
      </HydrationBoundary>
    </div>
  );
}
