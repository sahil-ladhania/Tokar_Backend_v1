import { captureOpponentService, getAllTokensInGameSessionService, getTokenDetailsService, getValidTokensToMoveService, updateTokenStateService } from "../../game-engine/game.engine.service.js";
import { BLUE_SAFE_ZONE, GREEN_SAFE_ZONE, RED_SAFE_ZONE, YELLOW_SAFE_ZONE } from "../../utils/board.constant.js";
import { moveTokenSchema } from "../../utils/board.data-validatior.js"

export const  moveToken = (socket , io) => {
    socket.on("move-token" , async({roomCode , participantId , diceValue , tokenId , token}) => {
        const result = moveTokenSchema.safeParse({roomCode , participantId , diceValue , tokenId , token});

        if(!result.success){
            return socket.emit("error" , { message : result.error.errors[0].message });
        }

        if(!token){
            return socket.emit("error" , { message : "Unauthorized: Token missing !!!" });
        }

        // Step 1: Validate if tokenIndex is in valid tokens (use getValidTokensToMoveService)
        const validTokensToMove = await getValidTokensToMoveService({participantId, diceValue});

        if(!validTokensToMove.includes(tokenId)){
            return socket.emit("error" , { message : "Invalid Token !!!" });
        }
        // Step 2: Fetch the token using participantId and tokenId
        const tokenData = await getTokenDetailsService({ participantId , tokenId });
        
        // Step 3: Calculate new position = current position + diceValue ----> Think of Path Switching 
        const newTokenPosition = tokenData.position + diceValue;

        // Step 4: Update token state → HOME → ON_BOARD, or → FINISHED if it reaches end
        const tokenState = 'ON_BOARD';
        const updatedTokenState = await updateTokenStateService({ participantId , tokenId , tokenState});

        // Step 5: Check if any opponent token exists at new position → if yes, capture (reset to HOME)
        const allTokens = await getAllTokensInGameSessionService({roomCode});

        const opponents = allTokens.filter((token) => token.position === newTokenPosition);

        if(opponents.length === 1){
            // check if its not a safe place
            if((newTokenPosition !== RED_SAFE_ZONE) && (newTokenPosition !== GREEN_SAFE_ZONE) && (newTokenPosition !== YELLOW_SAFE_ZONE) && (newTokenPosition !== BLUE_SAFE_ZONE)){
                // capture the token
                const capturedOpponent = await captureOpponentService({ opponent : opponents[0].tokenId });
            }
        }
        // Step 7: Compute nextTurnSeat → (same if diceValue === 6) else (seat + 1) % totalPlayers
        if(diceValue === 6){
            // rollDice event will be triggered again
        }
        // Step 8: Update gameSession.currentTurnSeat
        // Step 9: Emit "token-moved" event to room with participantId, tokenIndex, fromPos, toPos, nextTurnSeat
        // Step 10: (Optional) Check if player has won (all tokens FINISHED)
        // Step 11: (Optional) Check if game over (all players done)
        // Step 12: (Optional) If bot’s turn → trigger rollAndMove()
    })
}