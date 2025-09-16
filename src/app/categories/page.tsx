import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoriesContent } from "@/components/categories/categories-content";
import { Header } from "@/components/layout/header";
import { getCategories } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export const metadata = {
  title: "All Categories - State Of The Art",
  description:
    "Browse all technology categories and discover the state-of-the-art implementations in each area.",
};

export default async function CategoriesPage() {
  const queryClient = getQueryClient();

  // Prefetch categories data on the server
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoriesContent />
      </HydrationBoundary>
    </div>
  );
}
