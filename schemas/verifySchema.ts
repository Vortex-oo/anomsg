import {z}  from 'zod';


const VerifySchema = z.object({
    code:z.
        string()
        .length(6, { message: 'Verification code must be exactly 6 characters long' })
})

export default VerifySchema;