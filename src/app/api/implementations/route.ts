import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getImplementations, type ImplementationFilters } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: ImplementationFilters = {
      category: searchParams.get("category") || undefined,
      tags: searchParams.get("tags")
        ? searchParams.get("tags")!.split(",")
        : undefined,
      sort: (searchParams.get("sort") as any) || "recent",
      order: (searchParams.get("order") as any) || "desc",
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
    };

    const implementations = await getImplementations(filters);
    return NextResponse.json(implementations);
  } catch (error) {
    console.error("Implementations API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      website,
      githubUrl,
      logoUrl,
      categoryId,
      tagIds,
    } = body;

    // Validate required fields
    if (!name || !description || !categoryId) {
      return NextResponse.json(
        { error: "Name, description, and category are required" },
        { status: 400 },
      );
    }

    // Validate URLs if provided
    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: "Invalid website URL" },
        { status: 400 },
      );
    }

    if (githubUrl && !isValidUrl(githubUrl)) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 },
      );
    }

    if (logoUrl && !isValidUrl(logoUrl)) {
      return NextResponse.json({ error: "Invalid logo URL" }, { status: 400 });
    }

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if slug already exists
    const existingImplementation = await db.implementation.findUnique({
      where: { slug },
    });

    if (existingImplementation) {
      return NextResponse.json(
        { error: "An implementation with this name already exists" },
        { status: 409 },
      );
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Create implementation with tags
    const implementation = await db.implementation.create({
      data: {
        name,
        slug,
        description,
        website: website || null,
        githubUrl: githubUrl || null,
        logoUrl: logoUrl || null,
        categoryId,
        userId,
        tags:
          tagIds && tagIds.length > 0
            ? {
                create: tagIds.map((tagId: string) => ({
                  tagId,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(implementation, { status: 201 });
  } catch (error) {
    console.error("Implementation creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
