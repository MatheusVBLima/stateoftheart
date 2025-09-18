"use client";

import {
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  TrendingUp,
  X as XIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  tags?: Array<{ id: string; name: string; slug: string; color?: string }>;
  currentCategory?: string;
  currentTags?: string[];
  currentSort?: string;
  currentOrder?: string;
}

export function FilterBar({
  categories = [],
  tags = [],
  currentCategory = "",
  currentTags = [],
  currentSort = "recent",
  currentOrder = "desc",
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    currentCategory || "all",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [selectedOrder, setSelectedOrder] = useState(currentOrder);

  const sortOptions = [
    { value: "recent", label: "Recently Added", icon: Calendar },
    { value: "popular", label: "Most Popular", icon: Star },
    { value: "trending", label: "Trending", icon: TrendingUp },
    { value: "name", label: "Name", icon: SortAsc },
    { value: "votes", label: "Vote Count", icon: Star },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update URL parameters
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    } else {
      params.delete("tags");
    }

    if (selectedSort !== "recent") {
      params.set("sort", selectedSort);
    } else {
      params.delete("sort");
    }

    if (selectedOrder !== "desc") {
      params.set("order", selectedOrder);
    } else {
      params.delete("order");
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/implementations${newUrl}`);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTags([]);
    setSelectedSort("recent");
    setSelectedOrder("desc");
    router.push("/implementations");
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== "all") ||
    selectedTags.length > 0 ||
    selectedSort !== "recent" ||
    selectedOrder !== "desc";

  const toggleTag = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug)
        ? prev.filter((t) => t !== tagSlug)
        : [...prev, tagSlug],
    );
  };

  const removeTag = (tagSlug: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagSlug));
  };

  const getSortIcon = () => {
    const option = sortOptions.find((opt) => opt.value === selectedSort);
    if (!option) return SortAsc;
    return selectedOrder === "desc" ? SortDesc : option.icon;
  };

  const SortIcon = getSortIcon();

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-base">Filters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tags.length > 0 && (
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={
                        selectedTags.includes(tag.slug)
                          ? "default"
                          : "secondary"
                      }
                      className="cursor-pointer text-xs hover:opacity-80 transition-opacity"
                      onClick={() => toggleTag(tag.slug)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Sort by
              </label>
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Order Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Order
              </label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <SortDesc className="h-4 w-4" />
                      <span>Desc</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      <span>Asc</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-3 md:col-span-2 lg:col-span-1">
              <div className="flex gap-2 w-full">
                <Button onClick={applyFilters} size="sm" className="flex-1">
                  Apply
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">
                Active filters:
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory && selectedCategory !== "all" && (
                  <div className="bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 text-xs font-medium transition-all">
                    Category:{" "}
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button
                      type="button"
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCategory("all");
                      }}
                      aria-label="Remove category filter"
                    >
                      <XIcon size={14} aria-hidden="true" />
                    </button>
                  </div>
                )}

                {selectedTags.map((tagSlug) => {
                  const tag = tags.find((t) => t.slug === tagSlug);
                  return tag ? (
                    <div
                      key={tagSlug}
                      className="bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 text-xs font-medium transition-all"
                    >
                      {tag.name}
                      <button
                        type="button"
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeTag(tagSlug);
                        }}
                        aria-label="Remove tag filter"
                      >
                        <XIcon size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ) : null;
                })}

                {selectedSort !== "recent" && (
                  <div className="bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 text-xs font-medium transition-all">
                    <SortIcon className="h-3 w-3 mr-1" />
                    {sortOptions.find((s) => s.value === selectedSort)?.label}
                    <button
                      type="button"
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSort("recent");
                      }}
                      aria-label="Remove sort filter"
                    >
                      <XIcon size={14} aria-hidden="true" />
                    </button>
                  </div>
                )}

                {selectedOrder !== "desc" && (
                  <div className="bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 text-xs font-medium transition-all">
                    Order: {selectedOrder}
                    <button
                      type="button"
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedOrder("desc");
                      }}
                      aria-label="Remove order filter"
                    >
                      <XIcon size={14} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
