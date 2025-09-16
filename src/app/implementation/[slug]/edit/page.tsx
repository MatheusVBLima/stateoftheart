import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EditImplementationForm } from "@/components/implementation/edit-implementation-form";
import { db } from "@/lib/db";

interface EditImplementationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditImplementationPage({
  params,
}: EditImplementationPageProps) {
  const { userId } = await auth();
  const { slug } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  // Get implementation data
  const implementation = await db.implementation.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!implementation) {
    redirect("/404");
  }

  // Get all categories for the select
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Implementation</h1>
        <p className="text-muted-foreground">
          Update the details for {implementation.name}
        </p>
      </div>

      <EditImplementationForm
        implementation={implementation}
        categories={categories}
      />
    </div>
  );
}
