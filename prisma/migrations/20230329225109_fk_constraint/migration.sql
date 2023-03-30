-- DropForeignKey
ALTER TABLE "zone" DROP CONSTRAINT "zone_festival_id_fkey";

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
