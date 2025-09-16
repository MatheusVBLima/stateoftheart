import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { CategoryContent } from "@/components/category/category-content";
import { Header } from "@/components/layout/header";
import { getCategoryBySlug } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  // Prefetch category data on the server
  await queryClient.prefetchQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug(slug),
  });

  // Check if category exists (get from cache)
  const category = queryClient.getQueryData(["category", slug]);
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryContent slug={slug} />
      </HydrationBoundary>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found - State Of The Art",
    };
  }

  return {
    title: `${category.name} - State Of The Art`,
    description: `Discover and vote on the best ${category.name} implementations. ${category.description}`,
  };
}
