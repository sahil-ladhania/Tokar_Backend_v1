import { socketJoinFriendsRoomSchema } from "../../modes/friends/game.invite.data-validator.js";
import { enterUserIntoGameSessionService, getParticipants, isUserAlreadyInGameSessionService, roomCodeValidityService } from "../../modes/friends/game.invite.service.js";
import jwt from 'jsonwebtoken'

export const joinFriendsRoom = (socket , io) => {
    socket.on("join-friends-room" , async({roomCode , token}) => {
        const result = socketJoinFriendsRoomSchema.safeParse({roomCode , token});

        if(!result.success){
            return socket.emit("error", { message: result.error.errors[0].message });
        }

        if(!token){
            return socket.emit("error", { message: "Unauthorized: Token missing !!!" });
        };

        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            const userId = decoded.userId;

            const isRoomCodeValid = await roomCodeValidityService(roomCode);
            if(!isRoomCodeValid){
                console.log("Room Code is not Valid !!!")
                return socket.emit("error" , { message : "Room Code is Not Valid !!!" })
            }
            
            const roomSize = isRoomCodeValid.participants.length; 

            const totalPlayers = await getParticipants({gameSessionId : isRoomCodeValid.gameSessionId});

            if(totalPlayers.maxPlayers <= roomSize){
                return socket.emit("error" , { message : "Room is full !!!" })
            }

            const isUserAlreadyJoined = await isUserAlreadyInGameSessionService({userId , roomCode});

            if(isUserAlreadyJoined){
                socket.emit("error" , { message : "Already Joined !!!" });
            };

            const gameSessionData = await enterUserIntoGameSessionService({userId , roomCode});

            if(gameSessionData){
                socket.emit("joined-friends-room" , gameSessionData);
            }
        }
        catch (error) {
            console.error("Socket Auth Failed :", error.message);
            socket.emit("error", { message: "Unauthorized: Invalid token !!!" });                   
        }
    })
}