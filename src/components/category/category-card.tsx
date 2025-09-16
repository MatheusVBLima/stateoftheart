import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    _count: {
      implementations: number;
    };
    implementations: Array<{
      id: string;
      name: string;
      _count: {
        votes: number;
      };
    }>;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const topImplementations = category.implementations
    .sort((a, b) => b._count.votes - a._count.votes)
    .slice(0, 3);

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {category.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {category.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 shrink-0">
            <Package className="mr-1 h-3 w-3" />
            {category._count.implementations}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {topImplementations.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Top Implementations
            </p>
            <div className="space-y-1">
              {topImplementations.map((impl) => (
                <div
                  key={impl.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground font-medium">
                    {impl.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {impl._count.votes} votes
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No implementations yet. Be the first to contribute!
          </p>
        )}

        <Link
          href={`/category/${category.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${category.name} category`}
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-xs text-muted-foreground">
            View all implementations
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
}
