import prisma from "../../../../db/DB.js";
import { generateRoomCode } from "../../utils/roomCode.utils.js";

export const createMatchSessionService = async ({group , totalPlayers}) => {
  try {
    const gameSessionData = await prisma.$transaction(async (tx) => {
      const roomCode = generateRoomCode(6);

      const gameSession = await tx.gameSession.create({
        data: {
          gameMode: "RANDOM",
          gameStatus: "WAITING",
          roomCode: roomCode,
          maxPlayers : totalPlayers
        },
      });

      const colorToSeat = {
        red: 0,
        blue: 1,
        yellow: 2,
        green: 3,
      };

      const participantsData = group.map((player) => ({
        userId: player.userId,
        seatNumber: colorToSeat[player.preferredColor],
        isBot: false,
        gameSessionId: gameSession.gameSessionId,
      }));

      await tx.participant.createMany({
        data: participantsData,
      });

      const participants = await tx.participant.findMany({
        where: {
          gameSessionId: gameSession.gameSessionId,
        },
      });

      const tokensData = [];
      participants.forEach((participant) => {
        for (let i = 0; i < 4; i++) {
          tokensData.push({
            participantId: participant.participantId,
            tokenIndex: i,
            position: -1,
            tokenState: "HOME",
          });
        }
      });

      await tx.token.createMany({
        data: tokensData,
      });

      return {
        roomCode,
        gameSessionId: gameSession.gameSessionId,
        participants,
      };
    });

    return gameSessionData;
  } 
  catch (error) {
    console.error("Error Creating Game Session !!!", error);
    throw new Error("Error Creating Game Session !!!" , error.message);
  }
};