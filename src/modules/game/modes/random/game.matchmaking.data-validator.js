import { z } from "zod";

export const socketJoinMatchmakingSchema = z.object({
  totalPlayers: z.number(),
  preferredColor: z
    .string()
    .refine((val) => ['red', 'blue', 'green', 'yellow'].includes(val), {
      message: 'Token color must be one of red, blue, green, or yellow!',
    }),
  token: z.string()
});