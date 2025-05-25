import prisma from "../../../db/DB.js";

export const getGameSessionDataService = async(roomCode) => {
    try {
        const gameSession = await prisma.gameSession.findUnique({
            where : {
                roomCode : roomCode
            },
            select : {
                gameStatus : true,
                participants : true,
                maxPlayers : true
            }
        });

        return gameSession;
    }
    catch (error) {
        console.log("Error Getting the Game Session Data : " , error.message);
        throw new Error("Error Getting the Game Session Data : " , error.message);
    }
}

export const updatedGameSessionDataService = async(roomCode) => {
    try {
        // logic
        const updatedGameSessionData = await prisma.gameSession.update({
            where : {
                roomCode : roomCode
            },
            data : {
                gameStatus : 'IN_PROGRESS',
                gameStartTime : new Date()
            },
            select : {
                gameSessionId : true,
                participants : true,
                maxPlayers : true
            }
        });

        return updatedGameSessionData;
    }
    catch (error) {
        console.log("Error Updating the Game Session Data : " , error.message);
        throw new Error("Error Updating the Game Session Data : " , error.message);
    }
}

export const getGameStatus = async(roomCode) => {
    try {
        const gameStatus = await prisma.gameSession.findUnique({
            where : {
                roomCode : roomCode
            },
            select : {
                gameStatus : true
            }
        });

        return gameStatus.gameStatus;
    }
    catch (error) {
        console.log("Error Getting the Game Status : " , error.message);
        throw new Error("Error Getting the Game Status : " , error.message);
    }
};

export const checkIfItsYourTurn = async(participantId , roomCode) => {
    try {
        const gameSessionData = await prisma.gameSession.findUnique({
            where : {
                roomCode : roomCode
            },
            select : {
                participants : true,
                currentTurnSeat : true
            }
        });
        
        const currentParticipant = gameSessionData.participants.find((p) => p.participantId === participantId);

        if(!currentParticipant){
            console.log("Participant not found in this game session !!!");
            return false;
        }

        return currentParticipant.seatNumber === gameSessionData.currentTurnSeat;
    }
    catch (error) {
        console.log("Error Checking If Its Your Turn : " , error.message);
        throw new Error("Error Checking If Its Your Turn : " , error.message);           
    }
}