"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Folder, Package, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryCard } from "@/components/category/category-card";
import { ImplementationCard } from "@/components/implementation/implementation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchAllAPI } from "@/lib/api";

interface SearchContentProps {
  initialQuery: string;
}

export function SearchContent({ initialQuery }: SearchContentProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update local state when URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
    setSearchTerm(urlQuery);
  }, [searchParams]);

  const {
    data: searchResults,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchAllAPI(query),
    enabled: !!query,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const hasResults = query && searchResults && searchResults.totalResults > 0;
  const hasQuery = !!query;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <header className="mb-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">Search State Of The Art</h1>
            <p className="text-lg text-muted-foreground">
              Find the best implementations and categories across all
              technologies
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for categories, implementations, or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
                autoFocus
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Search
            </Button>
          </form>

          {hasQuery && (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-muted-foreground">
                {hasResults
                  ? `${searchResults.totalResults} result${
                      searchResults.totalResults !== 1 ? "s" : ""
                    } for`
                  : "No results for"}
              </span>
              <Badge variant="outline">"{query}"</Badge>
              {hasResults && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setSearchTerm("");
                    router.push("/search");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search Results */}
      {hasQuery ? (
        isError ? (
          // Error State
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h3 className="text-xl font-semibold mb-3">Search Error</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Something went wrong while searching. Please try again or check
              your connection.
            </p>
            <Button
              onClick={() => {
                setQuery("");
                setSearchTerm("");
                router.push("/search");
              }}
            >
              Start Over
            </Button>
          </div>
        ) : isLoading ? (
          // Loading State
          <div className="text-center py-16">
            <div className="animate-spin mx-auto h-16 w-16 border-4 border-primary border-t-transparent rounded-full mb-6"></div>
            <h3 className="text-xl font-semibold mb-3">Searching...</h3>
            <p className="text-muted-foreground">
              Finding the best results for "{query}"
            </p>
          </div>
        ) : hasResults ? (
          <div className="space-y-12">
            {/* Categories Results */}
            {searchResults.categories.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <Badge variant="secondary">
                      {searchResults.categories.length}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/categories">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.categories.map((category: any) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </section>
            )}

            {/* Implementations Results */}
            {searchResults.implementations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-600" />
                    <h2 className="text-2xl font-semibold">Implementations</h2>
                    <Badge variant="secondary">
                      {searchResults.implementations.length}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/implementations">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.implementations.map((implementation: any) => (
                    <ImplementationCard
                      key={implementation.id}
                      implementation={implementation}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          // No Results
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold mb-3">No results found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We couldn't find any categories or implementations matching "
              {query}". Try adjusting your search terms or browse all content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/implementations">Browse Implementations</Link>
              </Button>
            </div>
          </div>
        )
      ) : (
        // Search Suggestions
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Popular Searches</h2>
            <p className="text-muted-foreground">
              Try searching for these popular categories and technologies
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Authentication",
              "React",
              "Next.js",
              "Database",
              "Testing",
              "API",
              "TypeScript",
              "Node.js",
              "Python",
              "Docker",
              "GraphQL",
              "Redis",
            ].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="justify-start"
              >
                <Search className="mr-2 h-3 w-3" />
                {term}
              </Button>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t text-center">
            <h3 className="text-xl font-semibold mb-4">Explore Everything</h3>
            <p className="text-muted-foreground mb-8">
              Or browse all categories and implementations to discover new
              technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/categories">
                  <Folder className="mr-2 h-4 w-4" />
                  All Categories
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/implementations">
                  <Package className="mr-2 h-4 w-4" />
                  All Implementations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
