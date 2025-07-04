import {z} from 'zod';

export const messageSchema = z.object({
    content: z.
            string()
            .min(3, { message: 'message must be at least 3 characters long' })
            .max(500, { message: 'message must be at most 500 characters long' }),
})