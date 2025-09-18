// Client-side API functions that call our API routes

export async function searchAllAPI(query: string) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateImplementationData {
  name: string;
  description: string;
  website?: string;
  githubUrl?: string;
  logoUrl?: string;
  categoryId: string;
}

export async function createImplementationAPI(data: CreateImplementationData) {
  const response = await fetch("/api/implementations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create implementation");
  }

  return response.json();
}

export async function getCategoriesAPI() {
  const response = await fetch("/api/categories");

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateCommentData {
  content: string;
  implementationId: string;
  parentId?: string;
}

export async function createCommentAPI(data: CreateCommentData) {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create comment");
  }

  return response.json();
}

export async function getStackFilterDataAPI(technologies: string[] = []) {
  const params =
    technologies.length > 0 ? `?technologies=${technologies.join(",")}` : "";

  const response = await fetch(`/api/stack-filter${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stack filter data");
  }
  return response.json();
}

export async function filterByStackAPI(technologies: string[]) {
  const response = await fetch("/api/stack-filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ technologies }),
  });

  if (!response.ok) {
    throw new Error("Failed to filter by stack");
  }
  return response.json();
}
