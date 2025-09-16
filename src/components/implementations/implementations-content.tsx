"use client";

import { useQuery } from "@tanstack/react-query";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/filters/filter-bar";
import { ImplementationCard } from "@/components/implementation/implementation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ImplementationFilters } from "@/lib/queries";

interface ImplementationsContentProps {
  initialFilters: ImplementationFilters;
}

export function ImplementationsContent({
  initialFilters,
}: ImplementationsContentProps) {
  const searchParams = useSearchParams();

  const filters: ImplementationFilters = {
    category: searchParams.get("category") || initialFilters.category,
    tags: searchParams.get("tags")
      ? searchParams.get("tags")!.split(",")
      : initialFilters.tags,
    sort: (searchParams.get("sort") as any) || initialFilters.sort || "recent",
    order: (searchParams.get("order") as any) || initialFilters.order || "desc",
  };

  const { data: implementations, isLoading } = useQuery({
    queryKey: ["implementations", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.tags && filters.tags.length > 0)
        params.set("tags", filters.tags.join(","));
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.order) params.set("order", filters.order);

      const response = await fetch(`/api/implementations?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch implementations");
      return response.json();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">All Implementations</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Discover and vote on technology implementations across all
              categories. Help the community identify what's truly
              state-of-the-art.
            </p>

            {implementations && (
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary">
                  {implementations.length} implementations
                </Badge>
                {categories && (
                  <Badge variant="secondary">
                    {categories.length} categories
                  </Badge>
                )}
                <Badge variant="secondary">
                  {implementations.reduce(
                    (sum: number, impl: any) => sum + impl._count.votes,
                    0,
                  )}{" "}
                  total votes
                </Badge>
              </div>
            )}
          </div>

          <Button size="lg" asChild>
            <Link href="/submit">
              <Plus className="mr-2 h-4 w-4" />
              Submit Implementation
            </Link>
          </Button>
        </div>
      </header>

      {/* Filter Bar */}
      <section className="mb-8">
        <FilterBar
          categories={categories || []}
          tags={tags || []}
          currentCategory={filters.category || ""}
          currentTags={filters.tags || []}
          currentSort={filters.sort || "recent"}
          currentOrder={filters.order || "desc"}
        />
      </section>

      {/* Implementations Grid */}
      <section>
        {implementations && implementations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {implementations.map((implementation: any, index: number) => (
              <div key={implementation.id} className="relative">
                {(filters.sort === "votes" || filters.sort === "popular") &&
                  index < 3 && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <Badge
                        className={
                          index === 0
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : index === 1
                              ? "bg-gray-400 hover:bg-gray-500"
                              : "bg-orange-600 hover:bg-orange-700"
                        }
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                <ImplementationCard implementation={implementation} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No implementations found
            </h3>
            <p className="text-muted-foreground mb-6">
              No implementations match your current filters. Try adjusting your
              search.
            </p>
            <Button asChild>
              <Link href="/submit">
                <Plus className="mr-2 h-4 w-4" />
                Submit Implementation
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
