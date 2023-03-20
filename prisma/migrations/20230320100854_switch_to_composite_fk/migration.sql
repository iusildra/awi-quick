-- DropForeignKey
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_festival_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_zone_id_fkey";

-- AlterTable
ALTER TABLE "volunteer_assignments" ADD COLUMN     "zoneId" INTEGER;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_festival_id_zone_id_fkey" FOREIGN KEY ("festival_id", "zone_id") REFERENCES "festival_zone"("festival_id", "zone_id") ON DELETE CASCADE ON UPDATE CASCADE;
