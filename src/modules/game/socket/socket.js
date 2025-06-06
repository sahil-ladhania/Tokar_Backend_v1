import { joinMatchmaking } from "./events/joinMatchmaking.js";
import { createFriendsRoom } from "./events/createFriendsRoom.js";
import { joinFriendsRoom } from "./events/joinFriendsRoom.js";
import { startGame } from "./events/startGame.js";
import { rollDice } from "./events/rollDice.js";
import { moveToken } from "./events/moveToken.js";

export const initSockets = (io) => {
    io.on("connection" , (socket) => {
        console.log('New Client Connected :', socket.id);
        
        // Event Handlers
        joinMatchmaking(socket , io);
        createFriendsRoom(socket , io);
        joinFriendsRoom(socket , io);
        startGame(socket , io); 
        rollDice(socket , io);
        moveToken(socket , io);
    });
}