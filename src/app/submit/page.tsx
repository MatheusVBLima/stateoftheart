import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { SubmitForm } from "@/components/submit/submit-form";
import { getCategories } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";

export const metadata = {
  title: "Submit Implementation - State Of The Art",
  description:
    "Submit a new state-of-the-art implementation to help the community discover the best tools and libraries.",
};

export default async function SubmitPage() {
  const queryClient = getQueryClient();

  // Prefetch categories for the form (server-side)
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SubmitForm />
        </HydrationBoundary>
      </main>
    </div>
  );
}
