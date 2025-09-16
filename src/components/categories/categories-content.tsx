"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Filter, Folder, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { CategoryCard } from "@/components/category/category-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomBreadcrumb } from "@/components/ui/custom-breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/lib/queries";

export function CategoriesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Filter and sort categories
  const filteredCategories = categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "implementations":
          return b._count.implementations - a._count.implementations;
        case "activity": {
          // Sort by total votes across all implementations
          const aVotes = a.implementations.reduce(
            (sum, impl) => sum + impl._count.votes,
            0,
          );
          const bVotes = b.implementations.reduce(
            (sum, impl) => sum + impl._count.votes,
            0,
          );
          return bVotes - aVotes;
        }
        default:
          return 0;
      }
    });

  const totalImplementations = categories.reduce(
    (sum, category) => sum + category._count.implementations,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <CustomBreadcrumb />
      </div>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <Folder className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">All Categories</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore all technology categories and discover what the community
            considers the state-of-the-art in each area. Vote on implementations
            and join the discussion.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge variant="secondary">{categories.length} categories</Badge>
            <Badge variant="secondary">
              {totalImplementations} implementations
            </Badge>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="implementations">
                  Most Implementations
                </SelectItem>
                <SelectItem value="activity">Most Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredCategories.length} result
              {filteredCategories.length !== 1 ? "s" : ""}
              for "{searchTerm}"
            </p>
            {filteredCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section>
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? `No categories match "${searchTerm}". Try a different search term.`
                : "No categories are available at the moment."}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Show all categories
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Stats Section */}
      {!searchTerm && (
        <section className="mt-16 pt-16 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Technology Categories
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalImplementations}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Implementations
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {categories.reduce(
                  (sum, cat) =>
                    sum +
                    cat.implementations.reduce(
                      (implSum, impl) => implSum + impl._count.votes,
                      0,
                    ),
                  0,
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Community Votes
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
