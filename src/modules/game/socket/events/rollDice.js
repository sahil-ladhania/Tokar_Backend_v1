import { checkIfItsYourTurnService, checkIfParticipantIsBotService, getGameStatusService, getValidTokensToMoveService } from "../../game-engine/game.engine.service.js";
import { rollDiceSchema } from "../../utils/board.data-validatior.js";

export const rollDice = (socket , io) => {
    socket.on("roll-dice" , async({roomCode , participantId , token}) => {
        const result = rollDiceSchema.safeParse({roomCode , participantId , token});

        if(!result.success){
            return socket.emit("error" , { message : result.error.errors[0].message });
        };

        if(!token){
            return socket.emit("error" , { message : "Unauthorized: Token missing !!!" });
        };

        const gameStatus = await getGameStatusService(roomCode);

        if(gameStatus === 'IN_PROGRESS'){
            const isParticipantBot = await checkIfParticipantIsBotService(participantId , roomCode);

            if(isParticipantBot){
                // Logic to be implemented ...
            }
            else{
                const isItYourTurn = await checkIfItsYourTurnService(participantId , roomCode);
                if(isItYourTurn){
                    const diceValue = Math.floor(Math.random() * 6) + 1;

                    const validTokensToMove = await getValidTokensToMoveService({participantId , diceValue});

                    io.to(roomCode).emit("dice-rolled", {
                        participantId : participantId,
                        diceValue : diceValue,
                        validTokensToMove : validTokensToMove
                    });
                }
            }
        }
    });
};