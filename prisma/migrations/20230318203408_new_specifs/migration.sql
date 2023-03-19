/*
  Warnings:

  - You are about to drop the column `begin` on the `festival` table. All the data in the column will be lost.
  - You are about to drop the column `festivalId` on the `zone` table. All the data in the column will be lost.
  - Added the required column `year` to the `festival` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `timeslot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nb_volunteers` to the `zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "zone" DROP CONSTRAINT "zone_festivalId_fkey";

-- AlterTable
ALTER TABLE "festival" DROP COLUMN "begin",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "timeslot" ADD COLUMN     "end" TIME NOT NULL,
ALTER COLUMN "start" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "zone" DROP COLUMN "festivalId",
ADD COLUMN     "nb_volunteers" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "festival_day" (
    "id" SERIAL NOT NULL,
    "festival_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "open_at" TIME NOT NULL,
    "close_at" TIME NOT NULL,

    CONSTRAINT "festival_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_zone" (
    "festival_id" UUID NOT NULL,
    "zone_id" INTEGER NOT NULL,

    CONSTRAINT "festival_zone_pkey" PRIMARY KEY ("festival_id","zone_id")
);

-- AddForeignKey
ALTER TABLE "festival_day" ADD CONSTRAINT "festival_day_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_zone" ADD CONSTRAINT "festival_zone_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_zone" ADD CONSTRAINT "festival_zone_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
