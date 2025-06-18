import { z } from 'zod';


export const userValidation = z.
                            string()
                            .min(3, { message: 'Username must be at least 3 characters long' })
                            .max(20, { message: 'Username must be at most 20 characters long' })
                            .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' });      

export const SignInSchema = z.object({
    username: userValidation,
    password: z.
                string()
})