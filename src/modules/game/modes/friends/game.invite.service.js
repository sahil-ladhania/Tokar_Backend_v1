import prisma from "../../../../db/DB.js";
import { generateRoomCode } from "../../utils/roomCode.utils.js";
import { determineHostSeat } from "../computer/computer.helpers.js";

export const createMatchSessionService = async({totalPlayers , preferredColor , userId}) => {
    try {
        const gameSessionData = await prisma.$transaction(async (tx) => {
            const roomCode = generateRoomCode(6);

            const gameSession = await tx.gameSession.create({
                data : {
                    roomCode : roomCode,
                    gameMode : 'FRIENDS',
                    gameStatus : 'WAITING',
                    maxPlayers : totalPlayers
                }
            });

            const hostSeat = determineHostSeat(preferredColor);

            const hostParticipant = await tx.participant.create({
                data : {
                    gameSessionId : gameSession.gameSessionId,
                    userId : userId,
                    isBot : false,
                    seatNumber : hostSeat
                }
            });

            const hostTokens = await tx.token.createMany({
                data : [
                    { participantId : hostParticipant.participantId , tokenIndex : 0 },
                    { participantId : hostParticipant.participantId , tokenIndex : 1 },
                    { participantId : hostParticipant.participantId , tokenIndex : 2 },
                    { participantId : hostParticipant.participantId , tokenIndex : 3 }
                ]
            });
            
            const gameSessionData = {
                roomCode : roomCode,
                gameSessionId : gameSession.gameSessionId,
                hostParticipant : hostParticipant
            };

            return gameSessionData;
        })

        return gameSessionData;
    }
    catch (error) {
        console.error("Error Creating Game Session !!!", error);
        throw new Error("Error Creating Game Session !!!" , error.message);
    }
}

export const roomCodeValidityService = async(roomCode) => {
    try {
        const isRoomCodeValid = await prisma.gameSession.findFirst({
            where : {
                roomCode : roomCode,
                gameStatus : 'WAITING'
            },
            select : {
                participants : true,
                gameSessionId : true
            }
        });

        return isRoomCodeValid;
    }
    catch (error) {
        console.error("Error Checking Room Code Validity !!!", error);
        throw new Error("Error Checking Room Code Validity !!!" , error.message);       
    }
}

export const getParticipants = async({gameSessionId}) => {
    try {
        const totalPlayers = await prisma.gameSession.findUnique({
            where : {
                gameSessionId : gameSessionId
            },
            select : {
                maxPlayers : true
            }
        });

        return totalPlayers;
    }
    catch (error) {
        console.error("Error Getting Participants !!!", error);
        throw new Error("Error Getting Participants !!!" , error.message);       
    }
}

export const isUserAlreadyInGameSessionService = async({userId , roomCode}) => {
    try {
        const gameSession = await prisma.gameSession.findFirst({
            where : {
                roomCode : roomCode,
            },
            select : {
                participants : {
                    select : {
                        userId : true
                    }
                }
            }
        });

        if(!gameSession){
            return false;
        };

        const isUserPresent = gameSession.participants.some((p) => p.userId === userId);
        return isUserPresent;
    }
    catch (error) {
        console.error("Error Checking If User Already In Game !!!", error);
        throw new Error("Error Checking If User Already In Game !!!" , error.message);              
    }
}

export const enterUserIntoGameSessionService = async({userId , roomCode}) => {
    try {
        const roomDetails = await prisma.$transaction(async (tx) => {
            const gameSessionData = await tx.gameSession.findFirst({
                where : {
                    roomCode : roomCode
                },
                select : {
                    gameSessionId : true,
                    gameMode : true,
                    gameStatus : true,
                    maxPlayers : true,
                    participants : true,
                }
            });

            const colors = ['red' , 'green' , 'blue' , 'yellow'];
            const seatMap = {
                red : 0,
                green : 1,
                blue : 2,
                yellow : 3
            };

            const takenSeatNumbers = gameSessionData.participants.map((p) => p.seatNumber);

            let availableColor = null;
            for(const color of colors){
                const seat = seatMap[color];
                if(!takenSeatNumbers.includes(seat)){
                    availableColor = color;
                    break;
                };
            };

            if(!availableColor){
                throw new Error("No available colors left!");
            }

            const userSeatNumber = seatMap[availableColor];

            const createdParticipant = await tx.participant.create({
                data : {
                    gameSessionId : gameSessionData.gameSessionId,
                    userId : userId,
                    isBot : false,
                    seatNumber : userSeatNumber
                }
            });

            const createdTokens = await tx.token.createMany({
                data : [
                    { participantId : createdParticipant.participantId , tokenIndex : 0 },
                    { participantId : createdParticipant.participantId , tokenIndex : 1 },
                    { participantId : createdParticipant.participantId , tokenIndex : 2 },
                    { participantId : createdParticipant.participantId , tokenIndex : 3 },
                ]
            });

            const roomDetails = {
                roomCode : roomCode,
                gameSessionId : gameSessionData.gameSessionId,
                participant : createdParticipant
            }

            return roomDetails;
        });

        return roomDetails;
    }
    catch (error) {
        console.error("Error Entering the User in Game Session !!!", error);
        throw new Error("Error Entering the User in Game Session !!!" , error.message);                         
    }
}