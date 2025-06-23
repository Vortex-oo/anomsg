import User from "@/models/user.model";
import { auth } from "../../../../auth";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";


export async function GET(req: Request) {

    //DB Connection

    await connectDB()

    const session = await auth()
    const user = session?.user

    if (!session || !user) {

        return NextResponse.json({
            message: "Not authenticated",
            success: false
        },
            { status: 401 })
    }

    try {
        const userId = user.id;

        const userResult = await User.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { "message.createdAt": -1 } }
        ])

        if (!userResult) {
            return NextResponse.json({
                message: "User Not Found",
                success: false
            },
                { status: 401 })
        }
    } catch (error) {
        return NextResponse.json({
            message: "Error in getting messages",
            Errors:error,
            success: false
        },
            { status: 401 })
    }
}