/*
  Warnings:

  - You are about to drop the column `path` on the `Node` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Node" DROP COLUMN "path",
ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "url" TEXT;
