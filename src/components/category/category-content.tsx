"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Crown, Package, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ImplementationCard } from "@/components/implementation/implementation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug } from "@/lib/queries";

interface CategoryContentProps {
  slug: string;
}

export function CategoryContent({ slug }: CategoryContentProps) {
  const { data: category } = useSuspenseQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug(slug),
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="text-muted-foreground mt-2">
          The requested category does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  // Sort implementations by vote count (descending)
  const sortedImplementations = [...category.implementations].sort(
    (a, b) => b._count.votes - a._count.votes
  );

  const stateOfArt = sortedImplementations[0]; // Top voted implementation

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </nav>

      {/* Category Header */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-bold">{category.name}</h1>
              <Badge variant="secondary">
                <Package className="mr-1 h-3 w-3" />
                {category.implementations.length} implementations
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          </div>

          <Button size="lg" asChild>
            <Link href="/submit">
              <Plus className="mr-2 h-4 w-4" />
              Submit Implementation
            </Link>
          </Button>
        </div>
      </header>

      {/* State of Art Winner */}
      {stateOfArt && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Current State Of The Art</h2>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {stateOfArt.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {stateOfArt.description}
                </p>
                {(stateOfArt.website || stateOfArt.githubUrl) && (
                  <div className="flex space-x-3">
                    {stateOfArt.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={stateOfArt.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      </Button>
                    )}
                    {stateOfArt.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={stateOfArt.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">
                  {stateOfArt._count.votes} votes
                </div>
                <div className="text-sm text-muted-foreground">
                  {stateOfArt._count.comments} comments
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Implementations */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold">All Implementations</h2>
            <Badge variant="outline">{category.implementations.length}</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Sort by Votes
            </Button>
            <Button variant="ghost" size="sm">
              Sort by Recent
            </Button>
          </div>
        </div>

        {sortedImplementations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedImplementations.map((implementation, index) => (
              <div key={implementation.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Crown className="mr-1 h-3 w-3" />
                      #1
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
              No implementations yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to contribute an implementation for {category.name}!
            </p>
            <Button asChild>
              <Link href="/submit">
                <Plus className="mr-2 h-4 w-4" />
                Submit First Implementation
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
