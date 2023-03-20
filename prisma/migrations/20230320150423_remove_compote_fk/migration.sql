/*
  Warnings:

  - You are about to drop the column `festival_id` on the `volunteer_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `zoneId` on the `volunteer_assignments` table. All the data in the column will be lost.
  - You are about to drop the `festival_zone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `festival_id` to the `zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "festival_zone" DROP CONSTRAINT "festival_zone_festival_id_fkey";

-- DropForeignKey
ALTER TABLE "festival_zone" DROP CONSTRAINT "festival_zone_zone_id_fkey";

-- DropForeignKey
ALTER TABLE "volunteer_assignments" DROP CONSTRAINT "volunteer_assignments_festival_id_zone_id_fkey";

-- AlterTable
ALTER TABLE "volunteer_assignments" DROP COLUMN "festival_id",
DROP COLUMN "zoneId";

-- AlterTable
ALTER TABLE "zone" ADD COLUMN     "festival_id" UUID NOT NULL;

-- DropTable
DROP TABLE "festival_zone";

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
