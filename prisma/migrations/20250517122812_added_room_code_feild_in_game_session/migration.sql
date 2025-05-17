/*
  Warnings:

  - A unique constraint covering the columns `[roomCode]` on the table `GameSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomCode` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GameSession` ADD COLUMN `roomCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `GameSession_roomCode_key` ON `GameSession`(`roomCode`);
