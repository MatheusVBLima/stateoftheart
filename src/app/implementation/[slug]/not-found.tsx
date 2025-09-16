import { Home, Package, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ImplementationNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Implementation Not Found</CardTitle>
            <CardDescription>
              The implementation you're looking for doesn't exist or has been
              removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/implementations">
                  <Package className="mr-2 h-4 w-4" />
                  Browse Implementations
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Can't find what you're looking for?
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit New Implementation
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
