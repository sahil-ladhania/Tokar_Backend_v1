import { z } from "zod";

export const startGameSchema = z.object({
    roomCode: z.string(),
    token: z.string()
})