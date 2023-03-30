-- DropForeignKey
ALTER TABLE "timeslot" DROP CONSTRAINT "timeslot_festival_day_id_fkey";

-- AddForeignKey
ALTER TABLE "timeslot" ADD CONSTRAINT "timeslot_festival_day_id_fkey" FOREIGN KEY ("festival_day_id") REFERENCES "festival_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
