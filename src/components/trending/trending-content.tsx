"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Clock, Flame, Star, TrendingUp, Trophy } from "lucide-react";
import { useState } from "react";
import { ImplementationCard } from "@/components/implementation/implementation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomBreadcrumb } from "@/components/ui/custom-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabValue = "trending" | "popular" | "recent";

export function TrendingContent() {
  const [activeTab, setActiveTab] = useState<TabValue>("trending");

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const response = await fetch("/api/trending");
      if (!response.ok) throw new Error("Failed to fetch trending");
      return response.json();
    },
  });

  const { data: popular } = useQuery({
    queryKey: ["popular"],
    queryFn: async () => {
      const response = await fetch("/api/popular");
      if (!response.ok) throw new Error("Failed to fetch popular");
      return response.json();
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["recent"],
    queryFn: async () => {
      const response = await fetch("/api/implementations");
      if (!response.ok) throw new Error("Failed to fetch recent");
      return response.json();
    },
  });

  const getCurrentData = () => {
    switch (activeTab) {
      case "trending":
        return trending || [];
      case "popular":
        return popular || [];
      case "recent":
        return recent || [];
      default:
        return [];
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case "trending":
        return "Implementations gaining momentum based on recent community activity";
      case "popular":
        return "Most loved implementations by the community based on all-time votes";
      case "recent":
        return "Latest implementations added to the platform";
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (activeTab) {
      case "trending":
        return <TrendingUp className="h-5 w-5" />;
      case "popular":
        return <Star className="h-5 w-5" />;
      case "recent":
        return <Clock className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <CustomBreadcrumb />
      </div>

      {/* Header */}
      <header className="mb-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold">Trending & Popular</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Discover what's hot in the state-of-the-art tech ecosystem
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trending Now</p>
                <p className="text-2xl font-bold">{trending?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Most Popular</p>
                <p className="text-2xl font-bold">{popular?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recently Added</p>
                <p className="text-2xl font-bold">{recent?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Popular</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Recent</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Header */}
        <div className="flex items-center space-x-3 mb-6">
          {getIcon()}
          <div>
            <h2 className="text-2xl font-semibold capitalize">
              {activeTab} Implementations
            </h2>
            <p className="text-muted-foreground">{getDescription()}</p>
          </div>
        </div>

        <TabsContent value="trending" className="space-y-6">
          {trending && trending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((implementation: any, index: number) => (
                <div key={implementation.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-orange-500 hover:bg-orange-600">
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                  <ImplementationCard implementation={implementation} />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No trending implementations
                </h3>
                <p className="text-muted-foreground">
                  Be the first to vote and create some trending content!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          {popular && popular.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular.map((implementation: any, index: number) => (
                <div key={implementation.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                  <ImplementationCard implementation={implementation} />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No popular implementations
                </h3>
                <p className="text-muted-foreground">
                  Start voting to see popular implementations!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {recent && recent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((implementation: any, index: number) => (
                <div key={implementation.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="outline">New</Badge>
                    </div>
                  )}
                  <ImplementationCard implementation={implementation} />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No recent implementations
                </h3>
                <p className="text-muted-foreground">
                  Be the first to submit an implementation!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
