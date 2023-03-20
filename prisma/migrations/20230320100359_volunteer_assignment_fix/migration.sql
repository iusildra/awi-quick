/*
  Warnings:

  - Added the required column `festival_id` to the `volunteer_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "volunteer_assignments" ADD COLUMN     "festival_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
