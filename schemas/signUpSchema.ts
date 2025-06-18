import { z } from 'zod';


export const userValidation = z.
        string()
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(20, { message: 'Username must be at most 20 characters long' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' });

export const SignUpSchema = z.object({
        username: userValidation,
        email: z.
                string()
                .email({ message: 'Invalid email address' })
                .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Invalid email format' }),
        password: z.
                string()
                .min(8, { message: 'Password must be at least 8 characters long' })
                .max(50, { message: 'Password must be at most 50 characters long' })
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }),
})