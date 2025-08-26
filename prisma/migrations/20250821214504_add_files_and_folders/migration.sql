-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('FILE', 'FOLDER');

-- CreateTable
CREATE TABLE "public"."Node" (
    "id" SERIAL NOT NULL,
    "type" "public"."NodeType" NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "contentType" TEXT,
    "size" INTEGER,
    "path" TEXT,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Node_parentId_idx" ON "public"."Node"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Node_parentId_name_key" ON "public"."Node"("parentId", "name");

-- AddForeignKey
ALTER TABLE "public"."Node" ADD CONSTRAINT "Node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;
