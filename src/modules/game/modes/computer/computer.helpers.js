import { nanoid } from 'nanoid';
import prisma from '../../../../db/DB.js';

export const generateRoomCode = (length) => {
    const roomCode = nanoid(length);
    return roomCode;
}

export const determineHostSeat = (chosenColor) => {
    if(chosenColor === 'red'){
        return 0;
    }
    else if(chosenColor === 'green'){
        return 1;
    }
    else if(chosenColor === 'yellow'){
        return 2;
    }
    else if(chosenColor === 'blue'){
        return 3;
    }
}

export const getAvailableBotSeats = ({ hostSeat , totalPlayers }) => {
    if(totalPlayers === 2){
        const totalSeats = [0 , 1 , 2 , 3];
        const availableSeats = totalSeats.filter((seat) => seat !== hostSeat);
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        const randomBotSeat = availableSeats[randomIndex];
        return randomBotSeat;
    }
    else if(totalPlayers === 4){
        const totalSeats = [0 , 1 , 2 , 3];
        const availableSeats = totalSeats.filter((seat) => seat !== hostSeat);
        return availableSeats;
    }
}

export const createTokensForParticipant = async ({ participantId , tx }) => {
    try {
        const botTokens = await tx.token.createMany({
            data : [
                {
                    participantId : participantId,
                    tokenIndex : 0,
                },
                {
                    participantId : participantId,
                    tokenIndex : 1,
                },
                {
                    participantId : participantId,
                    tokenIndex : 2,
                },
                {
                    participantId : participantId,
                    tokenIndex : 3,
                }
            ]
        });
        return botTokens;   
    }
    catch (error) {
        throw new Error("Error Creating Tokens For Bot !!!" , error.message);
    }
};