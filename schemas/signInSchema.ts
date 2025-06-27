import { z } from 'zod';


export const emailValidation = z.
                                string()
                                .email({ message: 'Invalid email address' })
                                .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Invalid email format' })

const SignInSchema = z.object({
    email: emailValidation,
    password: z.
        string()
})

export default SignInSchema;