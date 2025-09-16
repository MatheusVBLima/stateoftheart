import { auth } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ImplementationContent } from "@/components/implementation/implementation-content";
import { Header } from "@/components/layout/header";
import { getImplementationBySlug } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

interface ImplementationPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ImplementationPage({
  params,
}: ImplementationPageProps) {
  const { slug } = await params;
  const { userId } = await auth();
  const queryClient = getQueryClient();

  // Prefetch implementation data on the server
  await queryClient.prefetchQuery({
    queryKey: ["implementation", slug, userId],
    queryFn: () => getImplementationBySlug(slug, userId || undefined),
  });

  // Check if implementation exists (get from cache)
  const implementation = queryClient.getQueryData([
    "implementation",
    slug,
    userId,
  ]);
  if (!implementation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ImplementationContent slug={slug} />
      </HydrationBoundary>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ImplementationPageProps) {
  const { slug } = await params;
  const implementation = await getImplementationBySlug(slug);

  if (!implementation) {
    return {
      title: "Implementation Not Found - State Of The Art",
    };
  }

  return {
    title: `${implementation.name} - ${implementation.category.name} - State Of The Art`,
    description: `${implementation.description} Vote and discuss this ${implementation.category.name} implementation.`,
  };
}
