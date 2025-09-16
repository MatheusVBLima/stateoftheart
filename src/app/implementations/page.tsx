import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ImplementationsContent } from "@/components/implementations/implementations-content";
import { Header } from "@/components/layout/header";
import {
  getCategories,
  getImplementations,
  getTags,
  type ImplementationFilters,
} from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export const metadata = {
  title: "All Implementations - State Of The Art",
  description:
    "Browse all technology implementations and discover what the community considers state-of-the-art.",
};

interface ImplementationsPageProps {
  searchParams: Promise<{
    category?: string;
    tags?: string;
    sort?: string;
    order?: string;
    limit?: string;
  }>;
}

export default async function ImplementationsPage({
  searchParams,
}: ImplementationsPageProps) {
  const params = await searchParams;
  const queryClient = getQueryClient();

  const filters: ImplementationFilters = {
    category: params.category || undefined,
    tags: params.tags ? params.tags.split(",") : undefined,
    sort: (params.sort as any) || "recent",
    order: (params.order as any) || "desc",
    limit: params.limit ? parseInt(params.limit) : undefined,
  };

  // Prefetch implementations, categories and tags data on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["implementations", filters],
      queryFn: () => getImplementations(filters),
    }),
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ["tags"],
      queryFn: getTags,
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ImplementationsContent initialFilters={filters} />
      </HydrationBoundary>
    </div>
  );
}
