-- CreateEnum
CREATE TYPE "enum_weekday" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterTable
ALTER TABLE "timeslot" ADD COLUMN     "weekday" "enum_weekday" NOT NULL DEFAULT 'Saturday',
ALTER COLUMN "start" SET DATA TYPE TIME,
ALTER COLUMN "end" SET DATA TYPE TIME;
