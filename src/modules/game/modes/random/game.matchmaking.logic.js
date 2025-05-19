import { deQueue } from "./game.matchmaking.queue.js"

export const attemptMatch = ({socketId, userId, preferredColor, totalPlayers}) => {
    const groupFromQueue = deQueue(totalPlayers , preferredColor);
    let fullGroup;

    if(groupFromQueue === null){    
        return null;
    }
    else{
        fullGroup = [
            {socketId, userId, preferredColor},
            ...groupFromQueue
        ];
    };

    return fullGroup;
}