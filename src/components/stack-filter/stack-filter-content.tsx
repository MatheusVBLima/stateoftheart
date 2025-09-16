"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles, Filter, ArrowRight, ExternalLink, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomBreadcrumb } from "@/components/ui/custom-breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { ImplementationCard } from "@/components/implementation/implementation-card";
import { getStateOfTheArtByCategory } from "@/lib/queries";

const STORAGE_KEY = "stack-filter-selected-technologies";

export function StackFilterContent() {
  const [selectedTechnologies, setSelectedTechnologies] = useState<Option[]>([]);
  const [selectedImplementation, setSelectedImplementation] = useState<string | null>(null);

  // Load saved technologies from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedTechnologies = JSON.parse(saved);
        if (Array.isArray(parsedTechnologies)) {
          setSelectedTechnologies(parsedTechnologies);
        }
      }
    } catch (error) {
      console.warn("Failed to load saved technologies:", error);
    }
  }, []);

  // Save technologies to localStorage whenever selection changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTechnologies));
    } catch (error) {
      console.warn("Failed to save technologies:", error);
    }
  }, [selectedTechnologies]);

  // Fetch all State of the Art technologies
  const { data: stateOfTheArtData, isLoading } = useQuery({
    queryKey: ["state-of-the-art"],
    queryFn: getStateOfTheArtByCategory,
  });

  // Fetch selected implementation details
  const { data: implementationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["implementation", selectedImplementation],
    queryFn: async () => {
      const response = await fetch(`/api/implementation/${selectedImplementation}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch implementation: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!selectedImplementation,
  });

  // Transform data for multiselect options
  const multiselectOptions = useMemo(() => {
    if (!stateOfTheArtData) return [];

    const options: Option[] = [];

    stateOfTheArtData.forEach((categoryGroup) => {
      categoryGroup.implementations.forEach((impl) => {
        options.push({
          value: impl.name,
          label: impl.name,
          category: categoryGroup.category.name, // Group by category
        });
      });
    });

    return options;
  }, [stateOfTheArtData]);

  // Filter results based on selected technologies
  const filteredResults = useMemo(() => {
    if (!stateOfTheArtData || selectedTechnologies.length === 0) {
      return [];
    }

    const selectedNames = selectedTechnologies.map(tech => tech.value);

    return stateOfTheArtData
      .map((categoryGroup) => ({
        ...categoryGroup,
        implementations: categoryGroup.implementations.filter((impl) =>
          selectedNames.includes(impl.name)
        ),
      }))
      .filter((group) => group.implementations.length > 0);
  }, [stateOfTheArtData, selectedTechnologies]);

  const totalResults = filteredResults.reduce(
    (total, group) => total + group.implementations.length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${selectedImplementation ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}`}>
        {/* Main Content */}
        <div className={`${selectedImplementation ? 'min-w-0' : ''}`}>
          {/* Breadcrumbs */}
          <div className="mb-6">
            <CustomBreadcrumb />
          </div>

          {/* Header */}
          <header className="mb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Filter className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Your Stack Filter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the technologies in your stack and discover which ones are currently
            <span className="text-primary font-semibold"> State of the Art</span> based on community votes.
          </p>
        </div>
      </header>

      {/* Stack Selector */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Select Your Technology Stack</span>
            </CardTitle>
            <CardDescription>
              Choose the technologies you use or are interested in. Only State of the Art technologies are shown.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultipleSelector
              value={selectedTechnologies}
              onChange={setSelectedTechnologies}
              options={multiselectOptions}
              placeholder="Search and select technologies..."
              groupBy="category"
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-muted-foreground">
                  No technologies found.
                </p>
              }
              loadingIndicator={
                <p className="text-center text-sm leading-10 text-muted-foreground">
                  Loading technologies...
                </p>
              }
              className="w-full"
              badgeClassName="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              maxSelected={20} // Limit selection
              hidePlaceholderWhenSelected
            />

            {selectedTechnologies.length > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {selectedTechnologies.length} {selectedTechnologies.length === 1 ? 'technology' : 'technologies'} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTechnologies([]);
                    localStorage.removeItem(STORAGE_KEY);
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {selectedTechnologies.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">
                State of the Art in Your Stack
              </h2>
            </div>
            <Badge variant="secondary" className="text-sm">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </Badge>
          </div>

          <div className="space-y-12">
            {filteredResults.map((categoryGroup) => (
              <section key={categoryGroup.category.id}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold">
                      {categoryGroup.category.name}
                    </h3>
                    <Badge variant="outline">
                      {categoryGroup.implementations.length}
                    </Badge>
                  </div>
                </div>

                <div className={`grid gap-6 ${selectedImplementation ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {categoryGroup.implementations.map((implementation) => (
                    <div key={implementation.id} className="relative">
                      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center space-x-2">
                                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                  {implementation.name}
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {implementation.category.name}
                                </Badge>
                              </div>
                              <CardDescription className="text-sm line-clamp-3">
                                {implementation.description}
                              </CardDescription>
                            </div>
                          </div>

                          {(implementation.website || implementation.githubUrl) && (
                            <div className="flex items-center space-x-2 pt-2">
                              {implementation.website && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={implementation.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-7 px-2 text-xs"
                                  >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    Website
                                  </a>
                                </Button>
                              )}
                              {implementation.githubUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={implementation.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-7 px-2 text-xs"
                                  >
                                    <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    GitHub
                                  </a>
                                </Button>
                              )}
                            </div>
                          )}
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V7a2 2 0 012-2s0 0 0 0 1.98 0 2 0h1m2 0h3m2 0a2 2 0 012 2v3a2 2 0 01-2 2H9m12 0a2 2 0 01-2 2v0c0 1.1-.9 2-2 2H9m3 0h3"/>
                                </svg>
                                <span>{implementation._count.votes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                <span>{implementation._count.comments}</span>
                              </div>
                            </div>

                            {/* Action buttons replacing the arrow */}
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => setSelectedImplementation(implementation.slug)}
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => window.open(`/implementation/${implementation.slug}`, '_blank')}
                                title="Open in new tab"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Badge
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        variant="default"
                      >
                        🏆 State of the Art
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        // No Selection State
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Select Your Technologies</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose technologies from the selector above to see which ones are currently
                State of the Art in the community.
              </p>
            </div>

            {/* Popular Technologies Quick Select */}
            {stateOfTheArtData && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Or quickly select popular technologies:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {stateOfTheArtData.slice(0, 6).map((categoryGroup) =>
                    categoryGroup.implementations.slice(0, 1).map((impl) => (
                      <Button
                        key={impl.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTechnologies([{
                            value: impl.name,
                            label: impl.name,
                            category: categoryGroup.category.name,
                          }]);
                        }}
                        className="text-xs"
                      >
                        <ArrowRight className="mr-1 h-3 w-3" />
                        {impl.name}
                      </Button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading technologies...</p>
            </div>
          )}
        </div>

        {/* Details Panel - Right Side */}
        {selectedImplementation && (
          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Implementation Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImplementation(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)] px-6">
                  {isLoadingDetails ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : implementationDetails ? (
                    <div className="space-y-6 pb-6">
                      {/* Header */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">{implementationDetails.name}</h2>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/implementation/${implementationDetails.slug}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Full Page
                          </Button>
                        </div>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          🏆 State of the Art
                        </Badge>
                        <p className="text-muted-foreground">{implementationDetails.description}</p>
                      </div>

                      {/* Category */}
                      <div>
                        <h3 className="font-semibold mb-2">Category</h3>
                        <Badge variant="outline">{implementationDetails.category.name}</Badge>
                      </div>

                      {/* Links */}
                      <div className="space-y-3">
                        <h3 className="font-semibold">Links</h3>
                        <div className="space-y-2">
                          {implementationDetails.website && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => window.open(implementationDetails.website!, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Official Website
                            </Button>
                          )}
                          {implementationDetails.githubUrl && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => window.open(implementationDetails.githubUrl!, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              GitHub Repository
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div>
                        <h3 className="font-semibold mb-3">Community Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {implementationDetails._count.votes}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Votes</div>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {implementationDetails._count.comments}
                            </div>
                            <div className="text-sm text-muted-foreground">Comments</div>
                          </div>
                        </div>
                      </div>

                      {/* Comments Preview */}
                      {implementationDetails.comments && implementationDetails.comments.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Latest Comments</h3>
                          <div className="space-y-3">
                            {implementationDetails.comments.slice(0, 3).map((comment: any) => (
                              <div key={comment.id} className="p-3 border rounded-lg">
                                <p className="text-sm line-clamp-3">{comment.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                            {implementationDetails.comments.length > 3 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => window.open(`/implementation/${implementationDetails.slug}`, '_blank')}
                              >
                                View all {implementationDetails.comments.length} comments
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Implementation not found</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}