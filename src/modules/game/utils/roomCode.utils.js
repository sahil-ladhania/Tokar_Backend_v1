import { nanoid } from 'nanoid';

export const generateRoomCode = (length) => {
    const roomCode = nanoid(length);
    return roomCode;
}
