import prisma from "../../../db/DB.js";

export const getGameSessionDataService = async(roomCode) => {
    try {
        const gameSession = await prisma.gameSession.findFirst({
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