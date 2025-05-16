import z from 'zod';

export const playWithComputerSchema = z.object({
    params: z.object({}).optional(), 
    query:  z.object({}).optional(), 
    body : z.object({
        // define schema
    })
})