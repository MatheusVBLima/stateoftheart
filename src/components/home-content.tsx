"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/category/category-card";
import { ImplementationCard } from "@/components/implementation/implementation-card";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedImplementations } from "@/lib/queries";

export function HomeContent() {
  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: featuredImplementations } = useSuspenseQuery({
    queryKey: ["featured-implementations"],
    queryFn: () => getFeaturedImplementations(8),
  });

  return (
    <main className="container mx-auto px-4 py-16 space-y-16">
      {/* Featured Categories Section */}
      <section id="featured-categories">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              <Star className="inline mr-2 h-8 w-8 text-yellow-500" />
              Featured Categories
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore the most popular technology categories and their top
              implementations
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Implementations Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              <TrendingUp className="inline mr-2 h-8 w-8 text-green-500" />
              Latest Implementations
            </h2>
            <p className="text-muted-foreground mt-2">
              Recent additions to the State Of The Art community
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/implementations">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredImplementations.slice(0, 8).map((implementation) => (
            <ImplementationCard
              key={implementation.id}
              implementation={implementation}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 border rounded-lg bg-muted/30">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Join the State Of The Art Community
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Help developers make better technology choices by voting on
          implementations and sharing your experiences. Your expertise shapes
          the future of development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
