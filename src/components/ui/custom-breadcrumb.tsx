"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function CustomBreadcrumb({ items }: CustomBreadcrumbProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage
  if (pathname === "/") return null;

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname);

  // Don't show breadcrumbs if there are no items
  if (breadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-card rounded-lg border px-3 py-2 shadow-sm">
        {/* Home item */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home size={16} aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || "#"}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  if (pathname === "/") return [];

  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = formatSegmentLabel(segment);
    items.push({ label, href });
  });

  return items;
}

function formatSegmentLabel(segment: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    "stack-filter": "Stack Filter",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
  };

  if (specialCases[segment]) {
    return specialCases[segment];
  }

  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
