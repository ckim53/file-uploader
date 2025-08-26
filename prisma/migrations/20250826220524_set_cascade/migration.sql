-- DropForeignKey
ALTER TABLE "public"."Node" DROP CONSTRAINT "Node_parentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Node" ADD CONSTRAINT "Node_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
