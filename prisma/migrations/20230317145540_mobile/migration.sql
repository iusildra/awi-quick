/*
  Warnings:

  - You are about to drop the column `end` on the `timeslot` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `timeslot` table. All the data in the column will be lost.
  - You are about to drop the column `weekday` on the `timeslot` table. All the data in the column will be lost.
  - The primary key for the `volunteer_assignments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `room_id` on the `volunteer_assignments` table. All the data in the column will be lost.
  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `game_assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zone_room` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `start` on the `timeslot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `zone_id` to the `volunteer_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `festivalId` to the `zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "game_assignment" DROP CONSTRAINT "game_assignment_game_id_fkey";

-- DropForeignKey
ALTER TABLE "game_assignment" DROP CONSTRAINT "game_assignment_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_table" DROP CONSTRAINT "room_table_room_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_room_id_fkey";

-- DropForeignKey
ALTER TABLE "zone_room" DROP CONSTRAINT "zone_room_zone_id_fkey";

-- AlterTable
ALTER TABLE "timeslot" DROP COLUMN "end",
DROP COLUMN "name",
DROP COLUMN "weekday",
DROP COLUMN "start",
ADD COLUMN     "start" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_pkey",
DROP COLUMN "room_id",
ADD COLUMN     "zone_id" INTEGER NOT NULL,
ADD CONSTRAINT "volunteer_assignments_pkey" PRIMARY KEY ("volunteer_id", "zone_id", "timeslot_id");

-- AlterTable
ALTER TABLE "zone" ADD COLUMN     "festivalId" UUID NOT NULL;

-- DropTable
DROP TABLE "game";

-- DropTable
DROP TABLE "game_assignment";

-- DropTable
DROP TABLE "room_table";

-- DropTable
DROP TABLE "zone_room";

-- DropEnum
DROP TYPE "enum_game_type";

-- DropEnum
DROP TYPE "enum_weekday";

-- CreateTable
CREATE TABLE "festival" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "begin" DATE NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "festival_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
