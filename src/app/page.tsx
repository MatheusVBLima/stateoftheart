import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { HomeContent } from "@/components/home-content";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/layout/hero-section";
import { SkipLinks } from "@/components/skip-links";
import { getCategories, getFeaturedImplementations } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: ["featured-implementations"],
      queryFn: () => getFeaturedImplementations(8),
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />
      <Header />
      <main id="main-content">
        <HeroSection />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomeContent />
        </HydrationBoundary>
      </main>
    </div>
  );
}
