import {
  ArrowUpRight,
  ExternalLink,
  Github,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImplementationCardProps {
  implementation: {
    id: string;
    name: string;
    slug: string;
    description: string;
    website?: string | null;
    githubUrl?: string | null;
    category: {
      name: string;
      slug: string;
    };
    tags?: Array<{
      tag: {
        id: string;
        name: string;
        slug: string;
        color?: string | null;
      };
    }>;
    _count: {
      votes: number;
      comments: number;
    };
  };
}

export function ImplementationCard({
  implementation,
}: ImplementationCardProps) {
  return (
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

        {/* Tags */}
        {implementation.tags && implementation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {implementation.tags.slice(0, 3).map(({ tag }) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs px-2 py-0.5"
                style={{ backgroundColor: tag.color || undefined }}
              >
                {tag.name}
              </Badge>
            ))}
            {implementation.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{implementation.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

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
                  <Github className="mr-1 h-3 w-3" />
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
              <ThumbsUp className="h-4 w-4" />
              <span>{implementation._count.votes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{implementation._count.comments}</span>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <Link
          href={`/implementation/${implementation.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${implementation.name} details`}
        />
      </CardContent>
    </Card>
  );
}
