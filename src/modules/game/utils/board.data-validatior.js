import { z } from "zod";

export const startGameSchema = z.object({
    roomCode: z.string(),
    token: z.string()
})

export const rollDiceSchema = z.object({
    roomCode : z.string(),
    participantId : z.string(),
    token : z.string()
});

export const moveTokenSchema = z.object({
    roomCode : z.string(),
    participantId : z.string(),
    diceValue : z.number(),
    tokenIndex : z.string(),
    token : z.string()
});