/*
  Warnings:

  - The primary key for the `game_assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `table_id` on the `game_assignment` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `game_assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "game_assignment" DROP CONSTRAINT "game_assignment_table_id_fkey";

-- AlterTable
ALTER TABLE "game_assignment" DROP CONSTRAINT "game_assignment_pkey",
DROP COLUMN "table_id",
ADD COLUMN     "room_id" INTEGER NOT NULL,
ADD CONSTRAINT "game_assignment_pkey" PRIMARY KEY ("room_id", "game_id");

-- AddForeignKey
ALTER TABLE "game_assignment" ADD CONSTRAINT "game_assignment_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "zone_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
