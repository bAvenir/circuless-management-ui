-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
