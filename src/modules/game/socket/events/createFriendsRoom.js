import { socketCreateFriendsRoomSchema } from '../../modes/friends/game.invite.data-validator.js';
import jwt from 'jsonwebtoken';
import { createMatchSessionService } from '../../modes/friends/game.invite.service.js';

export const createFriendsRoom = (socket , io) => {
    socket.on("create-friends-room" , async({totalPlayers , preferredColor , token}) => {
        const result = socketCreateFriendsRoomSchema.safeParse({totalPlayers , preferredColor , token});

        if(!result.success){
            return socket.emit("error", { message: result.error.errors[0].message });
        }

        if(!token){
            return socket.emit("error", { message: "Unauthorized: Token missing !!!" });
        };

        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            const userId = decoded.userId;

            const gameSessionData = await createMatchSessionService({totalPlayers , preferredColor , userId});

            if(gameSessionData){
                socket.emit("created-game-session" , gameSessionData);
            }
        }
        catch (error) {
            console.error("Socket Auth Failed :", error.message);
            socket.emit("error", { message: "Unauthorized: Invalid token !!!" });                
        }
    });
}