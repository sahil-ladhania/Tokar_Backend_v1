import z from 'zod';

export const playWithComputerSchema = z.object({
    params: z.object({}).optional(), 
    query:  z.object({}).optional(), 
    body : z.object({
        numberOfPlayers : z
            .number(),
        choseTokenColor: z
            .string()
            .refine((val) => ['red', 'blue', 'green', 'yellow'].includes(val), {
              message: 'Token color must be one of red, blue, green, or yellow!',
            })
    })
});