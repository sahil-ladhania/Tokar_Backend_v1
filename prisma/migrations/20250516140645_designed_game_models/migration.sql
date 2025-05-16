-- CreateTable
CREATE TABLE `Participant` (
    `participantId` INTEGER NOT NULL AUTO_INCREMENT,
    `gameSessionId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `isBot` BOOLEAN NOT NULL DEFAULT false,
    `seatNumber` INTEGER NOT NULL,

    UNIQUE INDEX `Participant_gameSessionId_seatNumber_key`(`gameSessionId`, `seatNumber`),
    PRIMARY KEY (`participantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameSession` (
    `gameSessionId` INTEGER NOT NULL AUTO_INCREMENT,
    `gameMode` ENUM('COMPUTER', 'RANDOM', 'FRIENDS') NOT NULL,
    `gameStatus` ENUM('WAITING', 'IN_PROGRESS', 'FINISHED') NOT NULL,
    `gameStartTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gameEndTime` DATETIME(3) NULL,

    PRIMARY KEY (`gameSessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `tokenId` INTEGER NOT NULL AUTO_INCREMENT,
    `participantId` INTEGER NOT NULL,
    `tokenIndex` INTEGER NOT NULL,
    `position` INTEGER NOT NULL,
    `tokenState` ENUM('HOME', 'ON_BOARD', 'FINISHED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Token_participantId_tokenIndex_key`(`participantId`, `tokenIndex`),
    PRIMARY KEY (`tokenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MoveLog` (
    `moveLogId` INTEGER NOT NULL AUTO_INCREMENT,
    `gameSessionId` INTEGER NOT NULL,
    `participantId` INTEGER NOT NULL,
    `diceValue` INTEGER NOT NULL,
    `tokenIndex` INTEGER NOT NULL,
    `fromPosition` INTEGER NOT NULL,
    `toPosition` INTEGER NOT NULL,
    `moveOrder` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`moveLogId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invitation` (
    `invitationId` INTEGER NOT NULL AUTO_INCREMENT,
    `gameSessionId` INTEGER NOT NULL,
    `inviterId` INTEGER NOT NULL,
    `inviteeId` INTEGER NOT NULL,
    `invitationStatus` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondedAt` DATETIME(3) NULL,

    PRIMARY KEY (`invitationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_gameSessionId_fkey` FOREIGN KEY (`gameSessionId`) REFERENCES `GameSession`(`gameSessionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`participantId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoveLog` ADD CONSTRAINT `MoveLog_gameSessionId_fkey` FOREIGN KEY (`gameSessionId`) REFERENCES `GameSession`(`gameSessionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoveLog` ADD CONSTRAINT `MoveLog_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`participantId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_gameSessionId_fkey` FOREIGN KEY (`gameSessionId`) REFERENCES `GameSession`(`gameSessionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_inviterId_fkey` FOREIGN KEY (`inviterId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invitation` ADD CONSTRAINT `Invitation_inviteeId_fkey` FOREIGN KEY (`inviteeId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
