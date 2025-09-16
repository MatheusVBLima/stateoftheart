import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding tags...");

  const tags = [
    {
      name: "Frontend",
      slug: "frontend",
      description: "Frontend frameworks and libraries",
      color: "#3B82F6",
    },
    {
      name: "Backend",
      slug: "backend",
      description: "Backend frameworks and APIs",
      color: "#10B981",
    },
    {
      name: "Database",
      slug: "database",
      description: "Database systems and ORMs",
      color: "#F59E0B",
    },
    {
      name: "React",
      slug: "react",
      description: "React and React ecosystem",
      color: "#61DAFB",
    },
    {
      name: "TypeScript",
      slug: "typescript",
      description: "TypeScript related tools",
      color: "#3178C6",
    },
    {
      name: "JavaScript",
      slug: "javascript",
      description: "JavaScript tools and libraries",
      color: "#F7DF1E",
    },
    {
      name: "Python",
      slug: "python",
      description: "Python frameworks and tools",
      color: "#3776AB",
    },
    {
      name: "Cloud",
      slug: "cloud",
      description: "Cloud platforms and services",
      color: "#FF9900",
    },
    {
      name: "DevOps",
      slug: "devops",
      description: "DevOps tools and practices",
      color: "#326CE5",
    },
    {
      name: "Mobile",
      slug: "mobile",
      description: "Mobile development frameworks",
      color: "#A855F7",
    },
    {
      name: "AI/ML",
      slug: "ai-ml",
      description: "Artificial Intelligence and Machine Learning",
      color: "#EF4444",
    },
    {
      name: "Open Source",
      slug: "open-source",
      description: "Open source projects",
      color: "#059669",
    },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  console.log("Tags seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
