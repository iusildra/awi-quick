/*
  Warnings:

  - Added the required column `festival_day_id` to the `timeslot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "timeslot" ADD COLUMN     "festival_day_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "timeslot" ADD CONSTRAINT "timeslot_festival_day_id_fkey" FOREIGN KEY ("festival_day_id") REFERENCES "festival_day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
