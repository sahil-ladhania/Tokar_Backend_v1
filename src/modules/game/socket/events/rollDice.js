import { checkIfItsYourTurn, getGameStatus } from "../../game-engine/game.engine.service.js";
import { rollDiceSchema } from "../../utils/board.data-validatior.js";

export const rollDice = (socket , io) => {
    socket.emit("roll-dice" , async({roomCode , participantId , token}) => {
        // 1. Validate inputs with Zod
        const result = rollDiceSchema.safeParse({roomCode , participantId , token});

        if(!result.success){
            return socket.emit("error" , { message : result.error.errors[0].message });
        };

        if(!token){
            return socket.emit("error" , { message : "Unauthorized: Token missing !!!" });
        };

        // 2. Verify game is in-progress
        const gameStatus = await getGameStatus(roomCode);

        if(gameStatus === 'IN_PROGRESS'){
            // 3. Verify it is this participant’s turn
            const isItYourTurn = await checkIfItsYourTurn(participantId , roomCode); 
            if(isItYourTurn){
                // 4. Generate random dice value (1–6)
                const diceValue = Math.floor(Math.random() * 6) + 1;

                // 5. Get all valid tokens for that dice value (via boardUtils.getValidMoves)
                // 6. Emit to room → "dice-rolled" with { participantId, diceValue, validMoves }      
                io.to(roomCode).emit("dice-rolled", {
                    participantId,
                    diceValue,
                    validMoves
                });
            }
        }
    });
};