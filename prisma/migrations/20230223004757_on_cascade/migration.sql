-- DropForeignKey
ALTER TABLE "room_table" DROP CONSTRAINT "room_table_room_id_fkey";

-- DropForeignKey
ALTER TABLE "zone_room" DROP CONSTRAINT "zone_room_zone_id_fkey";

-- AddForeignKey
ALTER TABLE "zone_room" ADD CONSTRAINT "zone_room_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_table" ADD CONSTRAINT "room_table_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "zone_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
