import { getGameSessionDataService, updatedGameSessionDataService } from "../../game-engine/game.engine.service.js";
import { startGameSchema } from "../../utils/board.data-validatior.js";

export const startGame = (socket , io) => {
    socket.on("start-game" , async ({roomCode , token}) => { 
        const result = startGameSchema.safeParse({roomCode , token});

        if(!result.success){
            return socket.emit("error" , { message : result.error.errors[0].message });
        };

        if(!token){
            return socket.emit("error" , { message : "Unauthorized: Token missing !!!" });
        };

        const gameSessionData = await getGameSessionDataService(roomCode); 
        const currentGameStatus = gameSessionData.gameStatus; 
        const currentParticipantsCount = gameSessionData.participants.length;

        if((currentGameStatus === 'WAITING') && (currentParticipantsCount === gameSessionData.maxPlayers)){
            const updatedGameSessionData = await updatedGameSessionDataService(roomCode); 

            const sortedParticipants = [...updatedGameSessionData.participants].sort((a , b) => a.seatNumber - b.seatNumber);
            const firstParticipant = sortedParticipants[0];
            const firstTurn = firstParticipant.seatNumber;

            io.to(roomCode).emit("game-started" , {
                participants : updatedGameSessionData.participants,
                firstTurn : firstTurn
            });
        }
        else{
            return socket.emit("error", { message: `Cannot start game : status is ${gameSessionData.gameStatus}, participants=${gameSessionData.participants.length}/${gameSessionData.maxPlayers}` });
        }
    });
};