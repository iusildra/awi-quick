/*
  Warnings:

  - You are about to drop the column `nb_volunteers` on the `zone` table. All the data in the column will be lost.
  - Added the required column `nb_volunteers` to the `festival_zone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "festival_zone" ADD COLUMN     "nb_volunteers" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "zone" DROP COLUMN "nb_volunteers";
