import { moveTokenSchema } from "../../utils/board.data-validatior.js"

export const  moveToken = (socket , io) => {
    socket.on("move-token" , async({roomCode , participantId , diceValue , tokenIndex , token}) => {
        const result = moveTokenSchema.safeParse({roomCode , participantId , diceValue , tokenIndex , token});

        if(!result.success){
            return socket.emit("error" , { message : result.error.errors[0].message });
        }

        if(!token){
            return socket.emit("error" , { message : "Unauthorized: Token missing !!!" });
        }

        // Step 1: Validate if tokenIndex is in valid tokens (use getValidTokensToMoveService)
        // Step 2: Fetch the token using participantId and tokenIndex
        // Step 3: Calculate new position = current position + diceValue
        // Step 4: Update token state → HOME → ON_BOARD, or → FINISHED if it reaches end
        // Step 5: Check if any opponent token exists at new position → if yes, capture (reset to HOME)
        // Step 6: Add MoveLog entry (gameSessionId, participantId, tokenIndex, fromPos, toPos, diceValue)
        // Step 7: Compute nextTurnSeat → (same if diceValue === 6) else (seat + 1) % totalPlayers
        // Step 8: Update gameSession.currentTurnSeat
        // Step 9: Emit "token-moved" event to room with participantId, tokenIndex, fromPos, toPos, nextTurnSeat
        // Step 10: (Optional) Check if player has won (all tokens FINISHED)
        // Step 11: (Optional) Check if game over (all players done)
        // Step 12: (Optional) If bot’s turn → trigger rollAndMove()
    })
}