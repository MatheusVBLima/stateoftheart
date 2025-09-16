"use client";

import { Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Highlight } from "@/components/ui/hero-highlight";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative py-20 overflow-hidden bg-card/30">
      <BackgroundRippleEffect />
      <div className="w-full px-4 text-center relative z-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Discover the{" "}
          <Highlight className="bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/80">
            State Of The Art
          </Highlight>{" "}
          in Technology
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground mb-8">
          Community-driven platform where developers vote on and discuss the
          best implementations across different technology categories. From
          authentication to ORMs, discover what's truly state-of-the-art.
        </p>

        <div className="mx-auto max-w-md mb-8">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a category or implementation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="default">
              Search
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Button variant="outline" size="sm" asChild>
            <a href="#featured-categories">
              <TrendingUp className="mr-2 h-4 w-4" />
              Featured Categories
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/trending">Popular This Week</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/categories">Browse All</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
