import { auth, currentUser } from "@clerk/nextjs/server";

export { auth, currentUser };

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User must be authenticated");
  }
  return { userId };
}

export async function getCurrentUser() {
  return await currentUser();
}
