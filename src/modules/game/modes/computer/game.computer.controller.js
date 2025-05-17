import { sendError } from "../../../../utils/sendError.js";
import { sendSuccess } from "../../../../utils/sendSuccess.js";
import { createGameSessionService } from "./game.computer.service.js";

export const createGameSessionController = async(req , res , next) => {
    try {
        const {numberOfPlayers , choseTokenColor} = req.body;
        console.log(numberOfPlayers)
        console.log(choseTokenColor)

        const {userId} = req.user;
        console.log(userId);

        const gameSessionData = await createGameSessionService({userId , numberOfPlayers , choseTokenColor});
        console.log(gameSessionData);
        if(!gameSessionData){
            return sendError(res , 500 , "Didnt got the Game Session Data !!!");
        }
        return sendSuccess(res , 201 , {gameSessionData : gameSessionData});
    }
    catch (error) {
        next(error);
    }
}