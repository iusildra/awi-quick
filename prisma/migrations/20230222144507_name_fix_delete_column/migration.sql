-- CreateEnum
CREATE TYPE "enum_game_type" AS ENUM ('child', 'family', 'ambiance', 'initiate', 'expert');

-- CreateTable
CREATE TABLE "game" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "enum_game_type" NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeslot" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "timeslot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zone" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zone_room" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "zone_id" INTEGER NOT NULL,

    CONSTRAINT "zone_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_table" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "room_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_assignment" (
    "table_id" INTEGER NOT NULL,
    "game_id" UUID NOT NULL,

    CONSTRAINT "game_assignment_pkey" PRIMARY KEY ("table_id","game_id")
);

-- CreateTable
CREATE TABLE "volunteer_assignments" (
    "volunteer_id" UUID NOT NULL,
    "table_id" INTEGER NOT NULL,
    "timeslot_id" INTEGER NOT NULL,

    CONSTRAINT "volunteer_assignments_pkey" PRIMARY KEY ("volunteer_id","table_id","timeslot_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_username_key" ON "volunteer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_email_key" ON "volunteer"("email");

-- AddForeignKey
ALTER TABLE "zone_room" ADD CONSTRAINT "zone_room_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_table" ADD CONSTRAINT "room_table_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "zone_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_assignment" ADD CONSTRAINT "game_assignment_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_assignment" ADD CONSTRAINT "game_assignment_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "room_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_timeslot_id_fkey" FOREIGN KEY ("timeslot_id") REFERENCES "timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_assignments" ADD CONSTRAINT "volunteer_assignments_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "room_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
