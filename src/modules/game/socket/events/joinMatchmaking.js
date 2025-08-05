import jwt from 'jsonwebtoken';
import { attemptMatch } from "../../modes/random/game.matchmaking.logic.js";
import { enQueue } from "../../modes/random/game.matchmaking.queue.js";
import { createMatchSessionService } from "../../modes/random/game.matchmaking.service.js";
import { socketJoinMatchmakingSchema } from '../../modes/random/game.matchmaking.data-validator.js';


export const joinMatchmaking = (socket , io) => {
    socket.on("join-matchmaking" , async({ totalPlayers, preferredColor , token }) => {
        const result = socketJoinMatchmakingSchema.safeParse({ totalPlayers, preferredColor, token });

        if (!result.success) {
            return socket.emit("error", { message: result.error.errors[0].message });
        }

        if(!token){
            return socket.emit("error", { message: "Unauthorized: Token missing !!!" });
        }
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            const userId = decoded.userId;

            enQueue({socketId : socket.id , userId , totalPlayers , preferredColor}); 

            const fullGroup = attemptMatch({totalPlayers}); 

            if(fullGroup){
                const gameSessionData = await createMatchSessionService({group : fullGroup , totalPlayers});

                fullGroup.forEach((player) => {
                    return io.to(player.socketId).emit("match-found" , gameSessionData);
                });
            };
        }
        catch (error) {
            console.error("Socket Auth Failed :", error.message);
            return socket.emit("error", { message: "Unauthorized: Invalid token !!!" });     
        }
    });
}