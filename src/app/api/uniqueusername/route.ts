import connectDB from "../../../../lib/db";
import { z } from "zod";
import { userValidation } from "../../../../schemas/signUpSchema";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

const userNameCheck = z.object({
    username:userValidation
})

export async function GET(request:Request){

    await connectDB()

    try {
        const {searchParams} = new URL(request.url)
        const username = searchParams.get('username')

        const result = userNameCheck.safeParse({username})
        if (!result.success) {
            const userNameError = result.error.format().username?._errors ||[]

            console.log(userNameError);
            

            return NextResponse.json({
                Error_message: userNameError,
                success:false,
            },{status:400})
        }

        const validUsername = await User.findOne({ username: username as string, isVerified:true })

        if (validUsername) {
            return NextResponse.json({
                Error_message: "Username already exists",
                success: false,
            },{status:400})
        }
        return NextResponse.json({
            message: "Username is available",
            result:result
        },{
            status:200
        })

    } catch (error) {
        console.error("Error checking username");

        return NextResponse.json(
            {
                message:"Error checking username",
                success:false
            },
            {
                status:500
            }
        )
        
    }
}