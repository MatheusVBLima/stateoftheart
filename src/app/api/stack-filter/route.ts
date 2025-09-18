import { type NextRequest, NextResponse } from "next/server";
import {
  getStateOfTheArtByCategory,
  getStateOfTheArtFiltered,
} from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const technologiesParam = searchParams.get("technologies");

    // Parse technologies from query parameter
    const technologies = technologiesParam
      ? technologiesParam
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)
      : [];

    // Get State of the Art implementations
    const stateOfTheArtData =
      technologies.length > 0
        ? await getStateOfTheArtFiltered(technologies)
        : await getStateOfTheArtByCategory();

    // Format data for the stack filter component
    const availableTechnologies = stateOfTheArtData.reduce(
      (acc, categoryGroup) => {
        // Add category to accumulator if not exists
        if (!acc.find((cat) => cat.label === categoryGroup.category.name)) {
          acc.push({
            label: categoryGroup.category.name,
            technologies: [],
          });
        }

        // Find the category and add technologies
        const categoryIndex = acc.findIndex(
          (cat) => cat.label === categoryGroup.category.name,
        );
        if (categoryIndex !== -1) {
          acc[categoryIndex].technologies = categoryGroup.implementations.map(
            (impl) => ({
              name: impl.name,
              slug: impl.slug,
              description: impl.description,
              netVotes: impl.netVotes,
              website: impl.website,
              githubUrl: impl.githubUrl,
            }),
          );
        }

        return acc;
      },
      [] as Array<{
        label: string;
        technologies: Array<{
          name: string;
          slug: string;
          description: string;
          netVotes: number;
          website?: string;
          githubUrl?: string;
        }>;
      }>,
    );

    // Filter results if technologies were selected
    const filteredResults = technologies.length > 0 ? stateOfTheArtData : [];

    return NextResponse.json({
      availableTechnologies,
      selectedTechnologies: technologies,
      results: filteredResults,
      totalResults: filteredResults.reduce(
        (total, group) => total + group.implementations.length,
        0,
      ),
    });
  } catch (error) {
    console.error("Stack filter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { technologies } = body;

    if (!Array.isArray(technologies)) {
      return NextResponse.json(
        { error: "Technologies must be an array" },
        { status: 400 },
      );
    }

    // Get filtered State of the Art implementations
    const results = await getStateOfTheArtFiltered(technologies);

    return NextResponse.json({
      selectedTechnologies: technologies,
      results,
      totalResults: results.reduce(
        (total, group) => total + group.implementations.length,
        0,
      ),
    });
  } catch (error) {
    console.error("Stack filter POST API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
