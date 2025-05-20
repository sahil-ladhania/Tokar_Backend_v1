import { deQueue, queueStore } from "./game.matchmaking.queue.js"

export const attemptMatch = ({totalPlayers}) => {
    const fullGroup = deQueue(totalPlayers);
    if (!fullGroup){
        return null;
    };

    queueStore[totalPlayers] = queueStore[totalPlayers].filter(q =>
        !fullGroup.some(p => p.userId === q.userId)
    );
    return fullGroup;
}