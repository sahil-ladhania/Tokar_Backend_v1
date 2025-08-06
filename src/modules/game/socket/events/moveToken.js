import { captureOpponentService, getAllTokensInGameSessionService, getTokenDetailsService, getTokenSeatNumberService, getValidTokensToMoveService, updateTokenPositionService, updateTokenStateService } from "../../game-engine/game.engine.service.js";
import { BLUE_HOME_ENTRANCE, BLUE_SAFE_ZONE, COMMON_PATH_LENGTH, GREEN_HOME_ENTRANCE, GREEN_SAFE_ZONE, MAX_BOARD_POSITION, RED_HOME_ENTRANCE, RED_SAFE_ZONE, YELLOW_HOME_ENTRANCE, YELLOW_SAFE_ZONE } from "../../utils/board.constant.js";
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

        // Step 1: Validate if tokenId is in valid tokens
        const validTokensToMove = await getValidTokensToMoveService({participantId, diceValue});

        if(!validTokensToMove.includes(tokenId)){
            return socket.emit("error" , { message : "Invalid Token !!!" });
        }
        
        // Step 2: Fetch the token's current data using participantId and tokenId
        const tokenData = await getTokenDetailsService({ participantId , tokenId });
        
        // Step 3: Calculate New Position for the token ("Path Switching" logic)
        // To-Do :-
        // 3a. Get the current position of the token from `tokenData.position`.
        const currentTokenPosition = tokenData.position;

        // 3b. Get the seatNumber of the token
        const tokenSeatNumber = await getTokenSeatNumberService({ participantId });

        // 3c. Based on the seatNumber, set the `homeEntrancePosition`
        let homeEntrancePosition;
        if(tokenSeatNumber === 0){
            homeEntrancePosition = RED_HOME_ENTRANCE;
        }
        if(tokenSeatNumber === 1){
            homeEntrancePosition = GREEN_HOME_ENTRANCE;
        }
        if(tokenSeatNumber === 2){
            homeEntrancePosition = YELLOW_HOME_ENTRANCE;
        }
        if(tokenSeatNumber === 3){
            homeEntrancePosition = BLUE_HOME_ENTRANCE;
        }

        // 3d. Check if the token is already in the safe zone (i.e., position >= 51)
        // If yes, then -
        if(currentTokenPosition >= COMMON_PATH_LENGTH){
            // - Add `diceValue` to current position
            const newPosition = (currentTokenPosition + diceValue);
            // - If newPosition > MAX_BOARD_POSITION (56), the move is invalid → emit error and return
            if(newPosition > MAX_BOARD_POSITION){
                return socket.emit("error", { message: "Invalid Move! You need an exact dice roll to finish." });
            }
            // - Else, assign newPosition as the sum
            else{
                const updatedTokenPosition = await updateTokenPositionService({ tokenId , newPosition});
            }
        }
        // If no, token is still in the common path -
        else{
            // - Calculate tentativePosition = currentPosition + diceValue 
            //   - If currentPosition <= homeEntrancePosition AND tentativePosition <= homeEntrancePosition:
            //      - Token hasn't crossed entrance → newPosition = tentativePosition
            //   - Else if currentPosition <= homeEntrancePosition AND tentativePosition > homeEntrancePosition:
            //     - Token enters safe zone:
            //       - stepsToEnterSafeZone = homeEntrancePosition - currentPosition
            //       - remainingSteps = diceValue - stepsToEnterSafeZone
            //       - newPosition = COMMON_PATH_LENGTH - 1 + remainingSteps
            //   - If newPosition > MAX_BOARD_POSITION (56):
            //     - Invalid move → emit error and return
            //   - Else if currentPosition > homeEntrancePosition:
            //     - Token has passed the entrance (because of board wrapping), continue moving as (pos + dice) % COMMON_PATH_LENGTH
        }

        // Step 4: Determine and Update Token State
        // To-Do :-
        // 4a. Create a variable `let newtokenState`.
        // 4b. If `tokenData.tokenState` was 'HOME', set `newtokenState` to 'ON_BOARD'.
        // 4c. If `newTokenPosition` is 56, set `newtokenState` to 'FINISHED'.
        // 4d. Otherwise, keep the state as 'ON_BOARD'.
        // 4e. Update the database with the `newtokenState` and the `newTokenPosition`.
        const tokenState = 'ON_BOARD'; // This needs to be replaced with the dynamic logic above.
        const updatedTokenState = await updateTokenStateService({ participantId , tokenId , tokenState});

        // Step 5: Check for Captures and Blocks
        // To-Do :-
        // 5a. Check if `newTokenPosition` is a safe zone. Your current check is good.
        // 5b. Get all opponent tokens at the `newTokenPosition`.
        const allTokens = await getAllTokensInGameSessionService({roomCode});
        const opponents = allTokens.filter((token) => token.position === newTokenPosition && token.participantId !== participantId); // Also make sure it's not one of your own tokens!

        // 5c. If `opponents.length === 1` AND it's not a safe zone:
            // This is a capture. Call your service to reset the opponent's token state to 'HOME' and position to -1.
        if(opponents.length === 1){
            if((newTokenPosition !== RED_SAFE_ZONE) && (newTokenPosition !== GREEN_SAFE_ZONE) && (newTokenPosition !== YELLOW_SAFE_ZONE) && (newTokenPosition !== BLUE_SAFE_ZONE)){
                const capturedOpponent = await captureOpponentService({ opponent : opponents[0].tokenId });
            }
        }
        // 5d. If `opponents.length >= 2`:
        //      - This is a block. The move is invalid. You should return an error.

        // Step 6, 7, 8: Determine Next Turn and Update Game State
        // To-Do :-
        // 6a. Define `let extraTurn = false;`.
        // 6b. Set `extraTurn = true` if `diceValue === 6` OR a capture occurred OR `newtokenState` is 'FINISHED'.
        // 7a. Get the current player's `seatNumber` and the `maxPlayers` for the session.
        // 7b. If `extraTurn` is true, the `nextTurnSeat` is the same as the current player's seat.
        // 7c. If `extraTurn` is false, calculate `nextTurnSeat = (currentSeat + 1) % maxPlayers`.
        // 8a. Update the `currentTurnSeat` in the `GameSession` table in the database.
        
        // Step 9: Add a Move Log and Emit the Result
        // To-Do :-
        // 9a. Create a new record in the `MoveLog` table with all the details of the move.
        // 9b. Emit a `token-moved` event to the `roomCode` with the final data:
        //      - `participantId`, `tokenId`, `fromPosition`, `toPosition`, `nextTurnSeat`, `wasCapture`, etc.

        // Step 10 & 11: Check for Win/Game Over Conditions
        // To-Do :-
        // 10a. After a token finishes, check if all 4 of that player's tokens have the state 'FINISHED'.
        // 10b. If so, you can emit a `player-won` event.
        // 11a. Check if all but one player have won. If so, the game is over. Update `gameStatus` to 'FINISHED'.

        // Step 12: Trigger Bot's Turn
        // To-Do :-
        // 12a. After calculating `nextTurnSeat`, check if the participant in that seat `isBot`.
        // 12b. If it is, call a server-side function (e.g., `executeBotTurn(nextTurnSeat, roomCode)`) which will then handle the bot's logic.
    })
}