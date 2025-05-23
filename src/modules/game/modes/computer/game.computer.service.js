import prisma from "../../../../db/DB.js";
import { generateRoomCode } from "../../utils/roomCode.utils.js";
import { createTokensForParticipant, determineHostSeat, getAvailableBotSeats } from "./computer.helpers.js";

export const createGameSessionService = async({userId , numberOfPlayers , choseTokenColor}) => {
    try {
        const gameSessionData = await prisma.$transaction(async (tx) => {
            const roomCode = generateRoomCode(6);

            const gameSession = await tx.gameSession.create({
                data : {
                    gameMode : 'COMPUTER',
                    gameStatus : 'WAITING',
                    roomCode : roomCode
                }
            });

            const hostSeat = determineHostSeat(choseTokenColor);

            const hostParticipant = await tx.participant.create({
                data : {
                    gameSessionId : gameSession.gameSessionId,
                    userId : userId,
                    isBot : false,
                    seatNumber : hostSeat
                }
            });

            let botParticipant;
            let botParticipant_1;
            let botParticipant_2;
            let botParticipant_3;

            if(numberOfPlayers === 2){
                const botSeat = getAvailableBotSeats({hostSeat , totalPlayers : numberOfPlayers});
                botParticipant = await tx.participant.create({
                    data : {
                        gameSessionId : gameSession.gameSessionId,
                        isBot : true,
                        seatNumber : botSeat
                    }
                });

                const hostTokens = await tx.token.createMany({
                    data : [
                        { participantId : hostParticipant.participantId, tokenIndex : 0 },
                        { participantId : hostParticipant.participantId, tokenIndex : 1 },
                        { participantId : hostParticipant.participantId, tokenIndex : 2 },
                        { participantId : hostParticipant.participantId, tokenIndex : 3 }
                    ]
                });

                const botTokens = await tx.token.createMany({
                    data : [
                        { participantId : botParticipant.participantId, tokenIndex : 0 },
                        { participantId : botParticipant.participantId, tokenIndex : 1 },
                        { participantId : botParticipant.participantId, tokenIndex : 2 },
                        { participantId : botParticipant.participantId, tokenIndex : 3 }
                    ]
                });
            }
            else if(numberOfPlayers === 4){
                const botSeats = getAvailableBotSeats({hostSeat , totalPlayers : numberOfPlayers});
                botParticipant_1 = await tx.participant.create({
                    data : {
                        gameSessionId : gameSession.gameSessionId,
                        isBot : true,
                        seatNumber : botSeats[0]
                    }
                });
                botParticipant_2 = await tx.participant.create({
                    data : {
                        gameSessionId : gameSession.gameSessionId,
                        isBot : true,
                        seatNumber : botSeats[1]
                    }
                });
                botParticipant_3 = await tx.participant.create({
                    data : {
                        gameSessionId : gameSession.gameSessionId,
                        isBot : true,
                        seatNumber : botSeats[2]
                    }
                });

                const hostTokens = await tx.token.createMany({
                    data : [
                        { participantId : hostParticipant.participantId, tokenIndex : 0 },
                        { participantId : hostParticipant.participantId, tokenIndex : 1 },
                        { participantId : hostParticipant.participantId, tokenIndex : 2 },
                        { participantId : hostParticipant.participantId, tokenIndex : 3 }
                    ]
                });

                const bot_1_tokens = await createTokensForParticipant({participantId : botParticipant_1.participantId , tx});

                const bot_2_tokens = await createTokensForParticipant({participantId : botParticipant_2.participantId , tx});

                const bot_3_tokens = await createTokensForParticipant({participantId : botParticipant_3.participantId , tx});
            }

            let participants = [];
            const hostParticipantData = {
                participantId : hostParticipant.participantId,
                isBot : hostParticipant.isBot,
                seatNumber : hostParticipant.seatNumber,
            };
            participants.push(hostParticipantData);

            if(numberOfPlayers === 2){
                const botParticipantData = {
                    participantId : botParticipant.participantId,
                    isBot : botParticipant.isBot,
                    seatNumber : botParticipant.seatNumber
                };
                participants.push(botParticipantData);
            }
            else if(numberOfPlayers === 4){
                const bot_1_participantData = {
                    participantId : botParticipant_1.participantId,
                    isBot : botParticipant_1.isBot,
                    seatNumber : botParticipant_1.seatNumber
                };
                const bot_2_participantData = {
                    participantId : botParticipant_2.participantId,
                    isBot : botParticipant_2.isBot,
                    seatNumber : botParticipant_2.seatNumber
                };
                const bot_3_participantData = {
                    participantId : botParticipant_3.participantId,
                    isBot : botParticipant_3.isBot,
                    seatNumber : botParticipant_3.seatNumber
                };
                participants.push(bot_1_participantData , bot_2_participantData , bot_3_participantData);
            }

            const gameSessionData = {
                roomCode : gameSession.roomCode,
                gameSessionId : gameSession.gameSessionId,
                participants : participants
            };

            return gameSessionData;
        });

        return gameSessionData;
    }
    catch (error) {
        throw new Error("Error Creating Game Session !!!" , error.message)
    }
} 