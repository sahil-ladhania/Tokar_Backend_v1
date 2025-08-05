import { checkIfItsYourTurnService, checkIfParticipantIsBotService, getGameStatusService, getValidTokensToMoveService } from "../../game-engine/game.engine.service.js";
import { rollDiceSchema } from "../../utils/board.data-validatior.js";

export const rollDice = (socket , io) => {
    socket.on("roll-dice" , async({roomCode , participantId , token}) => { // Frontend se player jb dice pe click krega , roll-dice triger hoga
        const result = rollDiceSchema.safeParse({roomCode , participantId , token});

        if(!result.success){
            return socket.emit("error" , { message : result.error.errors[0].message });
        };

        if(!token){
            return socket.emit("error" , { message : "Unauthorized: Token missing !!!" });
        };

        const gameStatus = await getGameStatusService(roomCode);

        if(gameStatus === 'IN_PROGRESS'){
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
    });
};