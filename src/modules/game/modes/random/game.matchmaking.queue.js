
export const queueStore = {
    "2" : [],
    "4" : []
};

export const enQueue = ({socketId , userId , totalPlayers , preferredColor}) => {
    if(totalPlayers === 2){
        queueStore[2].push({
            "socketId" : socketId,
            "userId" : userId,
            "preferredColor" : preferredColor
        });
    }
    else if(totalPlayers === 4){
        queueStore[4].push({
            "socketId" : socketId,
            "userId" : userId,
            "preferredColor" : preferredColor
        });
    }
}

export const deQueue = (totalPlayers) => {
    const selectedPlayers = [];
    const queue = queueStore[totalPlayers];

    const usedColours = new Set();

    for (let i = 0; i < queue.length; i++) {
        const player = queue[i];
        if (!usedColours.has(player.preferredColor)) {
            selectedPlayers.push(player);
            usedColours.add(player.preferredColor);
        }
        if (selectedPlayers.length === totalPlayers) {
            return selectedPlayers;
        }
    }

    return null;
};