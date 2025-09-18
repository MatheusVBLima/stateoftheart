import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { StackFilterContent } from "@/components/stack-filter/stack-filter-content";
import { getStateOfTheArtByCategory } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export const metadata = {
  title: "Stack Filter - State Of The Art",
  description:
    "Filter state-of-the-art technologies by your stack and get personalized recommendations.",
};

export default async function StackFilterPage() {
  const queryClient = getQueryClient();

  // Prefetch available technologies for the multiselect
  await queryClient.prefetchQuery({
    queryKey: ["state-of-the-art"],
    queryFn: getStateOfTheArtByCategory,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <StackFilterContent />
      </HydrationBoundary>
    </div>
  );
}
