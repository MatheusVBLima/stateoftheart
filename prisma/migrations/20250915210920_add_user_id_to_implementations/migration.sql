/*
  Warnings:

  - Added the required column `userId` to the `implementations` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_implementations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "githubUrl" TEXT,
    "logoUrl" TEXT,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "implementations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_implementations" ("categoryId", "createdAt", "description", "githubUrl", "id", "logoUrl", "name", "slug", "updatedAt", "website", "userId") SELECT "categoryId", "createdAt", "description", "githubUrl", "id", "logoUrl", "name", "slug", "updatedAt", "website", 'legacy_user' FROM "implementations";
DROP TABLE "implementations";
ALTER TABLE "new_implementations" RENAME TO "implementations";
CREATE UNIQUE INDEX "implementations_slug_key" ON "implementations"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
