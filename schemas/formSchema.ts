import { z } from "zod"

const formSchema = z.object({
    email: z.string().email(),

})