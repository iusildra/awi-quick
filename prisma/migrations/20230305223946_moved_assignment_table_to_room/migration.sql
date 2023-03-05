/*
  Warnings:

  - The primary key for the `volunteer_assignments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `table_id` on the `volunteer_assignments` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `volunteer_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_table_id_fkey";

-- AlterTable
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_pkey",
DROP COLUMN "table_id",
ADD COLUMN     "room_id" INTEGER NOT NULL,
ADD CONSTRAINT "volunteer_assignments_pkey" PRIMARY KEY ("volunteer_id", "room_id", "timeslot_id");

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "zone_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
